import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../../../types';

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      leftIcon,
      rightIcon,
      required = false,
      disabled = false,
      className = '',
      id,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    // Input base classes
    const inputBaseClasses = 'form-input';
    const inputErrorClasses = hasError ? 'form-input-error' : '';
    const inputWidthClasses = fullWidth ? 'w-full' : '';
    const inputIconClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

    // Container classes
    const containerClasses = [
      'flex flex-col space-y-1',
      fullWidth ? 'w-full' : '',
      disabled ? 'opacity-60 cursor-not-allowed' : '',
      className,
    ].filter(Boolean).join(' ');

    // Combine input classes
    const inputClasses = [
      inputBaseClasses,
      sizeClasses[size],
      inputErrorClasses,
      inputWidthClasses,
      inputIconClasses,
    ].filter(Boolean).join(' ');

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="w-5 h-5 text-gray-400">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            {...props}
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            className={inputClasses}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="w-5 h-5 text-gray-400">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {error && <div className="form-error">{error}</div>}
        {!error && helperText && <div className="form-help">{helperText}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;