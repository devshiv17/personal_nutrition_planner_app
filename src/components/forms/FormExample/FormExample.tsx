import React from 'react';
import styled from 'styled-components';
import { useFormValidation, validationRules } from '../../../hooks/useFormValidation';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface ExampleFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  phone?: string;
  acceptTerms: boolean;
  root?: string;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  input[type="checkbox"] {
    width: auto;
  }
  
  label {
    font-size: 0.875rem;
    cursor: pointer;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.success}10;
  border-radius: 0.25rem;
`;

const FormExample: React.FC = () => {
  const form = useFormValidation<ExampleFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: 0,
      phone: '',
      acceptTerms: false
    }
  });

  const { register, onSubmit, getFieldError, hasFieldError, isSubmitting, reset } = form;
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const handleFormSubmit = async (data: ExampleFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', data);
    setSubmitSuccess(true);
    
    // Reset form after successful submission
    setTimeout(() => {
      reset();
      setSubmitSuccess(false);
    }, 2000);
  };

  return (
    <FormContainer onSubmit={onSubmit(handleFormSubmit)}>
      <h2>User Registration Form</h2>
      
      <FormRow>
        <FormGroup>
          <Input
            label="First Name"
            placeholder="Enter first name"
            {...register('firstName', validationRules.firstName)}
            error={getFieldError('firstName')}
          />
        </FormGroup>
        
        <FormGroup>
          <Input
            label="Last Name"
            placeholder="Enter last name"
            {...register('lastName', validationRules.lastName)}
            error={getFieldError('lastName')}
          />
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Input
          type="email"
          label="Email Address"
          placeholder="Enter email address"
          {...register('email', validationRules.email)}
          error={getFieldError('email')}
        />
      </FormGroup>

      <FormGroup>
        <Input
          type="password"
          label="Password"
          placeholder="Enter password"
          {...register('password', validationRules.password)}
          error={getFieldError('password')}
        />
      </FormGroup>

      <FormGroup>
        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm password"
          {...register('confirmPassword', validationRules.confirmPassword('password'))}
          error={getFieldError('confirmPassword')}
        />
      </FormGroup>

      <FormRow>
        <FormGroup>
          <Input
            type="number"
            label="Age"
            placeholder="Enter age"
            {...register('age', {
              required: 'Age is required',
              ...validationRules.age
            })}
            error={getFieldError('age')}
          />
        </FormGroup>
        
        <FormGroup>
          <Input
            type="tel"
            label="Phone (Optional)"
            placeholder="Enter phone number"
            {...register('phone', validationRules.phone)}
            error={getFieldError('phone')}
          />
        </FormGroup>
      </FormRow>

      <CheckboxGroup>
        <input
          type="checkbox"
          id="acceptTerms"
          {...register('acceptTerms', {
            required: 'You must accept the terms and conditions'
          })}
        />
        <label htmlFor="acceptTerms">
          I accept the terms and conditions
        </label>
        {hasFieldError('acceptTerms') && (
          <ErrorMessage>{getFieldError('acceptTerms')}</ErrorMessage>
        )}
      </CheckboxGroup>

      {getFieldError('root') && (
        <ErrorMessage>{getFieldError('root')}</ErrorMessage>
      )}

      {submitSuccess && (
        <SuccessMessage>
          Registration successful! Form will reset shortly.
        </SuccessMessage>
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting}
        style={{ marginTop: '1rem' }}
      >
        {isSubmitting ? 'Submitting...' : 'Register'}
      </Button>

      <Button 
        type="button" 
        variant="outline"
        onClick={() => reset()}
        disabled={isSubmitting}
      >
        Reset Form
      </Button>
    </FormContainer>
  );
};

export default FormExample;