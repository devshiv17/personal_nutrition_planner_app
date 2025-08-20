// Validation utility to check auth implementation
import { tokenManager } from './tokenManager';
import { sessionManager } from './sessionManager';
import { authService } from '../services/authService';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateAuthImplementation(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Check if tokenManager is properly initialized
    const debugInfo = tokenManager.getDebugInfo();
    if (typeof debugInfo !== 'object') {
      errors.push('TokenManager debug info is not properly initialized');
    }

    // Check if sessionManager can be initialized
    if (typeof window !== 'undefined') {
      try {
        sessionManager.initialize();
        sessionManager.destroy();
      } catch (error) {
        warnings.push(`SessionManager initialization warning: ${error}`);
      }
    }

    // Check if authService methods exist
    const requiredMethods = ['login', 'register', 'logout', 'refreshToken'];
    for (const method of requiredMethods) {
      if (typeof (authService as any)[method] !== 'function') {
        errors.push(`AuthService missing method: ${method}`);
      }
    }

    // Check localStorage/sessionStorage availability
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
      } catch (error) {
        warnings.push('localStorage is not available');
      }

      try {
        sessionStorage.setItem('test', 'test');
        sessionStorage.removeItem('test');
      } catch (error) {
        warnings.push('sessionStorage is not available');
      }
    }

  } catch (error) {
    errors.push(`Validation failed with error: ${error}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Run validation and log results (for development)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const result = validateAuthImplementation();
  
  if (!result.isValid) {
    console.error('❌ Auth Implementation Validation Failed:');
    result.errors.forEach(error => console.error(`  - ${error}`));
  } else {
    console.log('✅ Auth Implementation Validation Passed');
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️ Auth Implementation Warnings:');
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
}