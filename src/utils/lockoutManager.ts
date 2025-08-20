import { AUTH_CONFIG } from '../constants';

interface LoginAttempt {
  email: string;
  timestamp: number;
  successful: boolean;
  ipAddress?: string;
  userAgent?: string;
}

interface LockoutInfo {
  email: string;
  attempts: number;
  lockedUntil: number;
  lastAttempt: number;
}

interface LockoutStatus {
  isLocked: boolean;
  attemptsRemaining: number;
  lockoutExpiresAt?: number;
  nextAttemptDelay?: number;
  message?: string;
}

class LockoutManager {
  private readonly STORAGE_KEY = 'auth_lockouts';
  private readonly ATTEMPTS_KEY = 'auth_attempts';
  
  constructor() {
    // Clean up expired lockouts on initialization
    this.cleanupExpiredLockouts();
    
    // Set up periodic cleanup
    setInterval(() => {
      this.cleanupExpiredLockouts();
    }, AUTH_CONFIG.LOCKOUT_CLEANUP_INTERVAL);
  }

  private getLockouts(): Record<string, LockoutInfo> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load lockout data:', error);
      return {};
    }
  }

  private saveLockouts(lockouts: Record<string, LockoutInfo>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lockouts));
    } catch (error) {
      console.error('Failed to save lockout data:', error);
    }
  }

  private getAttempts(): LoginAttempt[] {
    try {
      const data = localStorage.getItem(this.ATTEMPTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load attempts data:', error);
      return [];
    }
  }

  private saveAttempts(attempts: LoginAttempt[]): void {
    try {
      // Keep only the last 100 attempts to prevent storage bloat
      const recentAttempts = attempts.slice(-100);
      localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(recentAttempts));
    } catch (error) {
      console.error('Failed to save attempts data:', error);
    }
  }

  private cleanupExpiredLockouts(): void {
    const lockouts = this.getLockouts();
    const now = Date.now();
    let hasChanges = false;

    for (const email in lockouts) {
      if (lockouts[email].lockedUntil < now) {
        delete lockouts[email];
        hasChanges = true;
      }
    }

    if (hasChanges) {
      this.saveLockouts(lockouts);
    }
  }

  private getClientFingerprint(): string {
    // Create a simple fingerprint for tracking attempts
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Fingerprint', 2, 2);
    }

    return [
      navigator.userAgent,
      navigator.language,
      window.screen ? `${window.screen.width}x${window.screen.height}` : '0x0',
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
    ].join('|');
  }

  private calculateDelay(attemptCount: number): number {
    // Progressive delay: 1s, 2s, 4s, 8s, 16s, then capped at 30s
    const delay = Math.min(
      AUTH_CONFIG.PROGRESSIVE_DELAY_BASE * Math.pow(2, attemptCount - 1),
      AUTH_CONFIG.PROGRESSIVE_DELAY_MAX
    );
    return delay;
  }

  checkLockoutStatus(email: string): LockoutStatus {
    const normalizedEmail = email.toLowerCase().trim();
    const lockouts = this.getLockouts();
    const now = Date.now();

    // Check if email is currently locked
    const lockout = lockouts[normalizedEmail];
    if (lockout && lockout.lockedUntil > now) {
      return {
        isLocked: true,
        attemptsRemaining: 0,
        lockoutExpiresAt: lockout.lockedUntil,
        message: `Account temporarily locked. Try again in ${Math.ceil((lockout.lockedUntil - now) / 60000)} minutes.`,
      };
    }

    // Calculate attempts remaining
    const attemptsRemaining = Math.max(0, AUTH_CONFIG.MAX_LOGIN_ATTEMPTS - (lockout?.attempts || 0));
    
    // Calculate delay for next attempt based on recent failures
    const nextAttemptDelay = lockout ? this.calculateDelay(lockout.attempts) : 0;

    return {
      isLocked: false,
      attemptsRemaining,
      nextAttemptDelay,
      message: attemptsRemaining <= 2 ? 
        `${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining before account lockout.` : 
        undefined,
    };
  }

  recordLoginAttempt(email: string, successful: boolean): LockoutStatus {
    const normalizedEmail = email.toLowerCase().trim();
    const now = Date.now();
    const lockouts = this.getLockouts();
    const attempts = this.getAttempts();

    // Record the attempt
    const attempt: LoginAttempt = {
      email: normalizedEmail,
      timestamp: now,
      successful,
      userAgent: navigator.userAgent,
    };

    attempts.push(attempt);
    this.saveAttempts(attempts);

    if (successful) {
      // Clear lockout on successful login
      delete lockouts[normalizedEmail];
      this.saveLockouts(lockouts);
      
      return {
        isLocked: false,
        attemptsRemaining: AUTH_CONFIG.MAX_LOGIN_ATTEMPTS,
      };
    }

    // Handle failed attempt
    const existingLockout = lockouts[normalizedEmail];
    const currentAttempts = (existingLockout?.attempts || 0) + 1;

    if (currentAttempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
      // Lock the account
      lockouts[normalizedEmail] = {
        email: normalizedEmail,
        attempts: currentAttempts,
        lockedUntil: now + AUTH_CONFIG.LOCKOUT_DURATION,
        lastAttempt: now,
      };
      
      this.saveLockouts(lockouts);
      
      return {
        isLocked: true,
        attemptsRemaining: 0,
        lockoutExpiresAt: lockouts[normalizedEmail].lockedUntil,
        message: `Account locked due to too many failed attempts. Try again in ${Math.ceil(AUTH_CONFIG.LOCKOUT_DURATION / 60000)} minutes.`,
      };
    } else {
      // Update attempt count
      lockouts[normalizedEmail] = {
        email: normalizedEmail,
        attempts: currentAttempts,
        lockedUntil: 0,
        lastAttempt: now,
      };
      
      this.saveLockouts(lockouts);
      
      const attemptsRemaining = AUTH_CONFIG.MAX_LOGIN_ATTEMPTS - currentAttempts;
      const nextAttemptDelay = this.calculateDelay(currentAttempts);
      
      return {
        isLocked: false,
        attemptsRemaining,
        nextAttemptDelay,
        message: `Invalid credentials. ${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining.`,
      };
    }
  }

  clearLockout(email: string): void {
    const normalizedEmail = email.toLowerCase().trim();
    const lockouts = this.getLockouts();
    
    if (lockouts[normalizedEmail]) {
      delete lockouts[normalizedEmail];
      this.saveLockouts(lockouts);
    }
  }

  // Get lockout analytics (for debugging/admin purposes)
  getAnalytics(): {
    totalLockouts: number;
    activeLockouts: number;
    recentAttempts: number;
    topFailedEmails: Array<{ email: string; attempts: number }>;
  } {
    const lockouts = this.getLockouts();
    const attempts = this.getAttempts();
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    const activeLockouts = Object.values(lockouts).filter(l => l.lockedUntil > now).length;
    const recentAttempts = attempts.filter(a => a.timestamp > oneHourAgo).length;
    
    // Count failed attempts by email
    const failedByEmail: Record<string, number> = {};
    attempts
      .filter(a => !a.successful && a.timestamp > oneHourAgo)
      .forEach(a => {
        failedByEmail[a.email] = (failedByEmail[a.email] || 0) + 1;
      });

    const topFailedEmails = Object.entries(failedByEmail)
      .map(([email, attempts]) => ({ email, attempts }))
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 5);

    return {
      totalLockouts: Object.keys(lockouts).length,
      activeLockouts,
      recentAttempts,
      topFailedEmails,
    };
  }

  // Security check for suspicious patterns
  checkSuspiciousActivity(email: string): {
    isSuspicious: boolean;
    reasons: string[];
  } {
    const normalizedEmail = email.toLowerCase().trim();
    const attempts = this.getAttempts();
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const reasons: string[] = [];

    // Get recent attempts for this email
    const recentAttempts = attempts.filter(a => 
      a.email === normalizedEmail && a.timestamp > oneHourAgo
    );

    // Check for rapid-fire attempts
    const veryRecentAttempts = attempts.filter(a => 
      a.email === normalizedEmail && a.timestamp > (now - 5 * 60 * 1000) // Last 5 minutes
    );

    if (veryRecentAttempts.length > 10) {
      reasons.push('Rapid succession of login attempts');
    }

    // Check for attempts from multiple user agents
    const userAgents = new Set(recentAttempts.map(a => a.userAgent).filter(Boolean));
    if (userAgents.size > 3) {
      reasons.push('Multiple different browsers/devices used');
    }

    // Check for distributed timing patterns (potential bot)
    if (recentAttempts.length > 5) {
      const intervals = recentAttempts
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(1)
        .map((attempt, i) => attempt.timestamp - recentAttempts[i].timestamp);

      const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
      const isRegularPattern = intervals.every(interval => Math.abs(interval - avgInterval) < 1000);

      if (isRegularPattern && avgInterval < 10000) { // Less than 10 seconds apart
        reasons.push('Regular timing pattern suggesting automated attempts');
      }
    }

    return {
      isSuspicious: reasons.length > 0,
      reasons,
    };
  }

  // Clear all data (for testing/reset purposes)
  clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.ATTEMPTS_KEY);
  }
}

// Export singleton instance
export const lockoutManager = new LockoutManager();
export default lockoutManager;