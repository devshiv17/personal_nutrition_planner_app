import React from 'react';
import { BaseComponentProps } from '../../../types';

export interface CardProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = false,
  hoverable = false,
  clickable = false,
  onClick,
  ...props
}) => {
  // Base classes
  const baseClasses = 'card';

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Shadow classes
  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-medium',
    lg: 'shadow-large',
  };

  // Interactive classes
  const borderClass = border ? 'border' : '';
  const hoverableClass = hoverable ? 'hover:-translate-y-1 hover:shadow-medium transition-all duration-200' : '';
  const clickableClass = (clickable || onClick) ? 'cursor-pointer hover:shadow-medium active:transform active:translate-y-0.5 transition-all duration-150' : '';

  // Combine all classes
  const cardClasses = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    borderClass,
    hoverableClass,
    clickableClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      {...props}
      className={cardClasses}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;