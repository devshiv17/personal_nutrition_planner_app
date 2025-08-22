import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { useLockout } from '../../hooks/useLockout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import ValidatedInput from '../../components/ui/ValidatedInput';
import { Card } from '../../components/ui/Card';
import LockoutWarning from '../../components/auth/LockoutWarning';
import NutritionBackgroundElements from '../../components/auth/NutritionBackgroundElements';
import { ROUTES } from '../../constants';
import { validationRules } from '../../hooks/useFormValidation';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  padding: ${({ theme }) => theme.spacing.md};
  position: relative;
  overflow: hidden;
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
    border-radius: 26px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.1;
  }
`;

const NutritionIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const IconSvg = styled.svg`
  width: 64px;
  height: 64px;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1rem;
  margin-bottom: 2rem;
  font-weight: 400;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  text-align: center;
  font-size: 0.875rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, rgba(229, 62, 62, 0.1) 0%, rgba(229, 62, 62, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba(229, 62, 62, 0.2);
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.3s ease-out;
`;

const FooterText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2rem;
  font-size: 0.95rem;

  a {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      transform: translateY(-1px);
      filter: brightness(1.1);
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }
    
    &:hover::after {
      width: 100%;
    }
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 1.125rem;
  height: 1.125rem;
  accent-color: #667eea;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ForgotPasswordLink = styled(Link)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  font-size: 0.875rem;
  text-align: center;
  display: block;
  margin: 0.75rem 0;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 1px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { login, loading, error } = useAuth();
  const { lockoutStatus, isDelayed, checkStatus } = useLockout();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  // Check lockout status when email changes
  useEffect(() => {
    if (email && email.includes('@')) {
      checkStatus(email);
    }
  }, [email, checkStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if account is locked or delayed
    if (lockoutStatus?.isLocked || isDelayed) {
      return;
    }

    // Client-side validation before submission
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else if (!emailValid) {
      errors.push('Please enter a valid email address');
    }
    
    if (!password) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear validation errors on successful validation
    setValidationErrors([]);
    
    try {
      await login({ email, password, rememberMe });
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the auth context
      // Refresh lockout status after failed login
      if (email) {
        setTimeout(() => checkStatus(email), 500);
      }
    }
  };

  // Email validation rules for login
  const emailValidationRules = [
    {
      test: (value: string) => !!value,
      message: 'Email address is required',
      type: 'error' as const
    },
    {
      test: (value: string) => validationRules.email.pattern.value.test(value),
      message: validationRules.email.pattern.message,
      type: 'error' as const
    }
  ];

  // Password validation rules for login (basic)
  const passwordValidationRules = [
    {
      test: (value: string) => !!value,
      message: 'Password is required',
      type: 'error' as const
    },
    {
      test: (value: string) => value.length >= 8,
      message: 'Password must be at least 8 characters',
      type: 'error' as const
    }
  ];

  return (
    <Container>
      <NutritionBackgroundElements />
      <LoginCard>
        <NutritionIcon>
          <IconSvg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" fill="url(#grad1)" stroke="url(#grad2)" strokeWidth="2"/>
            <path d="M20 28c0-6.627 5.373-12 12-12s12 5.373 12 12v8c0 6.627-5.373 12-12 12s-12-5.373-12-12v-8z" fill="#fff" fillOpacity="0.9"/>
            <circle cx="26" cy="30" r="3" fill="url(#grad1)"/>
            <circle cx="38" cy="30" r="3" fill="url(#grad1)"/>
            <path d="M26 40c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round"/>
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea"/>
                <stop offset="100%" stopColor="#764ba2"/>
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#764ba2" stopOpacity="0.5"/>
              </linearGradient>
            </defs>
          </IconSvg>
        </NutritionIcon>
        
        <Title>Welcome Back</Title>
        <Subtitle>Your nutrition journey continues</Subtitle>
        
        {email && <LockoutWarning email={email} />}
        
        <Form onSubmit={handleSubmit}>
          <ValidatedInput
            type="email"
            label="Email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            validationRules={emailValidationRules}
            onValidationChange={(isValid) => setEmailValid(isValid)}
            showValidationOnChange={false}
            fullWidth
          />
          
          <ValidatedInput
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            validationRules={passwordValidationRules}
            onValidationChange={(isValid) => setPasswordValid(isValid)}
            showValidationOnChange={false}
            fullWidth
          />
          
          <CheckboxContainer>
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <CheckboxLabel htmlFor="rememberMe">
              Remember me for 30 days
            </CheckboxLabel>
          </CheckboxContainer>
          
          <ForgotPasswordLink to="/forgot-password">
            Forgot your password?
          </ForgotPasswordLink>
          
          {(error || validationErrors.length > 0) && (
            <ErrorMessage>
              {error || validationErrors.join(', ')}
            </ErrorMessage>
          )}
          
          <Button
            type="submit"
            loading={loading}
            disabled={loading || lockoutStatus?.isLocked || isDelayed}
            fullWidth
            size="lg"
          >
            {lockoutStatus?.isLocked ? 'Account Locked' : 
             isDelayed ? 'Please Wait...' : 
             'Sign In'}
          </Button>
        </Form>
        
        <FooterText>
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER}>Sign up here</Link>
        </FooterText>
      </LoginCard>
    </Container>
  );
};

export default LoginPage;