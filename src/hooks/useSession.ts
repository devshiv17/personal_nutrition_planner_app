import { useState, useEffect, useCallback } from 'react';
import { UserSession } from '../types';
import { sessionManager } from '../utils/sessionManager';
import { useAuth } from './useAuth';

interface SessionInfo {
  isValid: boolean;
  timeToExpiry: number;
  lastActivity: number;
  sessionId: string | null;
  isExpiringSoon: boolean;
  shouldShowWarning: boolean;
}

interface UseSessionReturn {
  sessionInfo: SessionInfo;
  activeSessions: UserSession[];
  sessionWarning: boolean;
  extendSession: () => Promise<void>;
  getActiveSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  dismissWarning: () => void;
}

export const useSession = (): UseSessionReturn => {
  const { isAuthenticated } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>(() => 
    sessionManager.getSessionInfo()
  );
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
  const [sessionWarning, setSessionWarning] = useState(false);

  // Update session info periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateSessionInfo = () => {
      setSessionInfo(sessionManager.getSessionInfo());
    };

    // Initial update
    updateSessionInfo();

    // Set up periodic updates
    const interval = setInterval(updateSessionInfo, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Handle session events
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleSessionEvent = (event: any) => {
      switch (event.type) {
        case 'SESSION_WARNING':
          setSessionWarning(true);
          break;
        
        case 'SESSION_EXPIRED':
          setSessionWarning(false);
          break;
        
        case 'SESSION_EXTENDED':
        case 'TOKEN_REFRESHED':
          setSessionInfo(sessionManager.getSessionInfo());
          break;

        case 'SUSPICIOUS_ACTIVITY':
          console.warn('Suspicious activity detected:', event.data);
          break;

        case 'MULTIPLE_TABS_DETECTED':
          console.info('Multiple tabs detected');
          break;
      }
    };

    sessionManager.addEventListener(handleSessionEvent);

    return () => {
      sessionManager.removeEventListener(handleSessionEvent);
    };
  }, [isAuthenticated]);

  const extendSession = useCallback(async () => {
    try {
      await sessionManager.extendSession();
      setSessionInfo(sessionManager.getSessionInfo());
      setSessionWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  }, []);

  const getActiveSessions = useCallback(async () => {
    try {
      const sessions = await sessionManager.getActiveSessions();
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Failed to get active sessions:', error);
    }
  }, []);

  const revokeSession = useCallback(async (sessionId: string) => {
    try {
      await sessionManager.revokeSession(sessionId);
      // Refresh the sessions list
      await getActiveSessions();
    } catch (error) {
      console.error('Failed to revoke session:', error);
      throw error;
    }
  }, [getActiveSessions]);

  const dismissWarning = useCallback(() => {
    setSessionWarning(false);
  }, []);

  return {
    sessionInfo,
    activeSessions,
    sessionWarning,
    extendSession,
    getActiveSessions,
    revokeSession,
    dismissWarning,
  };
};