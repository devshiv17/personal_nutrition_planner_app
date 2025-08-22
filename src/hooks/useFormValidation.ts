import { useForm, UseFormProps, FieldValues, FieldPath } from 'react-hook-form';
import { useCallback } from 'react';

// Enhanced validation rules with detailed feedback
export const validationRules = {
  required: (fieldName: string) => ({ required: `${fieldName} is required` }),
  
  email: {
    required: 'Email address is required',
    pattern: {
      value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      message: 'Please enter a valid email address (e.g., user@example.com)'
    },
    validate: {
      noSpaces: (value: string) => !/\s/.test(value) || 'Email cannot contain spaces',
      noConsecutiveDots: (value: string) => !/\.{2,}/.test(value) || 'Email cannot contain consecutive dots',
      validDomain: (value: string) => {
        const parts = value.split('@');
        if (parts.length === 2) {
          const domain = parts[1];
          return (domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.')) || 'Invalid domain format';
        }
        return true;
      }
    }
  },

  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters long'
    },
    maxLength: {
      value: 128,
      message: 'Password cannot exceed 128 characters'
    },
    validate: {
      hasLowercase: (value: string) => /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
      hasUppercase: (value: string) => /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
      hasNumber: (value: string) => /\d/.test(value) || 'Password must contain at least one number',
      hasSpecialChar: (value: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) || 'Password must contain at least one special character',
      noCommonPatterns: (value: string) => {
        const common = ['password', '12345678', 'qwerty', 'abc123'];
        const lower = value.toLowerCase();
        return !common.some(pattern => lower.includes(pattern)) || 'Password contains common patterns that are easily guessed';
      },
      noRepeatingChars: (value: string) => !/(.)\1{3,}/.test(value) || 'Password cannot contain 4 or more repeating characters',
      noSequentialChars: (value: string) => {
        const sequences = ['abcd', 'bcde', 'cdef', 'defg', 'efgh', 'fghi', 'ghij', 'hijk', 'ijkl', 'jklm', 'klmn', 'lmno', 'mnop', 'nopq', 'opqr', 'pqrs', 'qrst', 'rstu', 'stuv', 'tuvw', 'uvwx', 'vwxy', 'wxyz', '1234', '2345', '3456', '4567', '5678', '6789'];
        const lower = value.toLowerCase();
        return !sequences.some(seq => lower.includes(seq)) || 'Password cannot contain sequential characters';
      }
    }
  },

  confirmPassword: (passwordField: string) => ({
    required: 'Please confirm your password',
    validate: (value: string, formValues: any) => {
      if (!value) return 'Password confirmation is required';
      return value === formValues[passwordField] || 'Passwords do not match';
    }
  }),

  firstName: {
    required: 'First name is required',
    minLength: {
      value: 2,
      message: 'First name must be at least 2 characters long'
    },
    maxLength: {
      value: 50,
      message: 'First name cannot exceed 50 characters'
    },
    pattern: {
      value: /^[a-zA-Z\s\-'\.]+$/,
      message: 'First name can only contain letters, spaces, hyphens, apostrophes, and dots'
    },
    validate: {
      noNumbers: (value: string) => !/\d/.test(value) || 'First name cannot contain numbers',
      noSpecialChars: (value: string) => /^[a-zA-Z\s\-'\.]+$/.test(value) || 'First name contains invalid characters',
      notOnlySpaces: (value: string) => value.trim().length > 0 || 'First name cannot be only spaces'
    }
  },

  lastName: {
    required: 'Last name is required',
    minLength: {
      value: 2,
      message: 'Last name must be at least 2 characters long'
    },
    maxLength: {
      value: 50,
      message: 'Last name cannot exceed 50 characters'
    },
    pattern: {
      value: /^[a-zA-Z\s\-'\.]+$/,
      message: 'Last name can only contain letters, spaces, hyphens, apostrophes, and dots'
    },
    validate: {
      noNumbers: (value: string) => !/\d/.test(value) || 'Last name cannot contain numbers',
      noSpecialChars: (value: string) => /^[a-zA-Z\s\-'\.]+$/.test(value) || 'Last name contains invalid characters',
      notOnlySpaces: (value: string) => value.trim().length > 0 || 'Last name cannot be only spaces'
    }
  },

  phone: {
    pattern: {
      value: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number'
    },
    validate: {
      validFormat: (value?: string) => {
        if (!value) return true; // Allow empty if not required
        return /^[\+]?[1-9][\d]{7,15}$/.test(value) || 'Phone number must be 8-16 digits and can start with +';
      }
    }
  },

  age: {
    min: {
      value: 13,
      message: 'You must be at least 13 years old'
    },
    max: {
      value: 120,
      message: 'Age must be less than 120'
    },
    validate: {
      isInteger: (value: number) => Number.isInteger(value) || 'Age must be a whole number'
    }
  },

  terms: {
    required: 'You must accept the terms and conditions to continue'
  }
};

// Password strength calculator
export const calculatePasswordStrength = (password: string): {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
} => {
  if (!password) return { score: 0, level: 'weak', feedback: ['Password is required'] };

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score += 2;
  else feedback.push('Use at least 8 characters');

  if (password.length >= 12) score += 1;
  else if (password.length >= 8) feedback.push('Consider using 12+ characters for better security');

  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Add numbers');

  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 2;
  else feedback.push('Add special characters (!@#$%^&*)');

  // Bonus points for good practices
  if (password.length >= 16) score += 1;
  if (!/(.)\1{2,}/.test(password)) score += 1; // No repeating characters
  else feedback.push('Avoid repeating characters');

  // Common patterns penalty
  const common = ['password', '12345', 'qwerty', 'abc123'];
  if (common.some(pattern => password.toLowerCase().includes(pattern))) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common patterns');
  }

  // Determine level
  let level: 'weak' | 'fair' | 'good' | 'strong';
  if (score <= 3) level = 'weak';
  else if (score <= 5) level = 'fair';
  else if (score <= 7) level = 'good';
  else level = 'strong';

  return { score, level, feedback };
};

// Hook for enhanced form handling with React Hook Form
export function useFormValidation<T extends FieldValues = FieldValues>(
  options?: UseFormProps<T>
) {
  const form = useForm<T>({
    mode: 'onChange',
    ...options
  });

  const {
    formState: { errors, isSubmitting, isValid, isDirty },
    clearErrors,
    setError,
    reset,
    handleSubmit
  } = form;

  // Helper to clear specific field error
  const clearFieldError = useCallback((fieldName: FieldPath<T>) => {
    clearErrors(fieldName);
  }, [clearErrors]);

  // Helper to set field error
  const setFieldError = useCallback((fieldName: FieldPath<T>, message: string) => {
    setError(fieldName, { type: 'manual', message });
  }, [setError]);

  // Helper to get error message for a field
  const getFieldError = useCallback((fieldName: FieldPath<T>) => {
    const error = errors[fieldName];
    return error?.message || undefined;
  }, [errors]);

  // Helper to check if field has error
  const hasFieldError = useCallback((fieldName: FieldPath<T>) => {
    return !!errors[fieldName];
  }, [errors]);

  // Submit handler with error handling
  const onSubmit = useCallback((
    submitFn: (data: T) => Promise<void> | void,
    onError?: (error: Error) => void
  ) => {
    return handleSubmit(async (data) => {
      try {
        await submitFn(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        
        // Set general form error
        setError('root', { type: 'manual', message: errorMessage });
        
        // Call error handler if provided
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    });
  }, [handleSubmit, setError]);

  return {
    ...form,
    clearFieldError,
    setFieldError,
    getFieldError,
    hasFieldError,
    onSubmit,
    isSubmitting,
    isValid,
    isDirty,
    hasErrors: Object.keys(errors).length > 0
  };
}

// Utility for creating form field props
export function createFieldProps<T extends FieldValues>(
  form: ReturnType<typeof useFormValidation<T>>,
  fieldName: FieldPath<T>
) {
  return {
    ...form.register(fieldName),
    error: form.getFieldError(fieldName),
    hasError: form.hasFieldError(fieldName)
  };
}