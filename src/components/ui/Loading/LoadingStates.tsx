import React from 'react';
import { cn } from '../../../utils/cn';

// Loading Spinner Component
export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'neutral' | 'white';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'primary', 
  className 
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    neutral: 'text-neutral-500',
    white: 'text-white',
  };

  return (
    <svg
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      fill="none"
      viewBox="0 0 24 24"
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
};

// Skeleton Component
export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  lines?: number;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  width, 
  height, 
  circle = false, 
  lines = 1, 
  animated = true 
}) => {
  const baseClasses = cn(
    'bg-neutral-200',
    circle ? 'rounded-full' : 'rounded-md',
    animated && 'animate-pulse',
    className
  );

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              index === lines - 1 && 'w-3/4', // Last line is shorter
              !width && !height && 'h-4'
            )}
            style={index === lines - 1 ? { ...style, width: '75%' } : style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, !width && !height && 'h-4 w-full')}
      style={style}
    />
  );
};

// Skeleton Variants
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('card p-6 space-y-4', className)}>
    <div className="flex items-center space-x-4">
      <Skeleton circle width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton width="75%" height={16} />
        <Skeleton width="50%" height={14} />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton lines={3} />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton width={80} height={32} />
      <Skeleton width={60} height={24} />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ 
  rows?: number; 
  cols?: number; 
  className?: string; 
}> = ({ rows = 5, cols = 4, className }) => (
  <div className={cn('space-y-4', className)}>
    {/* Table Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }).map((_, index) => (
        <Skeleton key={`header-${index}`} height={20} />
      ))}
    </div>
    
    {/* Table Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div 
        key={`row-${rowIndex}`} 
        className="grid gap-4" 
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} height={16} />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonList: React.FC<{ 
  items?: number; 
  showAvatar?: boolean; 
  className?: string; 
}> = ({ items = 5, showAvatar = true, className }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3">
        {showAvatar && <Skeleton circle width={40} height={40} />}
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={12} />
        </div>
        <Skeleton width={60} height={24} />
      </div>
    ))}
  </div>
);

// Loading States
export interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  type = 'spinner', 
  size = 'md', 
  text, 
  className 
}) => {
  if (type === 'dots') {
    return (
      <div className={cn('flex items-center space-x-1', className)}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              'bg-primary-500 rounded-full animate-bounce',
              size === 'sm' && 'w-2 h-2',
              size === 'md' && 'w-3 h-3',
              size === 'lg' && 'w-4 h-4'
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
        {text && <span className="ml-3 text-sm text-neutral-600">{text}</span>}
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={cn('space-y-4', className)}>
        <SkeletonCard />
        {text && <div className="text-center text-sm text-neutral-600">{text}</div>}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      <Spinner size={size} />
      {text && <div className="text-sm text-neutral-600">{text}</div>}
    </div>
  );
};

// Page Loading Component
export const PageLoading: React.FC<{ 
  title?: string; 
  description?: string; 
  className?: string; 
}> = ({ title = 'Loading...', description, className }) => (
  <div className={cn(
    'flex flex-col items-center justify-center min-h-[400px] space-y-4',
    className
  )}>
    <Spinner size="lg" />
    <div className="text-center space-y-2">
      <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-600 max-w-sm">{description}</p>
      )}
    </div>
  </div>
);

// Shimmer Effect Component
export const Shimmer: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('shimmer', className)}>
    <div className="shimmer-content" />
  </div>
);

// Progressive Loading Component
export interface ProgressiveLoadingProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const ProgressiveLoading: React.FC<ProgressiveLoadingProps> = ({
  steps,
  currentStep,
  className
}) => (
  <div className={cn('space-y-6', className)}>
    <div className="flex items-center justify-center">
      <Spinner size="lg" />
    </div>
    
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className={cn(
            'w-4 h-4 rounded-full flex items-center justify-center text-xs',
            index < currentStep && 'bg-success-500 text-white',
            index === currentStep && 'bg-primary-500 text-white animate-pulse',
            index > currentStep && 'bg-neutral-200 text-neutral-500'
          )}>
            {index < currentStep ? '✓' : index + 1}
          </div>
          <span className={cn(
            'text-sm',
            index <= currentStep ? 'text-neutral-900' : 'text-neutral-500'
          )}>
            {step}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const LoadingStates = {
  Spinner,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  LoadingState,
  PageLoading,
  Shimmer,
  ProgressiveLoading,
};

export default LoadingStates;