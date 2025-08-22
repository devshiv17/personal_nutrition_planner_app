import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClose: (id: string) => void;
  showCloseButton?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInBottom = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
    height: auto;
    margin-bottom: 0.5rem;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
    height: 0;
    margin-bottom: 0;
  }
`;

const getAnimationForPosition = (position: ToastProps['position']) => {
  switch (position) {
    case 'top-left':
    case 'bottom-left':
      return slideInLeft;
    case 'top-center':
      return slideInTop;
    case 'bottom-center':
      return slideInBottom;
    default:
      return slideInRight;
  }
};

const ToastContainer = styled.div<{ 
  $type: ToastProps['type']; 
  $position: ToastProps['position'];
  $isClosing: boolean;
}>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
  border-left: 4px solid;
  max-width: 400px;
  min-width: 300px;
  position: relative;
  overflow: hidden;
  animation: ${({ $position, $isClosing }) => 
    $isClosing 
      ? css`${slideOut} 0.3s ease-in-out forwards`
      : css`${getAnimationForPosition($position)} 0.3s ease-out`
  };

  ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return css`
          border-left-color: ${theme.colors.success};
          background: linear-gradient(90deg, ${theme.colors.success}08 0%, white 100%);
        `;
      case 'error':
        return css`
          border-left-color: ${theme.colors.error};
          background: linear-gradient(90deg, ${theme.colors.error}08 0%, white 100%);
        `;
      case 'warning':
        return css`
          border-left-color: ${theme.colors.warning || '#f59e0b'};
          background: linear-gradient(90deg, ${theme.colors.warning || '#f59e0b'}08 0%, white 100%);
        `;
      case 'info':
      default:
        return css`
          border-left-color: ${theme.colors.primary};
          background: linear-gradient(90deg, ${theme.colors.primary}08 0%, white 100%);
        `;
    }
  }}
`;

const IconWrapper = styled.div<{ $type: ToastProps['type'] }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
  margin-top: 2px;

  ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return css`background: ${theme.colors.success};`;
      case 'error':
        return css`background: ${theme.colors.error};`;
      case 'warning':
        return css`background: ${theme.colors.warning || '#f59e0b'};`;
      case 'info':
      default:
        return css`background: ${theme.colors.primary};`;
    }
  }}
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Message = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
  line-height: 1.4;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  text-align: left;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ProgressBar = styled.div<{ $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: ${({ theme }) => theme.colors.primary};
  animation: progress ${({ $duration }) => $duration}ms linear;

  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

const getIcon = (type: ToastProps['type']) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '!';
    case 'info':
    default:
      return 'i';
  }
};

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 5000,
  position = 'top-right',
  onClose,
  showCloseButton = true,
  action
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, handleClose]);

  return (
    <ToastContainer 
      $type={type} 
      $position={position}
      $isClosing={isClosing}
      role="alert"
      aria-live="polite"
    >
      <IconWrapper $type={type}>
        {getIcon(type)}
      </IconWrapper>
      
      <Content>
        <Message>{message}</Message>
        {action && (
          <ActionButton onClick={action.onClick}>
            {action.label}
          </ActionButton>
        )}
      </Content>
      
      {showCloseButton && (
        <CloseButton onClick={handleClose} aria-label="Close notification">
          ✕
        </CloseButton>
      )}
      
      {duration > 0 && !isClosing && (
        <ProgressBar $duration={duration} />
      )}
    </ToastContainer>
  );
};

export default Toast;