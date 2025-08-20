import React from 'react';
import styled from 'styled-components';
import Card from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

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

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Title>Profile</Title>
      <Card padding="lg">
        <h2>Profile Information</h2>
        <div style={{ margin: '1rem 0' }}>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Dietary Preference:</strong> {user?.dietaryPreference}</p>
        </div>
      </Card>
    </Container>
  );
};

export default ProfilePage;