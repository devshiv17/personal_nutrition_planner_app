import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Toast, { ToastProps } from '../components/ui/Toast/Toast';
import styled from 'styled-components';

interface ToastData {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  action?: {
    label: string;
    onClick: () => void;
  };
  showCloseButton?: boolean;
}

interface NotificationContextType {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (message: string, options?: Partial<ToastData>) => string;
  error: (message: string, options?: Partial<ToastData>) => string;
  warning: (message: string, options?: Partial<ToastData>) => string;
  info: (message: string, options?: Partial<ToastData>) => string;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const ToastContainer = styled.div<{ $position: ToastProps['position'] }>`
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 100vh;
  overflow: hidden;
  pointer-events: none;
  
  ${({ $position }) => {
    switch ($position) {
      case 'top-left':
        return `
          top: 1rem;
          left: 1rem;
        `;
      case 'top-right':
        return `
          top: 1rem;
          right: 1rem;
        `;
      case 'top-center':
        return `
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'bottom-left':
        return `
          bottom: 1rem;
          left: 1rem;
          flex-direction: column-reverse;
        `;
      case 'bottom-right':
        return `
          bottom: 1rem;
          right: 1rem;
          flex-direction: column-reverse;
        `;
      case 'bottom-center':
        return `
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          flex-direction: column-reverse;
        `;
      default:
        return `
          top: 1rem;
          right: 1rem;
        `;
    }
  }}
  
  > * {
    pointer-events: auto;
  }
  
  @media (max-width: 768px) {
    left: 1rem !important;
    right: 1rem !important;
    transform: none !important;
    
    ${({ $position }) => {
      if ($position?.includes('top')) {
        return 'top: 1rem;';
      }
      return 'bottom: 1rem;';
    }}
  }
`;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addToast = useCallback((toastData: Omit<ToastData, 'id'>) => {
    const id = generateId();
    const toast: ToastData = {
      id,
      position: 'top-right',
      duration: 5000,
      showCloseButton: true,
      ...toastData
    };
    
    setToasts(prev => [...prev, toast]);
    return id;
  }, [generateId]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback((message: string, options?: Partial<ToastData>) => {
    return addToast({ ...options, message, type: 'success' });
  }, [addToast]);

  const error = useCallback((message: string, options?: Partial<ToastData>) => {
    return addToast({ ...options, message, type: 'error', duration: 0 }); // Errors don't auto-dismiss
  }, [addToast]);

  const warning = useCallback((message: string, options?: Partial<ToastData>) => {
    return addToast({ ...options, message, type: 'warning' });
  }, [addToast]);

  const info = useCallback((message: string, options?: Partial<ToastData>) => {
    return addToast({ ...options, message, type: 'info' });
  }, [addToast]);

  const value: NotificationContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  };

  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<string, ToastData[]>);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render toast containers for each position */}
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <ToastContainer key={position} $position={position as ToastProps['position']}>
          {positionToasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              position={toast.position}
              onClose={removeToast}
              showCloseButton={toast.showCloseButton}
              action={toast.action}
            />
          ))}
        </ToastContainer>
      ))}
    </NotificationContext.Provider>
  );
};

export { NotificationContext };

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

// Convenience hook for toast notifications
export const useToast = () => {
  const { success, error, warning, info } = useNotification();
  return { success, error, warning, info };
};