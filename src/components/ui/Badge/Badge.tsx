import React from 'react';
import { BaseComponentProps } from '../../../types';

export interface BadgeProps extends BaseComponentProps {
  variant?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  href?: string;
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  href,
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'badge';
  
  const variantClasses = {
    neutral: 'badge-neutral',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const RemoveIcon = () => (
    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const badgeClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {dot && (
        <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      )}
      {icon && (
        <span className="mr-1.5">{icon}</span>
      )}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-black/10 rounded p-0.5 transition-colors"
          aria-label="Remove"
        >
          <RemoveIcon />
        </button>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`${badgeClasses} hover:opacity-80 transition-opacity`}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <span className={badgeClasses} {...props}>
      {content}
    </span>
  );
};

export default Badge;