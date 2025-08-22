import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { lockoutManager } from '../../utils/lockoutManager';
import { Alert } from '../ui/Alert';

const WarningContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CountdownText = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.error};
`;

const AttemptsRemaining = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.warning};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.warning}10;
  border-radius: 0.375rem;
  border: 1px solid ${({ theme }) => theme.colors.warning}30;
`;

const SuspiciousActivityWarning = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.error}10;
  border-radius: 0.375rem;
  border: 1px solid ${({ theme }) => theme.colors.error}30;
  
  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

interface LockoutWarningProps {
  email: string;
  className?: string;
}

const LockoutWarning: React.FC<LockoutWarningProps> = ({ email, className }) => {
  const [lockoutStatus, setLockoutStatus] = useState<any>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [suspiciousActivity, setSuspiciousActivity] = useState<any>(null);

  useEffect(() => {
    if (!email) return;

    const updateStatus = () => {
      const status = lockoutManager.checkLockoutStatus(email);
      const suspicious = lockoutManager.checkSuspiciousActivity(email);
      
      setLockoutStatus(status);
      setSuspiciousActivity(suspicious);
      
      if (status.lockoutExpiresAt) {
        setCountdown(Math.max(0, status.lockoutExpiresAt - Date.now()));
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [email]);

  if (!lockoutStatus) return null;

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <WarningContainer className={className}>
      {/* Account Locked */}
      {lockoutStatus.isLocked && (
        <Alert variant="error">
          <strong>Account Temporarily Locked</strong>
          <br />
          Too many failed login attempts. Please try again in{' '}
          <CountdownText>{formatTime(countdown)}</CountdownText>.
        </Alert>
      )}

      {/* Warning for remaining attempts */}
      {!lockoutStatus.isLocked && lockoutStatus.attemptsRemaining <= 2 && lockoutStatus.attemptsRemaining > 0 && (
        <AttemptsRemaining>
          ⚠️ <strong>{lockoutStatus.attemptsRemaining}</strong> attempt{lockoutStatus.attemptsRemaining !== 1 ? 's' : ''} remaining before account lockout
        </AttemptsRemaining>
      )}

      {/* Progressive delay warning */}
      {!lockoutStatus.isLocked && lockoutStatus.nextAttemptDelay && lockoutStatus.nextAttemptDelay > 1000 && (
        <AttemptsRemaining>
          🕐 Please wait <strong>{Math.ceil(lockoutStatus.nextAttemptDelay / 1000)}</strong> seconds before next attempt
        </AttemptsRemaining>
      )}

      {/* Suspicious activity warning */}
      {suspiciousActivity?.isSuspicious && (
        <SuspiciousActivityWarning>
          <strong>⚡ Suspicious Activity Detected</strong>
          {suspiciousActivity.reasons.map((reason: string, index: number) => (
            <div key={index}>• {reason}</div>
          ))}
        </SuspiciousActivityWarning>
      )}
    </WarningContainer>
  );
};

export default LockoutWarning;