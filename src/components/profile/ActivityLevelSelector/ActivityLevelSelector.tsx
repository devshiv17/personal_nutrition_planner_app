import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Card } from '../../ui/Card';
// Activity multiplier is calculated within the component
import type { PersonalData } from '../../../services/healthCalculations';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const Container = styled(Card)`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ActivityCard = styled.div<{ selected: boolean }>`
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
    : 'rgba(255, 255, 255, 0.8)'
  };
  border: 2px solid ${props => props.selected ? '#667eea' : 'rgba(102, 126, 234, 0.2)'};
  border-radius: 20px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  animation: ${scaleIn} 0.5s ease-out;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.25);
    border-color: rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(-4px) scale(1.01);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.selected 
      ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
      : 'transparent'
    };
    transition: all 0.3s ease;
  }
`;

const ActivityIcon = styled.div<{ selected: boolean }>`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  filter: ${props => props.selected ? 'none' : 'grayscale(0.3)'};
  transition: all 0.3s ease;
`;

const ActivityTitle = styled.h3<{ selected: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.75rem;
  color: ${props => props.selected ? '#667eea' : '#374151'};
  transition: all 0.3s ease;
`;

const ActivityDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
`;

const ActivityMultiplier = styled.div<{ selected: boolean }>`
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'rgba(107, 114, 128, 0.1)'
  };
  color: ${props => props.selected ? 'white' : '#6b7280'};
  padding: 0.5rem 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  margin-bottom: 0.75rem;
`;

const ActivityExamples = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.8rem;
    padding: 0.25rem 0;
    text-align: center;
    
    &::before {
      content: '•';
      color: #667eea;
      font-weight: bold;
      margin-right: 0.5rem;
    }
  }
`;

const SelectedInfo = styled.div`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(4, 120, 87, 0.05) 100%);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.4s ease-out;
`;

const InfoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '✨';
    font-size: 1.25rem;
  }
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0;
`;

interface ActivityLevel {
  key: PersonalData['activityLevel'];
  title: string;
  icon: string;
  description: string;
  multiplier: number;
  examples: string[];
}

const activityLevels: ActivityLevel[] = [
  {
    key: 'sedentary',
    title: 'Sedentary',
    icon: '🪑',
    description: 'Little to no exercise, mostly sitting or desk work',
    multiplier: 1.2,
    examples: ['Office work', 'Watching TV', 'Reading', 'Computer work']
  },
  {
    key: 'lightly_active',
    title: 'Lightly Active',
    icon: '🚶',
    description: 'Light exercise 1-3 days per week or regular walking',
    multiplier: 1.375,
    examples: ['Daily walks', 'Light yoga', 'Recreational sports 1-2x/week', 'Gardening']
  },
  {
    key: 'moderately_active',
    title: 'Moderately Active',
    icon: '🏃',
    description: 'Moderate exercise 3-5 days per week',
    multiplier: 1.55,
    examples: ['Regular gym sessions', 'Running 3-4x/week', 'Swimming', 'Cycling']
  },
  {
    key: 'very_active',
    title: 'Very Active',
    icon: '💪',
    description: 'Hard exercise 6-7 days per week or physical job',
    multiplier: 1.725,
    examples: ['Daily intense workouts', 'Athletic training', 'Manual labor', 'Competitive sports']
  }
];

interface ActivityLevelSelectorProps {
  selectedLevel?: PersonalData['activityLevel'];
  onLevelChange?: (level: PersonalData['activityLevel']) => void;
  showMultiplier?: boolean;
}

const ActivityLevelSelector: React.FC<ActivityLevelSelectorProps> = ({
  selectedLevel = 'sedentary',
  onLevelChange,
  showMultiplier = true
}) => {
  const [selected, setSelected] = useState<PersonalData['activityLevel']>(selectedLevel);

  const handleLevelSelect = (level: PersonalData['activityLevel']) => {
    setSelected(level);
    if (onLevelChange) {
      onLevelChange(level);
    }
  };

  const selectedActivity = activityLevels.find(level => level.key === selected);

  return (
    <Container>
      <Title>Activity Level</Title>
      <Subtitle>
        Select your typical daily activity level to calculate your Total Daily Energy Expenditure (TDEE)
      </Subtitle>

      <ActivityGrid>
        {activityLevels.map((level, index) => (
          <ActivityCard
            key={level.key}
            selected={selected === level.key}
            onClick={() => handleLevelSelect(level.key)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ActivityIcon selected={selected === level.key}>
              {level.icon}
            </ActivityIcon>
            
            <ActivityTitle selected={selected === level.key}>
              {level.title}
            </ActivityTitle>
            
            <ActivityDescription>
              {level.description}
            </ActivityDescription>
            
            {showMultiplier && (
              <ActivityMultiplier selected={selected === level.key}>
                Multiplier: {level.multiplier}x
              </ActivityMultiplier>
            )}
            
            <ActivityExamples>
              {level.examples.map((example, idx) => (
                <li key={idx}>{example}</li>
              ))}
            </ActivityExamples>
          </ActivityCard>
        ))}
      </ActivityGrid>

      {selectedActivity && (
        <SelectedInfo>
          <InfoTitle>Selected: {selectedActivity.title}</InfoTitle>
          <InfoText>
            Your BMR will be multiplied by {selectedActivity.multiplier} to calculate your TDEE. 
            This accounts for the calories you burn through daily activities and exercise beyond your basic metabolic needs.
          </InfoText>
        </SelectedInfo>
      )}
    </Container>
  );
};

export default ActivityLevelSelector;