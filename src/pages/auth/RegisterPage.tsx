import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import ValidatedInput from '../../components/ui/ValidatedInput';
import PasswordStrengthIndicator from '../../components/ui/PasswordStrengthIndicator';
import { Card } from '../../components/ui/Card';
import NutritionBackgroundElements from '../../components/auth/NutritionBackgroundElements';
import { ROUTES } from '../../constants';
import { validationRules } from '../../hooks/useFormValidation';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 25%, #4facfe 50%, #00f2fe 75%, #667eea 100%);
  background-size: 300% 300%;
  animation: gradientFlow 20s ease infinite;
  padding: ${({ theme }) => theme.spacing.md};
  position: relative;
  overflow: hidden;
  
  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    25% { background-position: 100% 50%; }
    50% { background-position: 100% 100%; }
    75% { background-position: 0% 100%; }
    100% { background-position: 0% 50%; }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  backdrop-filter: blur(25px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 15px 35px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border-radius: 28px;
  animation: ${fadeIn} 1s ease-out;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #f093fb, #f5576c, #4facfe, #00f2fe, #667eea);
    background-size: 300% 300%;
    border-radius: 31px;
    z-index: -1;
    opacity: 0;
    animation: gradientFlow 8s ease infinite;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.1;
  }
`;

const WelcomeIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  animation: ${pulse} 4s ease-in-out infinite;
`;

const IconSvg = styled.svg`
  width: 72px;
  height: 72px;
  filter: drop-shadow(0 6px 12px rgba(240, 147, 251, 0.4));
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 25%, #4facfe 75%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.03em;
  animation: ${slideInLeft} 0.8s ease-out 0.2s both;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.1rem;
  margin-bottom: 2rem;
  font-weight: 400;
  animation: ${slideInLeft} 0.8s ease-out 0.4s both;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: ${fadeIn} 0.8s ease-out 0.6s both;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  text-align: center;
  font-size: 0.875rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(229, 62, 62, 0.15) 0%, rgba(229, 62, 62, 0.05) 100%);
  border-radius: 16px;
  border: 1px solid rgba(229, 62, 62, 0.25);
  backdrop-filter: blur(10px);
  white-space: pre-line;
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;
  
  &::before {
    content: '⚠️';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
`;

const SuccessMessage = styled.div`
  color: #38a169;
  text-align: center;
  font-size: 0.875rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(56, 161, 105, 0.15) 0%, rgba(56, 161, 105, 0.05) 100%);
  border-radius: 16px;
  border: 1px solid rgba(56, 161, 105, 0.25);
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;
  
  &::before {
    content: '✅';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
`;

const FooterText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2rem;
  font-size: 0.95rem;
  animation: ${fadeIn} 0.8s ease-out 0.8s both;

  a {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 25%, #4facfe 75%, #667eea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      transform: translateY(-2px);
      filter: brightness(1.2);
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 25%, #4facfe 75%, #667eea 100%);
      transition: width 0.4s ease;
    }
    
    &:hover::after {
      width: 100%;
    }
  }
`;

const TermsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.08);
    border-color: rgba(102, 126, 234, 0.2);
  }
`;

const TermsCheckbox = styled.input`
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.125rem;
  accent-color: #667eea;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const TermsLabel = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  user-select: none;
  line-height: 1.5;
  font-weight: 500;
`;

const TermsLink = styled(Link)`
  background: linear-gradient(135deg, #f093fb 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    filter: brightness(1.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(135deg, #f093fb 0%, #667eea 100%);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldValidation, setFieldValidation] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setValidationErrors([]);
    setSuccessMessage('');
  };

  const handleFieldValidation = (fieldName: string, isValid: boolean) => {
    setFieldValidation(prev => ({ ...prev, [fieldName]: isValid }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive client-side validation
    const errors: string[] = [];

    // Check required fields
    if (!formData.firstName.trim()) {
      errors.push('First name is required');
    } else if (!fieldValidation.firstName) {
      errors.push('Please enter a valid first name');
    }

    if (!formData.lastName.trim()) {
      errors.push('Last name is required');
    } else if (!fieldValidation.lastName) {
      errors.push('Please enter a valid last name');
    }

    if (!formData.email.trim()) {
      errors.push('Email address is required');
    } else if (!fieldValidation.email) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.password) {
      errors.push('Password is required');
    } else if (!fieldValidation.password) {
      errors.push('Password does not meet security requirements');
    }

    if (!formData.confirmPassword) {
      errors.push('Password confirmation is required');
    } else if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (!formData.acceptTerms) {
      errors.push('You must accept the terms and conditions to continue');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear validation errors on successful validation
    setValidationErrors([]);

    try {
      await register(formData);
      setSuccessMessage('Registration successful! Please check your email to verify your account before logging in.');
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    } catch (err) {
      // Display validation errors without clearing the form
      if (err instanceof Error) {
        setValidationErrors([err.message]);
      }
      setSuccessMessage('');
    }
  };

  // Validation rules for each field
  const firstNameValidationRules = [
    {
      test: (value: string) => !!value.trim(),
      message: 'First name is required',
      type: 'error' as const
    },
    {
      test: (value: string) => value.trim().length >= 2,
      message: 'First name must be at least 2 characters long',
      type: 'error' as const
    },
    {
      test: (value: string) => /^[a-zA-Z\s\-'\.]+$/.test(value.trim()),
      message: 'First name can only contain letters, spaces, hyphens, apostrophes, and dots',
      type: 'error' as const
    },
    {
      test: (value: string) => !/\d/.test(value),
      message: 'First name cannot contain numbers',
      type: 'error' as const
    }
  ];

  const lastNameValidationRules = [
    {
      test: (value: string) => !!value.trim(),
      message: 'Last name is required',
      type: 'error' as const
    },
    {
      test: (value: string) => value.trim().length >= 2,
      message: 'Last name must be at least 2 characters long',
      type: 'error' as const
    },
    {
      test: (value: string) => /^[a-zA-Z\s\-'\.]+$/.test(value.trim()),
      message: 'Last name can only contain letters, spaces, hyphens, apostrophes, and dots',
      type: 'error' as const
    },
    {
      test: (value: string) => !/\d/.test(value),
      message: 'Last name cannot contain numbers',
      type: 'error' as const
    }
  ];

  const emailValidationRules = [
    {
      test: (value: string) => !!value.trim(),
      message: 'Email address is required',
      type: 'error' as const
    },
    {
      test: (value: string) => validationRules.email.pattern.value.test(value),
      message: validationRules.email.pattern.message,
      type: 'error' as const
    },
    {
      test: (value: string) => !/\s/.test(value),
      message: 'Email cannot contain spaces',
      type: 'error' as const
    }
  ];

  const passwordValidationRules = [
    {
      test: (value: string) => !!value,
      message: 'Password is required',
      type: 'error' as const
    },
    {
      test: (value: string) => value.length >= 8,
      message: 'Password must be at least 8 characters long',
      type: 'error' as const
    },
    {
      test: (value: string) => /[a-z]/.test(value),
      message: 'Password must contain at least one lowercase letter',
      type: 'error' as const
    },
    {
      test: (value: string) => /[A-Z]/.test(value),
      message: 'Password must contain at least one uppercase letter',
      type: 'error' as const
    },
    {
      test: (value: string) => /\d/.test(value),
      message: 'Password must contain at least one number',
      type: 'error' as const
    },
    {
      test: (value: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
      message: 'Password must contain at least one special character',
      type: 'error' as const
    }
  ];

  const confirmPasswordValidationRules = [
    {
      test: (value: string) => !!value,
      message: 'Please confirm your password',
      type: 'error' as const
    },
    {
      test: (value: string) => value === formData.password,
      message: 'Passwords do not match',
      type: 'error' as const
    }
  ];

  return (
    <Container>
      <NutritionBackgroundElements />
      <RegisterCard>
        <WelcomeIcon>
          <IconSvg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36" cy="36" r="34" fill="url(#registerGrad1)" stroke="url(#registerGrad2)" strokeWidth="2"/>
            <path d="M24 32c0-6.627 5.373-12 12-12s12 5.373 12 12v12c0 6.627-5.373 12-12 12s-12-5.373-12-12V32z" fill="#fff" fillOpacity="0.95"/>
            <circle cx="30" cy="34" r="2.5" fill="url(#registerGrad1)"/>
            <circle cx="42" cy="34" r="2.5" fill="url(#registerGrad1)"/>
            <path d="M30 44c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="url(#registerGrad1)" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M18 18l6 6m30-6l-6 6M18 54l6-6m30 6l-6-6" stroke="url(#registerGrad1)" strokeWidth="2" strokeLinecap="round"/>
            <defs>
              <linearGradient id="registerGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f093fb"/>
                <stop offset="25%" stopColor="#f5576c"/>
                <stop offset="75%" stopColor="#4facfe"/>
                <stop offset="100%" stopColor="#667eea"/>
              </linearGradient>
              <linearGradient id="registerGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f093fb" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#667eea" stopOpacity="0.6"/>
              </linearGradient>
            </defs>
          </IconSvg>
        </WelcomeIcon>
        
        <Title>Join NutriTrack</Title>
        <Subtitle>Start your personalized nutrition journey today</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <ValidatedInput
            type="text"
            name="firstName"
            label="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            validationRules={firstNameValidationRules}
            onValidationChange={(isValid) => handleFieldValidation('firstName', isValid)}
            fullWidth
          />
          
          <ValidatedInput
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            validationRules={lastNameValidationRules}
            onValidationChange={(isValid) => handleFieldValidation('lastName', isValid)}
            fullWidth
          />
          
          <ValidatedInput
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            validationRules={emailValidationRules}
            onValidationChange={(isValid) => handleFieldValidation('email', isValid)}
            fullWidth
          />
          
          <div>
            <ValidatedInput
              type="password"
              name="password"
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              validationRules={passwordValidationRules}
              onValidationChange={(isValid) => handleFieldValidation('password', isValid)}
              showValidationOnChange={true}
              fullWidth
            />
            <PasswordStrengthIndicator password={formData.password} />
          </div>
          
          <ValidatedInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            validationRules={confirmPasswordValidationRules}
            onValidationChange={(isValid) => handleFieldValidation('confirmPassword', isValid)}
            fullWidth
          />
          
          <TermsContainer>
            <TermsCheckbox
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            <TermsLabel htmlFor="acceptTerms">
              I agree to the{' '}
              <TermsLink to={ROUTES.TERMS}>
                Terms of Service
              </TermsLink>{' '}
              and{' '}
              <TermsLink to={ROUTES.PRIVACY}>
                Privacy Policy
              </TermsLink>
            </TermsLabel>
          </TermsContainer>
          
          {successMessage && (
            <SuccessMessage>{successMessage}</SuccessMessage>
          )}
          
          {(error || validationErrors.length > 0) && !successMessage && (
            <ErrorMessage>
              {error || validationErrors.join('\n')}
            </ErrorMessage>
          )}
          
          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
          >
            Create Account
          </Button>
        </Form>
        
        <FooterText>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN}>Sign in here</Link>
        </FooterText>
      </RegisterCard>
    </Container>
  );
};

export default RegisterPage;