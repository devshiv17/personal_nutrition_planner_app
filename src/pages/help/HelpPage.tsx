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

const HelpPage: React.FC = () => {
  return (
    <Container>
      <Title>Help Center</Title>
      <Card padding="lg">
        <h2>Frequently Asked Questions</h2>
        <p style={{ margin: '1rem 0', color: '#6B7280' }}>
          Find answers to common questions and get support.
        </p>
      </Card>
    </Container>
  );
};

export default HelpPage;