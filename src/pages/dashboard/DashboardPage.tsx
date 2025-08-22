import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants';

const Container = styled.div`
  width: 100%;
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

const ProgressBar = styled.div<{ percentage: number; color?: string }>`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.xs};

  &::after {
    content: '';
    display: block;
    width: ${({ percentage }) => Math.min(percentage, 100)}%;
    height: 100%;
    background-color: ${({ color, theme }) => color || theme.colors.primary};
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

const StatWithProgress = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RecentActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
`;

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const ActivityContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
`;

const ActivityTime = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.75rem;
`;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const todayStats = {
    calories: { current: 1850, target: 2200, unit: '' },
    protein: { current: 85, target: 120, unit: 'g' },
    carbs: { current: 220, target: 275, unit: 'g' },
    fats: { current: 65, target: 85, unit: 'g' },
  };

  const recentActivities = [
    { icon: '🥗', title: 'Logged Caesar Salad', time: '2 hours ago' },
    { icon: '🏃‍♂️', title: 'Completed 30min run', time: '4 hours ago' },
    { icon: '🥤', title: 'Logged protein shake', time: '6 hours ago' },
    { icon: '📊', title: 'Weight updated: 68.5kg', time: 'Yesterday' },
  ];

  const quickActions = [
    {
      icon: '🎤',
      title: 'Voice Log Food',
      description: 'Quickly log your meals using voice commands',
      route: ROUTES.VOICE_LOGGING,
      color: '#10B981',
    },
    {
      icon: '📅',
      title: 'View Meal Plan',
      description: 'See your personalized weekly meal plan',
      route: ROUTES.MEAL_PLANNING,
      color: '#8B5CF6',
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your weight and nutrition goals',
      route: ROUTES.PROGRESS,
      color: '#F59E0B',
    },
    {
      icon: '🍽️',
      title: 'Log Food',
      description: 'Manually add foods to your daily log',
      route: ROUTES.FOOD_LOGGING,
      color: '#EF4444',
    },
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return (current / target) * 100;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return '#EF4444';
    if (percentage < 80) return '#F59E0B';
    return '#10B981';
  };

  return (
    <Container>
      <Header>
        <Welcome>Welcome back, {user?.firstName || user?.name}! 👋</Welcome>
        <Subtitle>Here's your nutrition overview for today</Subtitle>
      </Header>

      <StatsGrid>
        {Object.entries(todayStats).map(([key, stat]) => {
          const percentage = getProgressPercentage(stat.current, stat.target);
          const progressColor = getProgressColor(percentage);
          
          return (
            <StatCard key={key}>
              <StatWithProgress>
                <div>
                  <StatValue>{stat.current.toLocaleString()}{stat.unit}</StatValue>
                  <StatLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</StatLabel>
                </div>
                <ProgressBar percentage={percentage} color={progressColor} />
                <ProgressInfo>
                  <span>Target: {stat.target}{stat.unit}</span>
                  <span>{Math.round(percentage)}%</span>
                </ProgressInfo>
              </StatWithProgress>
            </StatCard>
          );
        })}
      </StatsGrid>

      <QuickActions>
        {quickActions.map((action) => (
          <ActionCard 
            key={action.title}
            onClick={() => navigate(action.route)}
          >
            <ActionIcon style={{ color: action.color }}>
              {action.icon}
            </ActionIcon>
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
          </ActionCard>
        ))}
      </QuickActions>

      <Card padding="lg">
        <h2 style={{ marginBottom: '1.5rem', color: '#374151' }}>Recent Activity</h2>
        <RecentActivityList>
          {recentActivities.map((activity, index) => (
            <ActivityItem key={index}>
              <ActivityIcon>{activity.icon}</ActivityIcon>
              <ActivityContent>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))}
        </RecentActivityList>
        <div style={{ marginTop: '1.5rem' }}>
          <Button 
            variant="outline" 
            onClick={() => navigate(ROUTES.PROGRESS)}
            fullWidth
          >
            View All Activity
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default DashboardPage;