import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { BaseComponentProps } from '../../../types';
import { ROUTES } from '../../../constants';

export interface MobileMenuProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'bottom';
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  position = 'right',
  className = '',
}) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navigation = [
    {
      name: 'Dashboard',
      href: ROUTES.DASHBOARD,
      current: location.pathname === ROUTES.DASHBOARD,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Meal Planning',
      href: ROUTES.MEAL_PLANNING,
      current: location.pathname.startsWith('/meal-planning'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m9-9h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-9-9v2m0 0V9a2 2 0 012-2h6a2 2 0 012 2v2M7 19h10" />
        </svg>
      ),
    },
    {
      name: 'Food Logging',
      href: ROUTES.FOOD_LOGGING,
      current: location.pathname.startsWith('/food-logging'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      name: 'Voice Logging',
      href: ROUTES.VOICE_LOGGING,
      current: location.pathname.startsWith('/voice-logging'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      badge: 'Beta',
    },
    {
      name: 'Progress',
      href: ROUTES.PROGRESS,
      current: location.pathname.startsWith('/progress'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const userNavigation = [
    {
      name: 'Profile',
      href: ROUTES.PROFILE,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: 'Settings',
      href: ROUTES.SETTINGS,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
    },
  ];

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return {
          container: 'justify-start',
          menu: 'transform transition-transform duration-300 ease-in-out',
          open: 'translate-x-0',
          closed: '-translate-x-full',
        };
      case 'right':
        return {
          container: 'justify-end',
          menu: 'transform transition-transform duration-300 ease-in-out',
          open: 'translate-x-0',
          closed: 'translate-x-full',
        };
      case 'bottom':
        return {
          container: 'items-end justify-center',
          menu: 'transform transition-transform duration-300 ease-in-out',
          open: 'translate-y-0',
          closed: 'translate-y-full',
        };
      default:
        return {
          container: 'justify-end',
          menu: 'transform transition-transform duration-300 ease-in-out',
          open: 'translate-x-0',
          closed: 'translate-x-full',
        };
    }
  };

  const positionClasses = getPositionClasses();

  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Menu Container */}
      <div className={`fixed inset-0 flex ${positionClasses.container}`}>
        <div
          className={`
            ${positionClasses.menu}
            ${isOpen ? positionClasses.open : positionClasses.closed}
            ${position === 'bottom' ? 'w-full max-h-[80vh]' : 'w-80 h-full max-w-[90vw]'}
            bg-white shadow-2xl
            ${className}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-gradient">NutriPlan</span>
            </Link>
            
            <button
              onClick={onClose}
              className="btn btn-ghost p-2"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-neutral-900 truncate">
                    {user.name || `${user.firstName} ${user.lastName}`}
                  </p>
                  <p className="text-sm text-neutral-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isAuthenticated ? (
              <div className="px-6 py-6">
                {/* Main Navigation */}
                <nav className="space-y-2">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                    Navigation
                  </h3>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        flex items-center justify-between p-3 rounded-xl transition-all duration-200
                        ${item.current 
                          ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="badge badge-accent badge-sm">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>

                {/* User Navigation */}
                <nav className="mt-8 space-y-2">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                    Account
                  </h3>
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-3 p-3 rounded-xl text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200"
                    >
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                  
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl text-error-600 hover:bg-error-50 transition-all duration-200"
                  >
                    <LogoutIcon />
                    <span className="font-medium">Sign out</span>
                  </button>
                </nav>
              </div>
            ) : (
              <div className="px-6 py-6 space-y-4">
                <Link
                  to={ROUTES.LOGIN}
                  className="block w-full btn btn-outline"
                  onClick={onClose}
                >
                  Sign in
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="block w-full btn btn-primary"
                  onClick={onClose}
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;