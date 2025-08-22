import { tokenManager } from './tokenManager';
import { authService } from '../services/authService';

/**
 * Middleware to handle authentication synchronization between frontend and backend
 */
class AuthMiddleware {
  private static instance: AuthMiddleware;
  private tokenRefreshPromise: Promise<void> | null = null;

  public static getInstance(): AuthMiddleware {
    if (!AuthMiddleware.instance) {
      AuthMiddleware.instance = new AuthMiddleware();
    }
    return AuthMiddleware.instance;
  }

  /**
   * Sync token expiration with backend "Remember Me" settings
   */
  async syncTokenExpiration(): Promise<void> {
    try {
      const rememberMe = tokenManager.getRememberMe();
      const currentToken = tokenManager.getToken();
      
      if (!currentToken) return;

      // Get token payload to check expiration
      const payload = tokenManager.getTokenPayload();
      if (!payload) return;

      const currentExpiry = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const expectedExpiry = rememberMe 
        ? now + (30 * 24 * 60 * 60 * 1000) // 30 days
        : now + (24 * 60 * 60 * 1000); // 24 hours

      // If there's a significant difference, refresh the token
      const timeDifference = Math.abs(currentExpiry - expectedExpiry);
      const thresholdMs = 60 * 60 * 1000; // 1 hour threshold

      if (timeDifference > thresholdMs) {
        await this.refreshTokenIfNeeded();
      }
    } catch (error) {
      console.error('Failed to sync token expiration:', error);
    }
  }

  /**
   * Refresh token if needed (with deduplication)
   */
  async refreshTokenIfNeeded(): Promise<void> {
    // Prevent multiple simultaneous refresh requests
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = this.performTokenRefresh();
    
    try {
      await this.tokenRefreshPromise;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<void> {
    try {
      await authService.refreshToken();
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens on refresh failure
      tokenManager.clearTokens();
      
      // Redirect to login if we're not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
      
      throw error;
    }
  }

  /**
   * Handle backend lockout responses
   */
  handleBackendLockout(response: any): boolean {
    if (response.status === 423 || response.data?.account_locked) {
      const lockoutInfo = {
        isLocked: true,
        retryAfter: response.data?.retry_after || 900, // 15 minutes default
        message: response.data?.message || 'Account temporarily locked'
      };
      
      // Store lockout info in localStorage for frontend lockout manager
      const email = response.config?.data ? JSON.parse(response.config.data).email : null;
      if (email) {
        localStorage.setItem(`lockout_${email}`, JSON.stringify(lockoutInfo));
      }
      
      return true;
    }
    return false;
  }

  /**
   * Enhanced session validation with backend sync
   */
  async validateSession(): Promise<boolean> {
    try {
      if (!tokenManager.isValid()) {
        return false;
      }

      // Validate token with backend
      const user = await authService.getCurrentUser();
      return !!user;
    } catch (error) {
      // If validation fails, clear tokens
      tokenManager.clearTokens();
      return false;
    }
  }

  /**
   * Setup periodic session validation
   */
  setupPeriodicValidation(intervalMs: number = 5 * 60 * 1000): () => void {
    const interval = setInterval(async () => {
      if (tokenManager.getToken()) {
        const isValid = await this.validateSession();
        if (!isValid) {
          // Session is invalid, trigger logout
          this.triggerLogout('session_invalid');
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }

  /**
   * Trigger logout with reason
   */
  private triggerLogout(reason: string): void {
    // Dispatch custom event for logout
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason } }));
    }
  }

  /**
   * Setup request interceptor for authentication
   */
  setupRequestInterceptor(): void {
    // This would be called during app initialization
    // The actual interceptor is already set up in authService.ts
    console.log('Auth middleware initialized');
  }

  /**
   * Handle "Remember Me" persistence across browser sessions
   */
  handleRememberMePersistence(): void {
    const rememberMe = tokenManager.getRememberMe();
    
    if (rememberMe) {
      // Ensure tokens are stored in localStorage
      const token = tokenManager.getToken();
      const refreshToken = tokenManager.getRefreshToken();
      const sessionId = tokenManager.getSessionId();
      
      if (token && refreshToken && sessionId) {
        // Force storage in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('session_id', sessionId);
      }
    }
  }

  /**
   * Cross-tab session synchronization
   */
  setupCrossTabSync(): () => void {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' && e.newValue === null) {
        // Token was cleared in another tab, logout this tab too
        this.triggerLogout('cross_tab_logout');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }
}

export const authMiddleware = AuthMiddleware.getInstance();
export default authMiddleware;