import React from 'react';
import { BaseComponentProps } from '../../../types';

export interface ContainerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
  fluid?: boolean;
  noPadding?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  size = 'lg',
  centered = true,
  fluid = false,
  noPadding = false,
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-none',
    full: 'max-w-full',
  };

  let containerClasses = [];

  // Size classes
  if (!fluid) {
    containerClasses.push(sizeClasses[size]);
  } else {
    containerClasses.push('w-full');
  }

  // Centering
  if (centered) {
    containerClasses.push('mx-auto');
  }

  // Padding
  if (!noPadding) {
    containerClasses.push('px-4', 'sm:px-6', 'lg:px-8');
  }

  return (
    <div
      className={[...containerClasses, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;