import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Input, InputProps } from './Input';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  type: 'error' | 'warning' | 'success';
}

interface ValidatedInputProps extends InputProps {
  validationRules?: ValidationRule[];
  showValidationOnChange?: boolean;
  debounceMs?: number;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ValidationContainer = styled.div`
  margin-top: 0.375rem;
`;

const ValidationMessage = styled.div<{ type: 'error' | 'warning' | 'success' }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  animation: ${fadeIn} 0.2s ease-out;
  padding: 0.25rem 0;
  
  color: ${({ type }) => {
    switch (type) {
      case 'error': return '#e53e3e';
      case 'warning': return '#ed8936';
      case 'success': return '#38a169';
      default: return '#718096';
    }
  }};

  &::before {
    content: ${({ type }) => {
      switch (type) {
        case 'error': return '"✕"';
        case 'warning': return '"⚠"';
        case 'success': return '"✓"';
        default: return '"ⓘ"';
      }
    }};
    font-size: 0.625rem;
    font-weight: bold;
  }
`;

const ValidationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const StyledInput = styled(Input)<{ validationState: 'error' | 'warning' | 'success' | 'default' }>`
  border-color: ${({ validationState }) => {
    switch (validationState) {
      case 'error': return '#e53e3e';
      case 'warning': return '#ed8936';
      case 'success': return '#38a169';
      default: return undefined;
    }
  }};

  &:focus {
    border-color: ${({ validationState }) => {
      switch (validationState) {
        case 'error': return '#e53e3e';
        case 'warning': return '#ed8936';
        case 'success': return '#38a169';
        default: return '#667eea';
      }
    }};
    
    box-shadow: 0 0 0 3px ${({ validationState }) => {
      switch (validationState) {
        case 'error': return 'rgba(229, 62, 62, 0.1)';
        case 'warning': return 'rgba(237, 137, 54, 0.1)';
        case 'success': return 'rgba(56, 161, 105, 0.1)';
        default: return 'rgba(102, 126, 234, 0.1)';
      }
    }};
  }
`;

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  validationRules = [],
  showValidationOnChange = true,
  debounceMs = 300,
  onValidationChange,
  value,
  onChange,
  ...inputProps
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [validationMessages, setValidationMessages] = useState<Array<{ message: string; type: 'error' | 'warning' | 'success' }>>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout>();

  const validateValue = (inputValue: string) => {
    if (!showValidationOnChange && !isValidated) return;

    const messages: Array<{ message: string; type: 'error' | 'warning' | 'success' }> = [];
    let hasErrors = false;

    validationRules.forEach(rule => {
      if (!rule.test(inputValue)) {
        messages.push({ message: rule.message, type: rule.type });
        if (rule.type === 'error') hasErrors = true;
      }
    });

    setValidationMessages(messages);
    onValidationChange?.(
      !hasErrors,
      messages.filter(m => m.type === 'error').map(m => m.message)
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Call parent onChange
    onChange?.(e);

    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new debounce timer for validation
    const timer = setTimeout(() => {
      validateValue(newValue);
    }, debounceMs);

    setDebounceTimer(timer);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsValidated(true);
    validateValue(e.target.value);
    inputProps.onBlur?.(e);
  };

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Determine validation state
  const getValidationState = (): 'error' | 'warning' | 'success' | 'default' => {
    if (validationMessages.length === 0) {
      // Show success state if value exists and validation rules exist
      if (localValue && validationRules.length > 0 && isValidated) {
        return 'success';
      }
      return 'default';
    }

    const hasErrors = validationMessages.some(m => m.type === 'error');
    const hasWarnings = validationMessages.some(m => m.type === 'warning');

    if (hasErrors) return 'error';
    if (hasWarnings) return 'warning';
    return 'success';
  };

  return (
    <div>
      <StyledInput
        {...inputProps}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        validationState={getValidationState()}
      />
      
      {validationMessages.length > 0 && (
        <ValidationContainer>
          <ValidationList>
            {validationMessages.map((message, index) => (
              <ValidationMessage key={index} type={message.type}>
                {message.message}
              </ValidationMessage>
            ))}
          </ValidationList>
        </ValidationContainer>
      )}
    </div>
  );
};

export default ValidatedInput;