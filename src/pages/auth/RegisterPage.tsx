import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ROUTES } from '../../constants';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}10 0%, ${({ theme }) => theme.colors.secondary}10 100%);
  padding: ${({ theme }) => theme.spacing.md};
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.error}10;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.error}40;
`;

const FooterText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.md};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
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
  const [validationError, setValidationError] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    if (!formData.acceptTerms) {
      setValidationError('Please accept the terms and conditions');
      return;
    }

    try {
      await register(formData);
      navigate(ROUTES.ONBOARDING);
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <Container>
      <RegisterCard>
        <Title>Create Account</Title>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="firstName"
            label="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <Input
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
            <input
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="acceptTerms" style={{ fontSize: '0.875rem', color: '#666' }}>
              I accept the{' '}
              <Link to={ROUTES.TERMS} style={{ color: '#667eea', textDecoration: 'none' }}>
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to={ROUTES.PRIVACY} style={{ color: '#667eea', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
            </label>
          </div>
          
          {(error || validationError) && (
            <ErrorMessage>{error || validationError}</ErrorMessage>
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