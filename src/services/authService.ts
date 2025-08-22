import axios, { AxiosResponse } from 'axios';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  RefreshTokenResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePasswordData,
  UserSession,
  User,
  ApiResponse
} from '../types';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import { tokenManager } from '../utils/tokenManager';
import { lockoutManager } from '../utils/lockoutManager';

interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// Helper function to extract error message from axios error
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;
    return errorData?.message || errorData?.error || error.message;
  }
  return error instanceof Error ? error.message : 'An unknown error occurred';
};

// Create axios instance with default config
const authApi = axios.create({
  baseURL: `${API_BASE_URL}/v1/auth`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await authApi.post('/refresh', {
            refresh_token: refreshToken,
          });

          // Handle different response structures
          let tokenData;
          if (response.data.success !== undefined) {
            tokenData = response.data.data;
          } else {
            tokenData = response.data;
          }

          const token = tokenData.token;
          const newRefreshToken = tokenData.refreshToken || refreshToken;
          const expiresIn = tokenData.expiresIn || 3600;
          
          tokenManager.setTokens(token, newRefreshToken, expiresIn);
          
          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Check lockout status before attempting login
    const lockoutStatus = lockoutManager.checkLockoutStatus(credentials.email);
    
    if (lockoutStatus.isLocked) {
      throw new Error(lockoutStatus.message || 'Account temporarily locked');
    }

    // Apply progressive delay if needed
    if (lockoutStatus.nextAttemptDelay && lockoutStatus.nextAttemptDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, lockoutStatus.nextAttemptDelay));
    }

    try {
      const response: AxiosResponse<any> = await authApi.post(
        '/login', 
        {
          email: credentials.email,
          password: credentials.password,
          remember_me: credentials.rememberMe || false
        }
      );
      
      // Handle different response structures
      let authData: AuthResponse;
      
      if (response.data.success !== undefined) {
        // New API structure with success field
        if (!response.data.success) {
          // Record failed attempt
          const status = lockoutManager.recordLoginAttempt(credentials.email, false);
          const errorMsg = response.data.error || 'Login failed';
          const finalMsg = status.message ? `${errorMsg}. ${status.message}` : errorMsg;
          throw new Error(finalMsg);
        }
        authData = response.data.data;
      } else {
        // Direct response structure
        authData = response.data;
      }

      // Ensure we have all required fields
      if (!authData.user || !authData.token) {
        // Record failed attempt
        lockoutManager.recordLoginAttempt(credentials.email, false);
        throw new Error('Invalid response from server');
      }

      // Add default values if missing
      const processedAuthData: AuthResponse = {
        user: {
          ...authData.user,
          name: authData.user.name || `${authData.user.firstName || ''} ${authData.user.lastName || ''}`.trim(),
        },
        token: authData.token,
        refreshToken: authData.refreshToken || '',
        expiresIn: authData.expiresIn || 3600, // Default to 1 hour
        sessionId: authData.sessionId || Math.random().toString(36),
      };

      // Record successful attempt (clears lockout)
      lockoutManager.recordLoginAttempt(credentials.email, true);
      
      // Store tokens and user data
      tokenManager.setTokens(
        processedAuthData.token, 
        processedAuthData.refreshToken, 
        processedAuthData.expiresIn
      );
      
      tokenManager.setUserData(processedAuthData.user);
      tokenManager.setSessionId(processedAuthData.sessionId);

      return processedAuthData;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      
      // If it's not already handled above, record failed attempt
      if (!errorMessage.includes('attempt')) {
        const status = lockoutManager.recordLoginAttempt(credentials.email, false);
        const finalMsg = status.message ? `${errorMessage}. ${status.message}` : errorMessage;
        throw new Error(finalMsg);
      }
      
      throw new Error(errorMessage);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Convert to form data since Laravel isn't parsing JSON properly
      const formData = new URLSearchParams();
      formData.append('first_name', data.firstName);
      formData.append('last_name', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('password_confirmation', data.confirmPassword);

      const response: AxiosResponse<any> = await authApi.post(
        '/register', 
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      
      // Handle different response structures - registration doesn't return auth tokens
      if (response.data.success !== undefined && !response.data.success) {
        throw new Error(response.data.error || 'Registration failed');
      }

      // Registration was successful - return a mock auth response since registration doesn't auto-login
      const processedAuthData: AuthResponse = {
        user: {
          ...response.data.user,
          name: response.data.user.name || `${response.data.user.first_name || ''} ${response.data.user.last_name || ''}`.trim(),
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
        },
        token: '', // No token for registration
        refreshToken: '',
        expiresIn: 0,
        sessionId: '',
      };

      // Don't store tokens for registration - user needs to login separately
      return processedAuthData;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        // Handle validation errors from Laravel
        const errorData = error.response.data as ApiErrorResponse;
        if (errorData.errors) {
          // Convert Laravel validation errors to a readable format
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          throw new Error(validationErrors);
        }
        throw new Error(errorData.message || 'Validation failed');
      }
      throw new Error(getErrorMessage(error));
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await authApi.post('/logout');
    } catch (error) {
      // Even if server logout fails, we should clear local data
      console.warn('Server logout failed:', error);
    } finally {
      // Always clear local storage
      tokenManager.clearTokens();
    }
  }

  async logoutAll(): Promise<void> {
    try {
      await authApi.post('/logout-all');
    } catch (error) {
      console.warn('Server logout-all failed:', error);
    } finally {
      tokenManager.clearTokens();
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response: AxiosResponse<any> = await authApi.post(
        '/refresh',
        { refresh_token: refreshToken }
      );

      // Handle different response structures
      let tokenData: RefreshTokenResponse;
      
      if (response.data.success !== undefined) {
        if (!response.data.success) {
          throw new Error(response.data.error || 'Token refresh failed');
        }
        tokenData = response.data.data;
      } else {
        tokenData = response.data;
      }

      // Add default values if missing
      const processedTokenData: RefreshTokenResponse = {
        token: tokenData.token,
        refreshToken: tokenData.refreshToken || refreshToken, // Keep old refresh token if new one not provided
        expiresIn: tokenData.expiresIn || 3600,
      };

      tokenManager.setTokens(
        processedTokenData.token, 
        processedTokenData.refreshToken, 
        processedTokenData.expiresIn
      );

      return processedTokenData;
    } catch (error) {
      tokenManager.clearTokens();
      throw new Error(getErrorMessage(error));
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await authApi.post(
        '/password/request-reset',
        data
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Password reset request failed');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async resetPassword(data: PasswordResetConfirm): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await authApi.post(
        '/password/reset',
        {
          token: data.token,
          password: data.password,
          password_confirmation: data.confirmPassword,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Password reset failed');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await authApi.post(
        '/password/change',
        {
          current_password: data.currentPassword,
          password: data.newPassword,
          password_confirmation: data.confirmNewPassword,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Password change failed');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await authApi.get('/user');
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get user data');
      }

      const userData = response.data.data;
      tokenManager.setUserData(userData);
      
      return userData;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async getActiveSessions(): Promise<UserSession[]> {
    try {
      const response: AxiosResponse<any> = await authApi.get('/active-sessions');
      
      // Handle Laravel response structure
      let sessionsData;
      if (response.data.sessions) {
        sessionsData = response.data.sessions;
      } else if (response.data.success !== undefined && response.data.data) {
        sessionsData = response.data.data;
      } else {
        sessionsData = response.data;
      }

      // Transform backend session data to frontend format
      const sessions = Array.isArray(sessionsData) ? sessionsData : [];
      return sessions.map((session: any) => ({
        id: session.id?.toString(),
        deviceInfo: session.name || 'Unknown Device',
        ipAddress: session.ip_address || 'Unknown',
        location: session.location,
        lastActivity: session.last_used_at || session.created_at,
        isCurrentSession: session.is_current || false,
        isMobile: session.name?.includes('mobile') || false
      }));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await authApi.post(
        '/sessions/revoke',
        { token_id: sessionId }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to revoke session');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async verifyEmail(userId: string, hash: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await authApi.get(
        `/email/verify/${userId}/${hash}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Email verification failed');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async resendVerificationEmail(): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await authApi.post(
        '/email/verification-notification'
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  isAuthenticated(): boolean {
    return tokenManager.isValid();
  }

  getToken(): string | null {
    return tokenManager.getToken();
  }

  getUserData(): User | null {
    return tokenManager.getUserData();
  }

  // Lockout management methods
  checkLockoutStatus(email: string) {
    return lockoutManager.checkLockoutStatus(email);
  }

  clearLockout(email: string): void {
    lockoutManager.clearLockout(email);
  }

  getLockoutAnalytics() {
    return lockoutManager.getAnalytics();
  }

  checkSuspiciousActivity(email: string) {
    return lockoutManager.checkSuspiciousActivity(email);
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;