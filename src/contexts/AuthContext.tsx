import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { AuthState, User, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm, ChangePasswordData, UserSession } from '../types';
import { STORAGE_KEYS } from '../constants';
import { authService } from '../services/authService';
import { tokenManager } from '../utils/tokenManager';
import { sessionManager } from '../utils/sessionManager';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  refreshAccessToken: () => Promise<void>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<void>;
  resetPassword: (data: PasswordResetConfirm) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  getActiveSessions: () => Promise<UserSession[]>;
  revokeSession: (sessionId: string) => Promise<void>;
  extendSession: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string; refreshToken: string; tokenExpiry: number; sessionId: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION_WARNING'; payload: boolean }
  | { type: 'UPDATE_LAST_ACTIVITY' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'TOKEN_REFRESHED'; payload: { token: string; refreshToken: string; tokenExpiry: number } };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  tokenExpiry: null,
  sessionId: null,
  loading: false,
  error: null,
  lastActivity: Date.now(),
  sessionWarning: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        tokenExpiry: action.payload.tokenExpiry,
        sessionId: action.payload.sessionId,
        loading: false,
        error: null,
        lastActivity: Date.now(),
        sessionWarning: false,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        tokenExpiry: null,
        sessionId: null,
        loading: false,
        error: action.payload,
        sessionWarning: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_SESSION_WARNING':
      return {
        ...state,
        sessionWarning: action.payload,
      };
    case 'UPDATE_LAST_ACTIVITY':
      return {
        ...state,
        lastActivity: Date.now(),
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'TOKEN_REFRESHED':
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        tokenExpiry: action.payload.tokenExpiry,
        lastActivity: Date.now(),
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from storage and session manager
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if tokens are valid
        if (tokenManager.isValid()) {
          const user = tokenManager.getUserData();
          const token = tokenManager.getToken();
          const refreshToken = tokenManager.getRefreshToken();
          const sessionId = tokenManager.getSessionId();
          
          if (user && token && refreshToken && sessionId) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user,
                token,
                refreshToken,
                tokenExpiry: Date.now() + tokenManager.getTimeToExpiry(),
                sessionId,
              },
            });

            // Initialize session manager
            sessionManager.initialize();
          } else {
            // Clear invalid tokens
            tokenManager.clearTokens();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        tokenManager.clearTokens();
      }
    };

    initializeAuth();

    // Cleanup session manager on unmount
    return () => {
      sessionManager.destroy();
    };
  }, []);

  // Set up session event listeners
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const handleSessionEvent = (event: any) => {
      switch (event.type) {
        case 'SESSION_WARNING':
          dispatch({ type: 'SET_SESSION_WARNING', payload: true });
          break;
        
        case 'SESSION_EXPIRED':
          dispatch({ type: 'LOGOUT' });
          break;
        
        case 'SESSION_EXTENDED':
          dispatch({ type: 'UPDATE_LAST_ACTIVITY' });
          dispatch({ type: 'SET_SESSION_WARNING', payload: false });
          break;

        case 'TOKEN_REFRESHED':
          dispatch({
            type: 'TOKEN_REFRESHED',
            payload: {
              token: tokenManager.getToken() || '',
              refreshToken: tokenManager.getRefreshToken() || '',
              tokenExpiry: Date.now() + tokenManager.getTimeToExpiry(),
            },
          });
          break;

        case 'SUSPICIOUS_ACTIVITY':
          console.warn('Suspicious activity detected:', event.data);
          break;
      }
    };

    sessionManager.addEventListener(handleSessionEvent);

    return () => {
      sessionManager.removeEventListener(handleSessionEvent);
    };
  }, [state.isAuthenticated]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Set remember me preference
      if (credentials.rememberMe !== undefined) {
        tokenManager.setRememberMe(credentials.rememberMe);
      }

      const authData = await authService.login(credentials);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: authData.user,
          token: authData.token,
          refreshToken: authData.refreshToken,
          tokenExpiry: Date.now() + (authData.expiresIn * 1000),
          sessionId: authData.sessionId,
        },
      });

      // Initialize session management
      sessionManager.initialize();

    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const authData = await authService.register(data);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: authData.user,
          token: authData.token,
          refreshToken: authData.refreshToken,
          tokenExpiry: Date.now() + (authData.expiresIn * 1000),
          sessionId: authData.sessionId,
        },
      });

      // Initialize session management
      sessionManager.initialize();

    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Registration failed',
      });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      sessionManager.destroy();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await authService.logoutAll();
    } catch (error) {
      console.warn('Logout all API call failed:', error);
    } finally {
      sessionManager.destroy();
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      await authService.refreshToken();
      // Token refresh updates are handled by session manager events
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  }, []);

  const requestPasswordReset = useCallback(async (data: PasswordResetRequest) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.requestPasswordReset(data);
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Password reset request failed',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const resetPassword = useCallback(async (data: PasswordResetConfirm) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.resetPassword(data);
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Password reset failed',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const changePassword = useCallback(async (data: ChangePasswordData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await authService.changePassword(data);
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : 'Password change failed',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      dispatch({ type: 'UPDATE_USER', payload: user });
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }, []);

  const getActiveSessions = useCallback(async (): Promise<UserSession[]> => {
    try {
      return await authService.getActiveSessions();
    } catch (error) {
      console.error('Failed to get active sessions:', error);
      throw error;
    }
  }, []);

  const revokeSession = useCallback(async (sessionId: string) => {
    try {
      await authService.revokeSession(sessionId);
    } catch (error) {
      console.error('Failed to revoke session:', error);
      throw error;
    }
  }, []);

  const extendSession = useCallback(async () => {
    try {
      await sessionManager.extendSession();
      dispatch({ type: 'UPDATE_LAST_ACTIVITY' });
      dispatch({ type: 'SET_SESSION_WARNING', payload: false });
    } catch (error) {
      console.error('Failed to extend session:', error);
      throw error;
    }
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
    
    // Update stored user data
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      tokenManager.setUserData(updatedUser);
    }
  }, [state.user]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    logoutAll,
    updateUser,
    refreshAccessToken,
    requestPasswordReset,
    resetPassword,
    changePassword,
    getCurrentUser,
    getActiveSessions,
    revokeSession,
    extendSession,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Note: useAuth hook is now in hooks/useAuth.ts
export { AuthContext };