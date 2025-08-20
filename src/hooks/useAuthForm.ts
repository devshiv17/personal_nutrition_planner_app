import { useState, useCallback, useEffect } from 'react';
import { LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm } from '../types';
import { useAuth } from './useAuth';
import { authService } from '../services/authService';

interface ValidationErrors {
  [key: string]: string;
}

interface UseAuthFormReturn<T> {
  data: T;
  errors: ValidationErrors;
  isLoading: boolean;
  updateField: (field: keyof T, value: any) => void;
  setData: (data: T) => void;
  setErrors: (errors: ValidationErrors) => void;
  clearErrors: () => void;
  clearError: (field: string) => void;
  validate: () => boolean;
  reset: () => void;
}

// Login form hook
export const useLoginForm = (initialData?: Partial<LoginCredentials>) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutWarning, setLockoutWarning] = useState<string>('');

  const defaultData: LoginCredentials = {
    email: '',
    password: '',
    rememberMe: false,
    ...initialData,
  };

  const [data, setData] = useState<LoginCredentials>(defaultData);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Check lockout status when email changes
  useEffect(() => {
    if (data.email) {
      const lockoutStatus = authService.checkLockoutStatus(data.email);
      if (lockoutStatus.isLocked) {
        setLockoutWarning(lockoutStatus.message || 'Account temporarily locked');
      } else if (lockoutStatus.message) {
        setLockoutWarning(lockoutStatus.message);
      } else {
        setLockoutWarning('');
      }
    } else {
      setLockoutWarning('');
    }
  }, [data.email]);

  const validateLogin = useCallback((loginData: LoginCredentials): ValidationErrors => {
    const validationErrors: ValidationErrors = {};

    // Email validation
    if (!loginData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!loginData.password) {
      validationErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }

    return validationErrors;
  }, []);

  const updateField = useCallback((field: keyof LoginCredentials, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const validationErrors = validateLogin(data);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [data, validateLogin]);

  const submitLogin = useCallback(async () => {
    // Check lockout status before validation
    const lockoutStatus = authService.checkLockoutStatus(data.email);
    if (lockoutStatus.isLocked) {
      setErrors({ submit: lockoutStatus.message || 'Account temporarily locked' });
      return false;
    }

    if (!validate()) return false;

    setIsLoading(true);
    try {
      await login(data);
      setLockoutWarning(''); // Clear any warnings on successful login
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setErrors({ submit: errorMessage });
      
      // Update lockout warning after failed attempt
      const updatedStatus = authService.checkLockoutStatus(data.email);
      if (updatedStatus.message) {
        setLockoutWarning(updatedStatus.message);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [data, login, validate]);

  const reset = useCallback(() => {
    setData(defaultData);
    setErrors({});
    setLockoutWarning('');
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);
  const clearError = useCallback((field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  return {
    data,
    errors,
    isLoading,
    lockoutWarning,
    updateField,
    setData,
    setErrors,
    clearErrors,
    clearError,
    validate,
    reset,
    submit: submitLogin,
  };
};

// Registration form hook
export const useRegisterForm = (initialData?: Partial<RegisterData>) => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const defaultData: RegisterData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    ...initialData,
  };

  const [data, setData] = useState<RegisterData>(defaultData);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateRegister = useCallback((registerData: RegisterData): ValidationErrors => {
    const validationErrors: ValidationErrors = {};

    // First name validation
    if (!registerData.firstName.trim()) {
      validationErrors.firstName = 'First name is required';
    } else if (registerData.firstName.length < 2) {
      validationErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!registerData.lastName.trim()) {
      validationErrors.lastName = 'Last name is required';
    } else if (registerData.lastName.length < 2) {
      validationErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!registerData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!registerData.password) {
      validationErrors.password = 'Password is required';
    } else {
      if (registerData.password.length < 8) {
        validationErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerData.password)) {
        validationErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
    }

    // Confirm password validation
    if (!registerData.confirmPassword) {
      validationErrors.confirmPassword = 'Please confirm your password';
    } else if (registerData.password !== registerData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance validation
    if (!registerData.acceptTerms) {
      validationErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    return validationErrors;
  }, []);

  const updateField = useCallback((field: keyof RegisterData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const validationErrors = validateRegister(data);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [data, validateRegister]);

  const submitRegister = useCallback(async () => {
    if (!validate()) return false;

    setIsLoading(true);
    try {
      await register(data);
      return true;
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Registration failed' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [data, register, validate]);

  const reset = useCallback(() => {
    setData(defaultData);
    setErrors({});
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);
  const clearError = useCallback((field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  return {
    data,
    errors,
    isLoading,
    updateField,
    setData,
    setErrors,
    clearErrors,
    clearError,
    validate,
    reset,
    submit: submitRegister,
  };
};

// Password reset request form hook
export const usePasswordResetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const defaultData: PasswordResetRequest = { email: '' };
  const [data, setData] = useState<PasswordResetRequest>(defaultData);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validatePasswordReset = useCallback((resetData: PasswordResetRequest): ValidationErrors => {
    const validationErrors: ValidationErrors = {};

    if (!resetData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetData.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    return validationErrors;
  }, []);

  const updateField = useCallback((field: keyof PasswordResetRequest, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const validationErrors = validatePasswordReset(data);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [data, validatePasswordReset]);

  const submit = useCallback(async () => {
    if (!validate()) return false;

    setIsLoading(true);
    try {
      await authService.requestPasswordReset(data);
      setIsSuccess(true);
      return true;
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Request failed' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [data, validate]);

  const reset = useCallback(() => {
    setData(defaultData);
    setErrors({});
    setIsSuccess(false);
  }, []);

  return {
    data,
    errors,
    isLoading,
    isSuccess,
    updateField,
    validate,
    submit,
    reset,
  };
};