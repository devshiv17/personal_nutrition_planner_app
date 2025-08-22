import React from 'react';
import styled from 'styled-components';
import { Card } from '../../components/ui/Card';

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

const SettingsPage: React.FC = () => {
  return (
    <Container>
      <Title>Settings</Title>
      <Card padding="lg">
        <h2>App Settings</h2>
        <p style={{ margin: '1rem 0', color: '#6B7280' }}>
          Manage your account settings and preferences here.
        </p>
      </Card>
    </Container>
  );
};

export default SettingsPage;