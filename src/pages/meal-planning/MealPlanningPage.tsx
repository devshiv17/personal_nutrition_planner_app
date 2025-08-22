import React from 'react';
import styled from 'styled-components';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

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

const MealPlanningPage: React.FC = () => {
  return (
    <Container>
      <Title>Meal Planning</Title>
      <Card padding="lg">
        <h2>Your Weekly Meal Plan</h2>
        <p style={{ margin: '1rem 0', color: '#6B7280' }}>
          Generate and manage your personalized meal plans here.
        </p>
        <Button>Generate New Meal Plan</Button>
      </Card>
    </Container>
  );
};

export default MealPlanningPage;