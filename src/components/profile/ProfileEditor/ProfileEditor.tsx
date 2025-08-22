import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import BMRCalculator from '../BMRCalculator';
import ActivityLevelSelector from '../ActivityLevelSelector';
import GoalSettingInterface from '../GoalSettingInterface';
import DietaryPreferenceSelector from '../DietaryPreferenceSelector';
import ProfilePictureUpload from '../ProfilePictureUpload';
import type { User } from '../../../types';
import type { OptimizedImage } from '../../../utils/imageOptimization';
import type { PersonalData, HealthMetrics } from '../../../services/healthCalculations';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled(Card)`
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.1rem;
  margin: 0;
`;

const Section = styled(Card)`
  margin-bottom: 2rem;
  overflow: visible;
  animation: ${slideIn} 0.6s ease-out;
`;

const SectionHeader = styled.div`
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionIcon = styled.span`
  font-size: 1.75rem;
`;

const SectionDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const SectionContent = styled.div`
  padding: 0 2rem 2rem;
`;

const BasicInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ChangesSummary = styled(Card)<{ visible: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 350px;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(4, 120, 87, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(16, 185, 129, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  color: white;
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(calc(100% + 2rem))'};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 1000;
  animation: ${props => props.visible ? pulse : 'none'} 2s ease-in-out infinite;

  @media (max-width: 768px) {
    position: relative;
    bottom: auto;
    right: auto;
    width: 100%;
    margin-top: 2rem;
    transform: none;
  }
`;

const ChangesTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '📝';
    font-size: 1.25rem;
  }
`;

const ChangesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  
  li {
    padding: 0.25rem 0;
    font-size: 0.875rem;
    line-height: 1.4;
    
    &::before {
      content: '•';
      margin-right: 0.5rem;
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%);
    transform: translateY(-2px);
  }
`;

const CancelButton = styled(Button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

interface ProfileData extends User {
  personalData?: PersonalData;
  healthMetrics?: HealthMetrics;
  goalType?: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle';
  goalTimeline?: number;
  dailyCalories?: number;
  profilePicture?: string;
}

interface ProfileChange {
  field: string;
  label: string;
  oldValue: any;
  newValue: any;
}

interface ProfileEditorProps {
  user: User;
  onSave?: (data: ProfileData) => Promise<void>;
  onCancel?: () => void;
  onImageUpload?: (image: OptimizedImage) => Promise<string>; // Returns URL
  onImageRemove?: () => Promise<void>;
  loading?: boolean;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  user,
  onSave,
  onCancel,
  onImageUpload,
  onImageRemove,
  loading = false
}) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    ...user,
    personalData: {
      weightKg: user.weight || 70,
      heightCm: user.height || 170,
      age: user.age || 25,
      gender: user.gender || 'male',
      activityLevel: user.activityLevel || 'sedentary'
    }
  });

  const [changes, setChanges] = useState<ProfileChange[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const newChanges: ProfileChange[] = [];
    
    // Basic info changes
    if (profileData.firstName !== user.firstName) {
      newChanges.push({
        field: 'firstName',
        label: 'First Name',
        oldValue: user.firstName,
        newValue: profileData.firstName
      });
    }
    
    if (profileData.lastName !== user.lastName) {
      newChanges.push({
        field: 'lastName',
        label: 'Last Name',
        oldValue: user.lastName,
        newValue: profileData.lastName
      });
    }
    
    if (profileData.email !== user.email) {
      newChanges.push({
        field: 'email',
        label: 'Email',
        oldValue: user.email,
        newValue: profileData.email
      });
    }

    // Physical data changes
    if (profileData.personalData?.weightKg !== user.weight) {
      newChanges.push({
        field: 'weight',
        label: 'Weight',
        oldValue: user.weight ? `${user.weight} kg` : 'Not set',
        newValue: `${profileData.personalData?.weightKg} kg`
      });
    }

    if (profileData.personalData?.heightCm !== user.height) {
      newChanges.push({
        field: 'height',
        label: 'Height',
        oldValue: user.height ? `${user.height} cm` : 'Not set',
        newValue: `${profileData.personalData?.heightCm} cm`
      });
    }

    if (profileData.personalData?.age !== user.age) {
      newChanges.push({
        field: 'age',
        label: 'Age',
        oldValue: user.age ? `${user.age} years` : 'Not set',
        newValue: `${profileData.personalData?.age} years`
      });
    }

    if (profileData.personalData?.gender !== user.gender) {
      newChanges.push({
        field: 'gender',
        label: 'Gender',
        oldValue: user.gender || 'Not set',
        newValue: profileData.personalData?.gender
      });
    }

    if (profileData.personalData?.activityLevel !== user.activityLevel) {
      newChanges.push({
        field: 'activityLevel',
        label: 'Activity Level',
        oldValue: user.activityLevel || 'Not set',
        newValue: profileData.personalData?.activityLevel
      });
    }

    if (profileData.dietaryPreference !== user.dietaryPreference) {
      newChanges.push({
        field: 'dietaryPreference',
        label: 'Dietary Preference',
        oldValue: user.dietaryPreference || 'Not set',
        newValue: profileData.dietaryPreference
      });
    }

    setChanges(newChanges);
    setHasChanges(newChanges.length > 0);
  }, [profileData, user]);

  const handleBasicInfoChange = (field: keyof User, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleBMRDataChange = useCallback((data: PersonalData, metrics: HealthMetrics) => {
    setProfileData(prev => ({
      ...prev,
      personalData: data,
      healthMetrics: metrics,
      weight: data.weightKg,
      height: data.heightCm,
      age: data.age,
      gender: data.gender,
      activityLevel: data.activityLevel,
      bmi: metrics.bmi,
      bmr: metrics.bmr,
      tdee: metrics.tdee
    }));
  }, []);

  const handleActivityLevelChange = useCallback((level: PersonalData['activityLevel']) => {
    setProfileData(prev => ({
      ...prev,
      activityLevel: level,
      personalData: prev.personalData ? { ...prev.personalData, activityLevel: level } : undefined
    }));
  }, []);

  const handleGoalChange = useCallback((
    goalType: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle',
    targetWeight: number,
    timeline: number,
    dailyCalories: number
  ) => {
    setProfileData(prev => ({
      ...prev,
      goalType,
      targetWeight,
      targetTimeline: timeline,
      dailyCalories
    }));
  }, []);

  const handleDietaryPreferenceChange = useCallback((preference: User['dietaryPreference']) => {
    setProfileData(prev => ({ ...prev, dietaryPreference: preference }));
  }, []);

  const handleImageUpload = useCallback(async (image: OptimizedImage): Promise<void> => {
    if (onImageUpload) {
      try {
        const imageUrl = await onImageUpload(image);
        setProfileData(prev => ({ ...prev, profilePicture: imageUrl }));
      } catch (error) {
        throw error; // Let the component handle the error
      }
    }
  }, [onImageUpload]);

  const handleImageRemove = useCallback(async (): Promise<void> => {
    if (onImageRemove) {
      try {
        await onImageRemove();
        setProfileData(prev => ({ ...prev, profilePicture: undefined }));
      } catch (error) {
        throw error; // Let the component handle the error
      }
    }
  }, [onImageRemove]);

  const handleSave = async () => {
    if (onSave) {
      await onSave(profileData);
    }
  };

  const handleCancel = () => {
    setProfileData({ ...user });
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Container>
      <Header>
        <Title>Edit Profile</Title>
        <Subtitle>Update your personal information and nutrition preferences</Subtitle>
      </Header>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>📸</SectionIcon>
            Profile Picture
          </SectionTitle>
          <SectionDescription>
            Upload a photo to personalize your profile
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <ProfilePictureUpload
            currentImage={profileData.profilePicture}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            uploading={loading}
          />
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>👤</SectionIcon>
            Basic Information
          </SectionTitle>
          <SectionDescription>
            Your personal details for account management
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <BasicInfoGrid>
            <Input
              label="First Name"
              value={profileData.firstName}
              onChange={(e) => handleBasicInfoChange('firstName', e.target.value)}
              fullWidth
            />
            <Input
              label="Last Name"
              value={profileData.lastName}
              onChange={(e) => handleBasicInfoChange('lastName', e.target.value)}
              fullWidth
            />
            <Input
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => handleBasicInfoChange('email', e.target.value)}
              fullWidth
            />
          </BasicInfoGrid>
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>📊</SectionIcon>
            Body Metrics & BMR
          </SectionTitle>
          <SectionDescription>
            Calculate your metabolic rate based on physical measurements
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <BMRCalculator
            initialData={profileData.personalData}
            onDataChange={handleBMRDataChange}
          />
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>🏃</SectionIcon>
            Activity Level
          </SectionTitle>
          <SectionDescription>
            Select your typical daily activity to calculate TDEE
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <ActivityLevelSelector
            selectedLevel={profileData.activityLevel}
            onLevelChange={handleActivityLevelChange}
          />
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>🎯</SectionIcon>
            Health Goals
          </SectionTitle>
          <SectionDescription>
            Set your nutrition and fitness objectives with timeline
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <GoalSettingInterface
            currentWeight={profileData.personalData?.weightKg || 70}
            tdee={profileData.healthMetrics?.tdee || 2000}
            onGoalChange={handleGoalChange}
          />
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <SectionIcon>🥗</SectionIcon>
            Dietary Preferences
          </SectionTitle>
          <SectionDescription>
            Choose your preferred eating approach for personalized recommendations
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <DietaryPreferenceSelector
            selectedPreference={profileData.dietaryPreference}
            onPreferenceChange={handleDietaryPreferenceChange}
          />
        </SectionContent>
      </Section>

      <ChangesSummary visible={hasChanges}>
        <ChangesTitle>Pending Changes</ChangesTitle>
        <ChangesList>
          {changes.slice(0, 5).map((change, index) => (
            <li key={index}>
              <strong>{change.label}:</strong> {String(change.newValue)}
            </li>
          ))}
          {changes.length > 5 && (
            <li style={{ fontStyle: 'italic', opacity: 0.8 }}>
              ...and {changes.length - 5} more changes
            </li>
          )}
        </ChangesList>
        <ButtonGroup>
          <CancelButton
            size="sm"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </CancelButton>
          <SaveButton
            size="sm"
            onClick={handleSave}
            loading={loading}
          >
            Save Changes
          </SaveButton>
        </ButtonGroup>
      </ChangesSummary>
    </Container>
  );
};

export default ProfileEditor;