import React from 'react';
import styled from 'styled-components';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2rem;
`;

const VoiceLoggingPage: React.FC = () => {
  return (
    <Container>
      <Title>Voice Logging</Title>
      <Card padding="lg">
        <h2>Voice Food Logger</h2>
        <p style={{ margin: '1rem 0', color: '#6B7280' }}>
          Log your meals using voice commands.
        </p>
        <Button>🎤 Start Voice Recording</Button>
      </Card>
    </Container>
  );
};

export default VoiceLoggingPage;