import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
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

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &[data-required="true"]::after {
    content: ' *';
    color: ${({ theme }) => theme.colors.error};
  }
`;

const InputWrapper = styled.div<{ hasError?: boolean; disabled?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  ${({ hasError, theme }) =>
    hasError &&
    css`
      .input-field {
        border-color: ${theme.colors.error};
        
        &:focus {
          border-color: ${theme.colors.error};
          box-shadow: 0 0 0 3px ${theme.colors.error}20;
        }
      }
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
`;

const StyledInput = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.2s ease-in-out;
  font-family: inherit;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }

  &:read-only {
    background-color: ${({ theme }) => theme.colors.background};
  }`;

const IconContainer = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
  
  ${({ position }) =>
    position === 'left'
      ? css`
          left: 0.75rem;
        `
      : css`
          right: 0.75rem;
        `}
`;

const HelperText = styled.span<{ isError?: boolean }>`
  font-size: 0.75rem;
  color: ${({ isError, theme }) =>
    isError ? theme.colors.error : theme.colors.text.secondary};
  min-height: 1rem;
`;

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
      className,
      id,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <InputContainer fullWidth={fullWidth} className={className}>
        {label && (
          <Label htmlFor={inputId} data-required={required}>
            {label}
          </Label>
        )}
        
        <InputWrapper hasError={hasError} disabled={disabled}>
          {leftIcon && (
            <IconContainer position="left">{leftIcon}</IconContainer>
          )}
          
          <StyledInput
            {...props}
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            className={`input-field size-${size} ${leftIcon ? 'has-left-icon' : ''} ${rightIcon ? 'has-right-icon' : ''}`}
            style={{
              padding: size === 'sm' ? '0.25rem 0.5rem' : size === 'lg' ? '1rem 1.5rem' : '0.5rem 1rem',
              fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
              minHeight: size === 'sm' ? '2rem' : size === 'lg' ? '3rem' : '2.5rem',
              paddingLeft: leftIcon ? '2.5rem' : undefined,
              paddingRight: rightIcon ? '2.5rem' : undefined
            }}
          />
          
          {rightIcon && (
            <IconContainer position="right">{rightIcon}</IconContainer>
          )}
        </InputWrapper>
        
        {(error || helperText) && (
          <HelperText isError={hasError}>
            {error || helperText}
          </HelperText>
        )}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';

export default Input;