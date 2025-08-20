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
        credentials
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
      // If it's not already handled above, record failed attempt
      if (!error.message.includes('attempt')) {
        const status = lockoutManager.recordLoginAttempt(credentials.email, false);
        const originalMsg = getErrorMessage(error);
        const finalMsg = status.message ? `${originalMsg}. ${status.message}` : originalMsg;
        throw new Error(finalMsg);
      }
      
      throw new Error(getErrorMessage(error));
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<any> = await authApi.post(
        '/register', 
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
        }
      );
      
      // Handle different response structures
      let authData: AuthResponse;
      
      if (response.data.success !== undefined) {
        if (!response.data.success) {
          throw new Error(response.data.error || 'Registration failed');
        }
        authData = response.data.data;
      } else {
        authData = response.data;
      }

      // Ensure we have all required fields
      if (!authData.user || !authData.token) {
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
        expiresIn: authData.expiresIn || 3600,
        sessionId: authData.sessionId || Math.random().toString(36),
      };
      
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
      const response: AxiosResponse<ApiResponse<UserSession[]>> = await authApi.get('/sessions');
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get sessions');
      }

      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await authApi.post(
        '/sessions/revoke',
        { session_id: sessionId }
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