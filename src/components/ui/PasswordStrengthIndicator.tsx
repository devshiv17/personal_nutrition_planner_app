import React from 'react';
import styled, { keyframes } from 'styled-components';
import { calculatePasswordStrength } from '../../hooks/useFormValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  margin-top: 0.5rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const StrengthBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const StrengthFill = styled.div<{ 
  level: 'weak' | 'fair' | 'good' | 'strong';
  width: number;
}>`
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
  width: ${({ width }) => width}%;
  background: ${({ level }) => {
    switch (level) {
      case 'weak': return 'linear-gradient(90deg, #e53e3e, #fc8181)';
      case 'fair': return 'linear-gradient(90deg, #ed8936, #f6ad55)';
      case 'good': return 'linear-gradient(90deg, #38a169, #68d391)';
      case 'strong': return 'linear-gradient(90deg, #00b4d8, #0077b6)';
      default: return '#e2e8f0';
    }
  }};
`;

const StrengthLevel = styled.div<{ level: 'weak' | 'fair' | 'good' | 'strong' }>`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ level }) => {
    switch (level) {
      case 'weak': return '#e53e3e';
      case 'fair': return '#ed8936';
      case 'good': return '#38a169';
      case 'strong': return '#0077b6';
      default: return '#718096';
    }
  }};
  margin-bottom: 0.25rem;
`;

const FeedbackList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.75rem;
`;

const FeedbackItem = styled.li<{ type: 'error' | 'success' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.125rem 0;
  color: ${({ type }) => {
    switch (type) {
      case 'error': return '#e53e3e';
      case 'success': return '#38a169';
      case 'info': return '#3182ce';
      default: return '#718096';
    }
  }};

  &::before {
    content: ${({ type }) => {
      switch (type) {
        case 'error': return '"✕"';
        case 'success': return '"✓"';
        case 'info': return '"ⓘ"';
        default: return '"•"';
      }
    }};
    font-size: 0.625rem;
    font-weight: bold;
  }
`;

const Requirements = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgba(74, 85, 104, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(74, 85, 104, 0.1);
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.75rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const RequirementItem = styled.li<{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: ${({ met }) => met ? '#38a169' : '#718096'};
  transition: color 0.2s ease;

  &::before {
    content: ${({ met }) => met ? '"✓"' : '"○"'};
    font-size: 0.625rem;
    font-weight: bold;
    color: ${({ met }) => met ? '#38a169' : '#cbd5e0'};
  }
`;

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  className
}) => {
  if (!password) return null;

  const { score, level, feedback } = calculatePasswordStrength(password);
  const maxScore = 9;
  const percentage = Math.min((score / maxScore) * 100, 100);

  // Password requirements
  const requirements = [
    { text: '8+ characters', met: password.length >= 8 },
    { text: 'Lowercase letter', met: /[a-z]/.test(password) },
    { text: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'Number', met: /\d/.test(password) },
    { text: 'Special character', met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
    { text: 'No common patterns', met: !['password', '12345', 'qwerty', 'abc123'].some(pattern => password.toLowerCase().includes(pattern)) }
  ];

  const getLevelText = (level: string) => {
    switch (level) {
      case 'weak': return 'Weak';
      case 'fair': return 'Fair';
      case 'good': return 'Good';
      case 'strong': return 'Strong';
      default: return 'Unknown';
    }
  };

  return (
    <Container className={className}>
      <StrengthLevel level={level}>
        Password Strength: {getLevelText(level)}
      </StrengthLevel>
      
      <StrengthBar>
        <StrengthFill level={level} width={percentage} />
      </StrengthBar>

      <Requirements>
        <RequirementsList>
          {requirements.map((req, index) => (
            <RequirementItem key={index} met={req.met}>
              {req.text}
            </RequirementItem>
          ))}
        </RequirementsList>
      </Requirements>

      {feedback.length > 0 && (
        <FeedbackList>
          {feedback.slice(0, 3).map((item, index) => (
            <FeedbackItem key={index} type="info">
              {item}
            </FeedbackItem>
          ))}
        </FeedbackList>
      )}
    </Container>
  );
};

export default PasswordStrengthIndicator;