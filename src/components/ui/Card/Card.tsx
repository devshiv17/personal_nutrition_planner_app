import React from 'react';
import styled, { css } from 'styled-components';
import { BaseComponentProps } from '../../../types';

export interface CardProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const StyledCard = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 0.75rem;
  transition: all 0.2s ease-in-out;
  
  /* Padding variants */
  ${({ padding = 'md' }) => {
    switch (padding) {
      case 'none':
        return css`
          padding: 0;
        `;
      case 'sm':
        return css`
          padding: ${({ theme }) => theme.spacing.sm};
        `;
      case 'lg':
        return css`
          padding: ${({ theme }) => theme.spacing.lg};
        `;
      default:
        return css`
          padding: ${({ theme }) => theme.spacing.md};
        `;
    }
  }}

  /* Shadow variants */
  ${({ shadow = 'sm' }) => {
    switch (shadow) {
      case 'none':
        return css`
          box-shadow: none;
        `;
      case 'md':
        return css`
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                      0 2px 4px -1px rgba(0, 0, 0, 0.06);
        `;
      case 'lg':
        return css`
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                      0 4px 6px -2px rgba(0, 0, 0, 0.05);
        `;
      default:
        return css`
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
                      0 1px 2px 0 rgba(0, 0, 0, 0.06);
        `;
    }
  }}

  /* Border */
  ${({ border = false, theme }) =>
    border &&
    css`
      border: 1px solid ${theme.colors.border};
    `}

  /* Hoverable effect */
  ${({ hoverable = false }) =>
    hoverable &&
    css`
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
                    0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
    `}

  /* Clickable cursor */
  ${({ clickable = false, onClick }) =>
    (clickable || onClick) &&
    css`
      cursor: pointer;
      
      &:hover {
        box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.12),
                    0 4px 8px -2px rgba(0, 0, 0, 0.08);
      }
      
      &:active {
        transform: translateY(1px);
      }
    `}
`;

const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  ...props
}) => {
  return (
    <StyledCard
      {...props}
      className={className}
      onClick={onClick}
      clickable={Boolean(onClick)}
    >
      {children}
    </StyledCard>
  );
};

export default Card;