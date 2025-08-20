import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Welcome = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.125rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: 2rem;
`;

const ActionCard = styled(Card)`
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ActionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ActionDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Container>
      <Header>
        <Welcome>Welcome back, {user?.name}! 👋</Welcome>
        <Subtitle>Here's your nutrition overview for today</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>1,850</StatValue>
          <StatLabel>Calories Today</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>85g</StatValue>
          <StatLabel>Protein</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>220g</StatValue>
          <StatLabel>Carbs</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>65g</StatValue>
          <StatLabel>Fats</StatLabel>
        </StatCard>
      </StatsGrid>

      <QuickActions>
        <ActionCard>
          <ActionIcon>🎤</ActionIcon>
          <ActionTitle>Voice Log Food</ActionTitle>
          <ActionDescription>
            Quickly log your meals using voice commands
          </ActionDescription>
        </ActionCard>
        
        <ActionCard>
          <ActionIcon>📅</ActionIcon>
          <ActionTitle>View Meal Plan</ActionTitle>
          <ActionDescription>
            See your personalized weekly meal plan
          </ActionDescription>
        </ActionCard>
        
        <ActionCard>
          <ActionIcon>📊</ActionIcon>
          <ActionTitle>Track Progress</ActionTitle>
          <ActionDescription>
            Monitor your weight and nutrition goals
          </ActionDescription>
        </ActionCard>
        
        <ActionCard>
          <ActionIcon>🛒</ActionIcon>
          <ActionTitle>Grocery List</ActionTitle>
          <ActionDescription>
            View your automatically generated shopping list
          </ActionDescription>
        </ActionCard>
      </QuickActions>

      <Card padding="lg">
        <h2 style={{ marginBottom: '1rem' }}>Recent Activity</h2>
        <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
          Your recent meal logs and activities will appear here.
        </p>
        <Button variant="outline">View All Activity</Button>
      </Card>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
      </div>
    </Container>
  );
};

export default DashboardPage;