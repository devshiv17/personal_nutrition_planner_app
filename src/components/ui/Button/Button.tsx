import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../../../types';
import { cn } from '../../../utils/cn';

export interface ButtonProps extends BaseComponentProps, 
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ripple?: boolean;
}

const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={cn('animate-spin', className)}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Ripple = ({ x, y }: { x: number; y: number }) => (
  <span
    className="absolute animate-ping bg-current opacity-20 rounded-full pointer-events-none"
    style={{
      left: x - 10,
      top: y - 10,
      width: 20,
      height: 20,
    }}
  />
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      ripple = true,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

    // Base classes
    const baseClasses = 'btn';
    
    // Variant classes
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      danger: 'btn-danger',
      success: 'btn-success',
      warning: 'btn-warning',
    };

    // Size classes
    const sizeClasses = {
      xs: 'btn-xs',
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
      xl: 'btn-xl',
    };

    // Full width class
    const fullWidthClass = fullWidth ? 'w-full' : '';
    
    // Loading class
    const loadingClass = loading ? 'cursor-wait' : '';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;

      // Create ripple effect
      if (ripple) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { x, y, id: Date.now() };

        setRipples((prev) => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
          setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
        }, 600);
      }

      onClick?.(e);
    };

    // Combine all classes
    const buttonClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidthClass,
      loadingClass,
      className
    );

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        className={buttonClasses}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <Ripple key={ripple.id} x={ripple.x} y={ripple.y} />
        ))}

        {/* Loading spinner */}
        {loading && (
          <LoadingSpinner className={cn('mr-2', size === 'xs' ? 'w-3 h-3' : 'w-4 h-4')} />
        )}

        {/* Left icon */}
        {!loading && leftIcon && (
          <span className={cn('mr-2 flex-shrink-0', size === 'xs' ? 'w-3 h-3' : 'w-4 h-4')}>
            {leftIcon}
          </span>
        )}

        {/* Button content */}
        <span className={cn('flex-1', loading && 'opacity-70')}>
          {children}
        </span>

        {/* Right icon */}
        {!loading && rightIcon && (
          <span className={cn('ml-2 flex-shrink-0', size === 'xs' ? 'w-3 h-3' : 'w-4 h-4')}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;