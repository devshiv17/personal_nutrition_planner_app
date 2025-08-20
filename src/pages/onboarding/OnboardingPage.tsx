import React from 'react';
import styled from 'styled-components';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

const OnboardingCard = styled(Card)`
  max-width: 600px;
  text-align: center;
  padding: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <OnboardingCard>
        <Title>Welcome to NutriPlan! 🎉</Title>
        <Description>
          Let's set up your personalized nutrition plan. We'll ask you a few questions 
          about your goals, dietary preferences, and lifestyle to create the perfect 
          meal plan for you.
        </Description>
        <Button
          size="lg"
          onClick={() => navigate(ROUTES.DASHBOARD)}
        >
          Get Started
        </Button>
      </OnboardingCard>
    </Container>
  );
};

export default OnboardingPage;