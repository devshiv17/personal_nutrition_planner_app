import { useState, useEffect, useCallback } from 'react';
import { lockoutManager } from '../utils/lockoutManager';

interface LockoutState {
  isLocked: boolean;
  attemptsRemaining: number;
  lockoutExpiresAt?: number;
  nextAttemptDelay?: number;
  message?: string;
}

interface SuspiciousActivityState {
  isSuspicious: boolean;
  reasons: string[];
}

interface UseLockoutReturn {
  lockoutStatus: LockoutState | null;
  suspiciousActivity: SuspiciousActivityState | null;
  checkStatus: (email: string) => void;
  recordAttempt: (email: string, successful: boolean) => LockoutState;
  clearLockout: (email: string) => void;
  getAnalytics: () => any;
  isDelayed: boolean;
  delayRemaining: number;
}

export const useLockout = (): UseLockoutReturn => {
  const [lockoutStatus, setLockoutStatus] = useState<LockoutState | null>(null);
  const [suspiciousActivity, setSuspiciousActivity] = useState<SuspiciousActivityState | null>(null);
  const [delayRemaining, setDelayRemaining] = useState<number>(0);

  const checkStatus = useCallback((email: string) => {
    if (!email) {
      setLockoutStatus(null);
      setSuspiciousActivity(null);
      return;
    }

    const status = lockoutManager.checkLockoutStatus(email);
    const suspicious = lockoutManager.checkSuspiciousActivity(email);
    
    setLockoutStatus(status);
    setSuspiciousActivity(suspicious);
    
    // Set up delay countdown if there's a delay
    if (status.nextAttemptDelay && status.nextAttemptDelay > 0) {
      setDelayRemaining(status.nextAttemptDelay);
      
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, status.nextAttemptDelay! - elapsed);
        
        setDelayRemaining(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 100);
      
      // Cleanup interval after delay expires
      setTimeout(() => {
        clearInterval(interval);
        setDelayRemaining(0);
      }, status.nextAttemptDelay);
    } else {
      setDelayRemaining(0);
    }
  }, []);

  const recordAttempt = useCallback((email: string, successful: boolean): LockoutState => {
    const result = lockoutManager.recordLoginAttempt(email, successful);
    checkStatus(email); // Refresh status after recording attempt
    return result;
  }, [checkStatus]);

  const clearLockout = useCallback((email: string) => {
    lockoutManager.clearLockout(email);
    checkStatus(email);
  }, [checkStatus]);

  const getAnalytics = useCallback(() => {
    return lockoutManager.getAnalytics();
  }, []);

  // Auto-refresh status for locked accounts
  useEffect(() => {
    if (!lockoutStatus?.isLocked) return;

    const interval = setInterval(() => {
      if (lockoutStatus.lockoutExpiresAt && Date.now() >= lockoutStatus.lockoutExpiresAt) {
        // Lockout has expired, refresh status
        const currentEmail = getCurrentEmailFromContext(); // You might need to pass this in
        if (currentEmail) {
          checkStatus(currentEmail);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutStatus?.isLocked, lockoutStatus?.lockoutExpiresAt, checkStatus]);

  return {
    lockoutStatus,
    suspiciousActivity,
    checkStatus,
    recordAttempt,
    clearLockout,
    getAnalytics,
    isDelayed: delayRemaining > 0,
    delayRemaining
  };
};

// Helper function to get current email from context or other sources
const getCurrentEmailFromContext = (): string | null => {
  // This would typically come from your auth context or form state
  // For now, return null - you'll need to pass the email to the hook
  return null;
};

export default useLockout;