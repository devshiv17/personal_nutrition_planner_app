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

const FoodLoggingPage: React.FC = () => {
  return (
    <Container>
      <Title>Food Logging</Title>
      <Card padding="lg">
        <h2>Today's Food Log</h2>
        <p style={{ margin: '1rem 0', color: '#6B7280' }}>
          Track your daily food intake here.
        </p>
        <Button>Add Food</Button>
      </Card>
    </Container>
  );
};

export default FoodLoggingPage;