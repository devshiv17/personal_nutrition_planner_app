import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import Button from '../../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 500px;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: left;
  max-width: 600px;
  
  summary {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  pre {
    background-color: ${({ theme }) => theme.colors.background};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: 0.5rem;
    overflow-x: auto;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>
            We're sorry, but something unexpected happened. Please try refreshing the page 
            or go back to the home page.
          </ErrorMessage>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <summary>Error Details (Development)</summary>
              <pre>{this.state.error.stack}</pre>
            </ErrorDetails>
          )}
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={this.handleReload}>
              Refresh Page
            </Button>
            <Button variant="outline" onClick={this.handleGoHome}>
              Go Home
            </Button>
          </div>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;