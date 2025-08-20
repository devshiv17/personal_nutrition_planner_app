import React from 'react';
import styled, { css } from 'styled-components';
import { BaseComponentProps } from '../../../types';

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  /* Size variants */
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
          font-size: 0.875rem;
          min-height: 2rem;
        `;
      case 'lg':
        return css`
          padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
          font-size: 1.125rem;
          min-height: 3rem;
        `;
      default:
        return css`
          padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
          font-size: 1rem;
          min-height: 2.5rem;
        `;
    }
  }}

  /* Color variants */
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: white;
          &:hover:not(:disabled) {
            background-color: #059669;
          }
          &:active:not(:disabled) {
            background-color: #047857;
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: white;
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.text.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.background};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.error};
          color: white;
          &:hover:not(:disabled) {
            background-color: #b91c1c;
          }
          &:active:not(:disabled) {
            background-color: #991b1b;
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background-color: #3730a3;
          }
          &:active:not(:disabled) {
            background-color: #312e81;
          }
        `;
    }
  }}

  /* Loading state */
  ${({ loading }) =>
    loading &&
    css`
      cursor: not-allowed;
      opacity: 0.8;
    `}
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <StyledButton
      {...props}
      disabled={disabled || loading}
      loading={loading}
    >
      {loading && <LoadingSpinner />}
      {!loading && leftIcon && leftIcon}
      {children}
      {!loading && rightIcon && rightIcon}
    </StyledButton>
  );
};

export default Button;