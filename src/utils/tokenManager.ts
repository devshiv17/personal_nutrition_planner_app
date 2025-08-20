import { User } from '../types';
import { STORAGE_KEYS, AUTH_CONFIG } from '../constants';

interface TokenData {
  token: string;
  refreshToken: string;
  expiresAt: number;
  sessionId: string;
}

class TokenManager {
  private tokenData: TokenData | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const token = this.getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
      const refreshToken = this.getFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
      const sessionId = this.getFromStorage(STORAGE_KEYS.SESSION_ID);
      const expiresAt = this.getFromStorage('token_expires_at');

      if (token && refreshToken && expiresAt && sessionId) {
        this.tokenData = {
          token,
          refreshToken,
          expiresAt: parseInt(expiresAt, 10),
          sessionId,
        };
      }
    } catch (error) {
      console.warn('Failed to load tokens from storage:', error);
      this.clearTokens();
    }
  }

  private saveToStorage(): void {
    if (!this.tokenData) return;

    try {
      this.setInStorage(STORAGE_KEYS.AUTH_TOKEN, this.tokenData.token);
      this.setInStorage(STORAGE_KEYS.REFRESH_TOKEN, this.tokenData.refreshToken);
      this.setInStorage(STORAGE_KEYS.SESSION_ID, this.tokenData.sessionId);
      this.setInStorage('token_expires_at', this.tokenData.expiresAt.toString());
    } catch (error) {
      console.error('Failed to save tokens to storage:', error);
    }
  }

  private getFromStorage(key: string): string | null {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;
    return storage.getItem(key);
  }

  private setInStorage(key: string, value: string): void {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(key, value);
  }

  private removeFromStorage(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  setTokens(token: string, refreshToken: string, expiresIn: number, sessionId?: string): void {
    const expiresAt = Date.now() + (expiresIn * 1000);
    
    this.tokenData = {
      token,
      refreshToken,
      expiresAt,
      sessionId: sessionId || this.tokenData?.sessionId || '',
    };

    this.saveToStorage();
    this.updateLastActivity();
  }

  setSessionId(sessionId: string): void {
    if (this.tokenData) {
      this.tokenData.sessionId = sessionId;
      this.setInStorage(STORAGE_KEYS.SESSION_ID, sessionId);
    }
  }

  setUserData(user: User): void {
    try {
      const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  getToken(): string | null {
    return this.tokenData?.token || null;
  }

  getRefreshToken(): string | null {
    return this.tokenData?.refreshToken || null;
  }

  getSessionId(): string | null {
    return this.tokenData?.sessionId || null;
  }

  getUserData(): User | null {
    try {
      const userData = this.getFromStorage(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  }

  isValid(): boolean {
    if (!this.tokenData) return false;
    
    const now = Date.now();
    const isTokenValid = now < this.tokenData.expiresAt;
    const isSessionActive = this.isSessionActive();

    return isTokenValid && isSessionActive;
  }

  isExpiringSoon(): boolean {
    if (!this.tokenData) return false;
    
    const now = Date.now();
    const timeToExpiry = this.tokenData.expiresAt - now;
    
    return timeToExpiry <= AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD;
  }

  shouldShowSessionWarning(): boolean {
    if (!this.tokenData) return false;
    
    const now = Date.now();
    const timeToExpiry = this.tokenData.expiresAt - now;
    
    return timeToExpiry <= AUTH_CONFIG.SESSION_WARNING_THRESHOLD;
  }

  getTimeToExpiry(): number {
    if (!this.tokenData) return 0;
    return Math.max(0, this.tokenData.expiresAt - Date.now());
  }

  clearTokens(): void {
    this.tokenData = null;
    
    // Clear from both storages
    this.removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    this.removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
    this.removeFromStorage(STORAGE_KEYS.USER_DATA);
    this.removeFromStorage(STORAGE_KEYS.SESSION_ID);
    this.removeFromStorage(STORAGE_KEYS.LAST_ACTIVITY);
    this.removeFromStorage('token_expires_at');
  }

  updateLastActivity(): void {
    const now = Date.now().toString();
    this.setInStorage(STORAGE_KEYS.LAST_ACTIVITY, now);
  }

  getLastActivity(): number {
    const lastActivity = this.getFromStorage(STORAGE_KEYS.LAST_ACTIVITY);
    return lastActivity ? parseInt(lastActivity, 10) : Date.now();
  }

  isSessionActive(): boolean {
    const lastActivity = this.getLastActivity();
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;
    
    return timeSinceLastActivity < AUTH_CONFIG.SESSION_TIMEOUT;
  }

  extendSession(): void {
    this.updateLastActivity();
  }

  setRememberMe(remember: boolean): void {
    if (remember) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    }
  }

  getRememberMe(): boolean {
    return localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
  }

  // Security utilities
  generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      (typeof window !== 'undefined' && window.screen ? window.screen.width + 'x' + window.screen.height : '0x0'),
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      navigator.platform,
      navigator.hardwareConcurrency || 0,
    ].join('|');

    // Simple hash function (in production, use a proper crypto library)
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  validateTokenFormat(token: string): boolean {
    // Basic JWT format validation (header.payload.signature)
    const parts = token.split('.');
    return parts.length === 3;
  }

  getTokenPayload(): any {
    const token = this.getToken();
    if (!token || !this.validateTokenFormat(token)) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode token payload:', error);
      return null;
    }
  }

  // Public method to reload from storage
  reloadFromStorage(): void {
    try {
      const token = this.getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
      const refreshToken = this.getFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
      const sessionId = this.getFromStorage(STORAGE_KEYS.SESSION_ID);
      const expiresAt = this.getFromStorage('token_expires_at');

      if (token && refreshToken && expiresAt && sessionId) {
        this.tokenData = {
          token,
          refreshToken,
          expiresAt: parseInt(expiresAt, 10),
          sessionId,
        };
      } else {
        this.tokenData = null;
      }
    } catch (error) {
      console.warn('Failed to reload tokens from storage:', error);
      this.clearTokens();
    }
  }

  getDebugInfo() {
    return {
      hasToken: !!this.tokenData?.token,
      hasRefreshToken: !!this.tokenData?.refreshToken,
      isValid: this.isValid(),
      isExpiringSoon: this.isExpiringSoon(),
      timeToExpiry: this.getTimeToExpiry(),
      lastActivity: this.getLastActivity(),
      isSessionActive: this.isSessionActive(),
      rememberMe: this.getRememberMe(),
      sessionId: this.getSessionId(),
    };
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();
export default tokenManager;