import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  BMRCalculator, 
  ActivityLevelSelector, 
  GoalSettingInterface, 
  DietaryPreferenceSelector,
  ProfilePictureUpload 
} from '../../components/profile';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { PersonalData, HealthMetrics } from '../../services/healthCalculations';
import type { User } from '../../types';
import type { OptimizedImage } from '../../utils/imageOptimization';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 3rem;
`;

const DemoSection = styled(Card)`
  margin-bottom: 3rem;
  overflow: visible;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #374151;
  padding: 1.5rem 2rem 0;
`;

const SectionContent = styled.div`
  padding: 0 2rem 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
`;

const ProfileDemoPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>('bmr');
  interface ProfileDemoData {
    personalData?: PersonalData;
    healthMetrics?: HealthMetrics;
    activityLevel?: PersonalData['activityLevel'];
    goalType?: string;
    targetWeight?: number;
    timeline?: number;
    dailyCalories?: number;
    dietaryPreference?: User['dietaryPreference'];
    profilePicture?: string;
  }
  
  const [profileData, setProfileData] = useState<ProfileDemoData>({});

  const handleBMRChange = (data: PersonalData, metrics: HealthMetrics) => {
    setProfileData(prev => ({ ...prev, personalData: data, healthMetrics: metrics }));
  };

  const handleActivityChange = (level: PersonalData['activityLevel']) => {
    setProfileData(prev => ({ ...prev, activityLevel: level }));
  };

  const handleGoalChange = (goalType: string, targetWeight: number, timeline: number, dailyCalories: number) => {
    setProfileData(prev => ({ 
      ...prev, 
      goalType, 
      targetWeight, 
      timeline, 
      dailyCalories 
    }));
  };

  const handleDietaryChange = (preference: User['dietaryPreference']) => {
    setProfileData(prev => ({ ...prev, dietaryPreference: preference }));
  };

  const handleImageUpload = async (image: OptimizedImage): Promise<void> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProfileData(prev => ({ ...prev, profilePicture: image.dataUrl }));
  };

  const handleImageRemove = async (): Promise<void> => {
    setProfileData(prev => ({ ...prev, profilePicture: undefined }));
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'bmr':
        return (
          <DemoSection>
            <SectionTitle>BMR Calculator Demo</SectionTitle>
            <SectionContent>
              <BMRCalculator onDataChange={handleBMRChange} />
            </SectionContent>
          </DemoSection>
        );
      
      case 'activity':
        return (
          <DemoSection>
            <SectionTitle>Activity Level Selector Demo</SectionTitle>
            <SectionContent>
              <ActivityLevelSelector onLevelChange={handleActivityChange} />
            </SectionContent>
          </DemoSection>
        );
      
      case 'goals':
        return (
          <DemoSection>
            <SectionTitle>Goal Setting Interface Demo</SectionTitle>
            <SectionContent>
              <GoalSettingInterface 
                currentWeight={profileData.personalData?.weightKg || 70}
                tdee={profileData.healthMetrics?.tdee || 2000}
                onGoalChange={handleGoalChange} 
              />
            </SectionContent>
          </DemoSection>
        );
      
      case 'dietary':
        return (
          <DemoSection>
            <SectionTitle>Dietary Preference Selector Demo</SectionTitle>
            <SectionContent>
              <DietaryPreferenceSelector onPreferenceChange={handleDietaryChange} />
            </SectionContent>
          </DemoSection>
        );
      
      case 'profile-pic':
        return (
          <DemoSection>
            <SectionTitle>Profile Picture Upload Demo</SectionTitle>
            <SectionContent>
              <ProfilePictureUpload
                currentImage={profileData.profilePicture}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
              />
            </SectionContent>
          </DemoSection>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container>
      <Title>Profile Components Demo</Title>
      
      <ButtonGroup>
        <Button 
          variant={currentSection === 'bmr' ? 'primary' : 'outline'}
          onClick={() => setCurrentSection('bmr')}
        >
          BMR Calculator
        </Button>
        <Button 
          variant={currentSection === 'activity' ? 'primary' : 'outline'}
          onClick={() => setCurrentSection('activity')}
        >
          Activity Level
        </Button>
        <Button 
          variant={currentSection === 'goals' ? 'primary' : 'outline'}
          onClick={() => setCurrentSection('goals')}
        >
          Goal Setting
        </Button>
        <Button 
          variant={currentSection === 'dietary' ? 'primary' : 'outline'}
          onClick={() => setCurrentSection('dietary')}
        >
          Dietary Preferences
        </Button>
        <Button 
          variant={currentSection === 'profile-pic' ? 'primary' : 'outline'}
          onClick={() => setCurrentSection('profile-pic')}
        >
          Profile Picture
        </Button>
      </ButtonGroup>

      {renderCurrentSection()}

      {Object.keys(profileData).length > 0 && (
        <DemoSection>
          <SectionTitle>Current Profile Data</SectionTitle>
          <SectionContent>
            <pre style={{ 
              background: '#f3f4f6', 
              padding: '1rem', 
              borderRadius: '8px', 
              overflow: 'auto',
              fontSize: '0.875rem'
            }}>
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </SectionContent>
        </DemoSection>
      )}
    </Container>
  );
};

export default ProfileDemoPage;