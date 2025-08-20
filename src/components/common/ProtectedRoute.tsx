import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useSession } from '../../hooks';
import { ROUTES } from '../../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  redirectTo?: string;
  roles?: string[];
  permissions?: string[];
  requiresEmailVerification?: boolean;
  requiresOnboarding?: boolean;
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className={`spinner ${sizeClasses[size]}`} />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

interface SessionWarningModalProps {
  isOpen: boolean;
  timeRemaining: number;
  onExtend: () => void;
  onLogout: () => void;
}

const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
  isOpen,
  timeRemaining,
  onExtend,
  onLogout,
}) => {
  const [countdown, setCountdown] = useState(timeRemaining);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1000) {
          onLogout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onLogout]);

  useEffect(() => {
    setCountdown(timeRemaining);
  }, [timeRemaining]);

  if (!isOpen) return null;

  const minutes = Math.floor(countdown / 60000);
  const seconds = Math.floor((countdown % 60000) / 1000);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="card-body text-center">
          <div className="text-warning-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Session Expiring Soon
          </h3>
          
          <p className="text-gray-600 mb-4">
            Your session will expire in <span className="font-mono font-bold text-error-600">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Would you like to extend your session?
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onExtend}
              className="btn btn-primary flex-1"
            >
              Extend Session
            </button>
            <button
              onClick={onLogout}
              className="btn btn-outline flex-1"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAuth = true,
  redirectTo = ROUTES.LOGIN,
  roles = [],
  permissions = [],
  requiresEmailVerification = false,
  requiresOnboarding = false
}) => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const { sessionWarning, extendSession, dismissWarning, sessionInfo } = useSession();
  const location = useLocation();

  // Handle session warning modal
  const handleExtendSession = async () => {
    try {
      await extendSession();
      dismissWarning();
    } catch (error) {
      console.error('Failed to extend session:', error);
      await logout();
    }
  };

  const handleLogout = async () => {
    dismissWarning();
    await logout();
  };

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return <LoadingSpinner />;
  }

  // If authentication is not required, render children
  if (!requiresAuth) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if session is valid
  if (!sessionInfo.isValid) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check email verification requirement
  if (requiresEmailVerification && user && !user.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // Check onboarding requirement
  if (requiresOnboarding && user) {
    const onboardingCompleted = localStorage.getItem('onboarding_completed') === 'true';
    if (!onboardingCompleted && location.pathname !== ROUTES.ONBOARDING) {
      return <Navigate to={ROUTES.ONBOARDING} state={{ from: location }} replace />;
    }
  }

  // Check user roles if specified
  if (roles.length > 0 && user) {
    const userRoles = (user as any).roles || [];
    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" state={{ from: location, requiredRoles: roles }} replace />;
    }
  }

  // Check permissions if specified
  if (permissions.length > 0 && user) {
    const userPermissions = (user as any).permissions || [];
    const hasRequiredPermission = permissions.some(permission => userPermissions.includes(permission));
    
    if (!hasRequiredPermission) {
      return <Navigate to="/forbidden" state={{ from: location, requiredPermissions: permissions }} replace />;
    }
  }

  return (
    <>
      {children}
      
      {/* Session Warning Modal */}
      <SessionWarningModal
        isOpen={sessionWarning}
        timeRemaining={sessionInfo.timeToExpiry}
        onExtend={handleExtendSession}
        onLogout={handleLogout}
      />
    </>
  );
};

export default ProtectedRoute;