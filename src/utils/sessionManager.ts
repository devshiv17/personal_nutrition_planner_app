import { AuthState, UserSession } from '../types';
import { AUTH_CONFIG } from '../constants';
import { tokenManager } from './tokenManager';
import { authService } from '../services/authService';

type SessionEventType = 
  | 'SESSION_WARNING' 
  | 'SESSION_EXPIRED' 
  | 'SESSION_EXTENDED' 
  | 'SUSPICIOUS_ACTIVITY'
  | 'MULTIPLE_TABS_DETECTED'
  | 'TOKEN_REFRESHED';

interface SessionEvent {
  type: SessionEventType;
  timestamp: number;
  data?: any;
}

type SessionEventListener = (event: SessionEvent) => void;

class SessionManager {
  private listeners: Set<SessionEventListener> = new Set();
  private activityTimer: number | null = null;
  private warningTimer: number | null = null;
  private refreshTimer: number | null = null;
  private visibilityChangeHandler: () => void;
  private beforeUnloadHandler: () => void;
  private storageHandler: (e: StorageEvent) => void;
  private isInitialized = false;

  constructor() {
    this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);
    this.beforeUnloadHandler = this.handleBeforeUnload.bind(this);
    this.storageHandler = this.handleStorageChange.bind(this);
  }

  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Set up event listeners
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    }
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
    window.addEventListener('storage', this.storageHandler);

    // Set up activity tracking
    this.setupActivityTracking();
    this.setupTimers();

    this.isInitialized = true;
  }

  destroy(): void {
    if (!this.isInitialized || typeof window === 'undefined') return;

    // Remove event listeners
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    window.removeEventListener('storage', this.storageHandler);

    // Clear timers
    this.clearTimers();
    this.teardownActivityTracking();

    this.isInitialized = false;
  }

  private setupActivityTracking(): void {
    if (typeof document === 'undefined') return;
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = this.throttle(() => {
      this.updateActivity();
    }, 30000); // Throttle to once per 30 seconds

    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    // Store the handler for cleanup
    (this as any).activityHandler = activityHandler;
    (this as any).activityEvents = events;
  }

  private teardownActivityTracking(): void {
    if (typeof document === 'undefined') return;
    
    const events = (this as any).activityEvents;
    const handler = (this as any).activityHandler;

    if (events && handler) {
      events.forEach((event: string) => {
        document.removeEventListener(event, handler, true);
      });
    }
  }

  private setupTimers(): void {
    this.clearTimers();

    // Activity check timer
    this.activityTimer = window.setInterval(() => {
      this.checkSession();
    }, AUTH_CONFIG.ACTIVITY_CHECK_INTERVAL);

    // Token refresh timer
    if (tokenManager.isValid()) {
      this.scheduleTokenRefresh();
    }
  }

  private clearTimers(): void {
    if (this.activityTimer) {
      window.clearInterval(this.activityTimer);
      this.activityTimer = null;
    }

    if (this.warningTimer) {
      window.clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }

    if (this.refreshTimer) {
      window.clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      window.clearTimeout(this.refreshTimer);
    }

    const timeToRefresh = tokenManager.getTimeToExpiry() - AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD;
    
    if (timeToRefresh > 0) {
      this.refreshTimer = window.setTimeout(async () => {
        await this.refreshTokenIfNeeded();
      }, timeToRefresh);
    }
  }

  private scheduleSessionWarning(): void {
    if (this.warningTimer) {
      window.clearTimeout(this.warningTimer);
    }

    const timeToWarning = tokenManager.getTimeToExpiry() - AUTH_CONFIG.SESSION_WARNING_THRESHOLD;
    
    if (timeToWarning > 0) {
      this.warningTimer = window.setTimeout(() => {
        this.emitEvent({
          type: 'SESSION_WARNING',
          timestamp: Date.now(),
          data: {
            timeRemaining: tokenManager.getTimeToExpiry(),
          },
        });
      }, timeToWarning);
    }
  }

  private updateActivity(): void {
    tokenManager.updateLastActivity();
    this.emitEvent({
      type: 'SESSION_EXTENDED',
      timestamp: Date.now(),
    });
  }

  private async checkSession(): Promise<void> {
    if (!tokenManager.isValid()) {
      this.handleSessionExpired();
      return;
    }

    // Check for suspicious activity
    await this.checkSuspiciousActivity();

    // Schedule warnings and refresh if needed
    if (tokenManager.shouldShowSessionWarning()) {
      this.scheduleSessionWarning();
    }

    if (tokenManager.isExpiringSoon()) {
      await this.refreshTokenIfNeeded();
    }
  }

  private async refreshTokenIfNeeded(): Promise<void> {
    if (!tokenManager.isExpiringSoon()) return;

    try {
      await authService.refreshToken();
      
      this.emitEvent({
        type: 'TOKEN_REFRESHED',
        timestamp: Date.now(),
      });

      // Reschedule refresh for the new token
      this.scheduleTokenRefresh();
      
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.handleSessionExpired();
    }
  }

  private handleSessionExpired(): void {
    this.emitEvent({
      type: 'SESSION_EXPIRED',
      timestamp: Date.now(),
    });

    this.clearTimers();
    tokenManager.clearTokens();
  }

  private async checkSuspiciousActivity(): Promise<void> {
    // Check for multiple tabs/windows
    if (this.detectMultipleTabs()) {
      this.emitEvent({
        type: 'MULTIPLE_TABS_DETECTED',
        timestamp: Date.now(),
      });
    }

    // Check token validity
    const tokenPayload = tokenManager.getTokenPayload();
    if (tokenPayload) {
      const now = Math.floor(Date.now() / 1000);
      
      // Check if token was issued in the future (clock skew attack)
      if (tokenPayload.iat && tokenPayload.iat > now + 300) { // 5 minute tolerance
        this.emitEvent({
          type: 'SUSPICIOUS_ACTIVITY',
          timestamp: Date.now(),
          data: { reason: 'token_issued_in_future' },
        });
      }

      // Check if device fingerprint changed
      const currentFingerprint = tokenManager.generateDeviceFingerprint();
      const storedFingerprint = localStorage.getItem('device_fingerprint');
      
      if (storedFingerprint && storedFingerprint !== currentFingerprint) {
        this.emitEvent({
          type: 'SUSPICIOUS_ACTIVITY',
          timestamp: Date.now(),
          data: { reason: 'device_fingerprint_changed' },
        });
      } else if (!storedFingerprint) {
        localStorage.setItem('device_fingerprint', currentFingerprint);
      }
    }
  }

  private detectMultipleTabs(): boolean {
    // Use broadcast channel to detect multiple tabs
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('auth_session');
        const tabId = sessionStorage.getItem('tab_id') || Math.random().toString(36);
        
        if (!sessionStorage.getItem('tab_id')) {
          sessionStorage.setItem('tab_id', tabId);
        }

        // Send ping to other tabs
        channel.postMessage({ type: 'ping', tabId });

        // Listen for responses
        let responseCount = 0;
        const responseHandler = (event: MessageEvent) => {
          if (event.data.type === 'pong' && event.data.tabId !== tabId) {
            responseCount++;
          }
        };

        channel.addEventListener('message', responseHandler);

        // Clean up after a short delay
        window.setTimeout(() => {
          channel.removeEventListener('message', responseHandler);
          channel.close();
        }, 1000);

        return responseCount > 0;
      } catch (error) {
        console.warn('Failed to check for multiple tabs:', error);
      }
    }

    return false;
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Tab became hidden
      this.pauseSession();
    } else {
      // Tab became visible
      this.resumeSession();
    }
  }

  private pauseSession(): void {
    // Reduce activity when tab is not visible
    this.clearTimers();
  }

  private resumeSession(): void {
    // Resume normal operation when tab becomes visible
    this.updateActivity();
    this.setupTimers();
    this.checkSession();
  }

  private handleBeforeUnload(): void {
    // Update last activity before page unload
    tokenManager.updateLastActivity();
  }

  private handleStorageChange(event: StorageEvent): void {
    // Handle auth state changes from other tabs
    if (event.key === 'auth_token' && !event.newValue) {
      // Token was removed in another tab
      this.handleSessionExpired();
    } else if (event.key === 'auth_token' && event.newValue) {
      // Token was updated in another tab
      tokenManager.reloadFromStorage();
      this.setupTimers();
    }
  }

  // Public API
  async extendSession(): Promise<void> {
    this.updateActivity();
    await this.refreshTokenIfNeeded();
  }

  async getActiveSessions(): Promise<UserSession[]> {
    try {
      return await authService.getActiveSessions();
    } catch (error) {
      console.error('Failed to get active sessions:', error);
      return [];
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    try {
      await authService.revokeSession(sessionId);
    } catch (error) {
      console.error('Failed to revoke session:', error);
      throw error;
    }
  }

  getSessionInfo() {
    return {
      isValid: tokenManager.isValid(),
      timeToExpiry: tokenManager.getTimeToExpiry(),
      lastActivity: tokenManager.getLastActivity(),
      sessionId: tokenManager.getSessionId(),
      isExpiringSoon: tokenManager.isExpiringSoon(),
      shouldShowWarning: tokenManager.shouldShowSessionWarning(),
    };
  }

  // Event system
  addEventListener(listener: SessionEventListener): void {
    this.listeners.add(listener);
  }

  removeEventListener(listener: SessionEventListener): void {
    this.listeners.delete(listener);
  }

  private emitEvent(event: SessionEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Session event listener error:', error);
      }
    });
  }

  // Utility functions
  private throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        window.setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
export default sessionManager;