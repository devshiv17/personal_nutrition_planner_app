import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';

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

const Container = styled(Card)`
  max-width: 1000px;
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

const GoalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const GoalCard = styled.div<{ selected: boolean }>`
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
  animation: ${slideIn} 0.5s ease-out;

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.25);
    border-color: rgba(102, 126, 234, 0.4);
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

const GoalIcon = styled.div<{ selected: boolean }>`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  filter: ${props => props.selected ? 'none' : 'grayscale(0.3)'};
  transition: all 0.3s ease;
`;

const GoalTitle = styled.h3<{ selected: boolean }>`
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  color: ${props => props.selected ? '#667eea' : '#374151'};
  transition: all 0.3s ease;
`;

const GoalDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 1.5;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`;

const GoalCalories = styled.div<{ selected: boolean }>`
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'rgba(107, 114, 128, 0.1)'
  };
  color: ${props => props.selected ? 'white' : '#6b7280'};
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 0.75rem;
  transition: all 0.3s ease;
`;

const TimelineSection = styled.div`
  margin-top: 2rem;
  animation: ${fadeIn} 0.8s ease-out 0.3s both;
`;

const TimelineTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  text-align: center;
`;

const TimelineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  align-items: start;
`;

const WeightInputSection = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
`;

const InputLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TimelineSlider = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
`;

const SliderContainer = styled.div`
  margin: 1rem 0;
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #667eea 0%, #764ba2 100%);
  outline: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TimelineValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0.5rem 0;
`;

const ProgressPreview = styled.div`
  margin-top: 2rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(4, 120, 87, 0.05) 100%);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const PreviewTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🎯';
    font-size: 1.5rem;
  }
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const PreviewItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(5px);
`;

const PreviewValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.25rem;
`;

const PreviewLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

type GoalType = 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle';

interface Goal {
  key: GoalType;
  title: string;
  icon: string;
  description: string;
  calorieAdjustment: number;
}

const goals: Goal[] = [
  {
    key: 'lose_weight',
    title: 'Lose Weight',
    icon: '📉',
    description: 'Create a caloric deficit to lose body fat',
    calorieAdjustment: -0.2 // 20% deficit
  },
  {
    key: 'maintain_weight',
    title: 'Maintain Weight',
    icon: '⚖️',
    description: 'Maintain current weight and focus on body composition',
    calorieAdjustment: 0
  },
  {
    key: 'gain_weight',
    title: 'Gain Weight',
    icon: '📈',
    description: 'Create a caloric surplus to gain healthy weight',
    calorieAdjustment: 0.15 // 15% surplus
  },
  {
    key: 'build_muscle',
    title: 'Build Muscle',
    icon: '💪',
    description: 'Optimize for muscle growth with proper nutrition',
    calorieAdjustment: 0.1 // 10% surplus
  }
];

interface GoalSettingInterfaceProps {
  currentWeight?: number;
  tdee?: number;
  onGoalChange?: (goal: GoalType, targetWeight: number, timeline: number, dailyCalories: number) => void;
}

const GoalSettingInterface: React.FC<GoalSettingInterfaceProps> = ({
  currentWeight = 70,
  tdee = 2000,
  onGoalChange
}) => {
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('maintain_weight');
  const [targetWeight, setTargetWeight] = useState(currentWeight);
  const [timeline, setTimeline] = useState(12); // weeks

  const selectedGoalData = goals.find(goal => goal.key === selectedGoal);
  const dailyCalories = Math.round(tdee * (1 + (selectedGoalData?.calorieAdjustment || 0)));
  const weightDifference = Math.abs(targetWeight - currentWeight);
  const weeklyWeightChange = timeline > 0 ? weightDifference / timeline : 0;

  useEffect(() => {
    if (onGoalChange) {
      onGoalChange(selectedGoal, targetWeight, timeline, dailyCalories);
    }
  }, [selectedGoal, targetWeight, timeline, dailyCalories, onGoalChange]);

  const handleGoalSelect = (goal: GoalType) => {
    setSelectedGoal(goal);
    // Adjust target weight based on goal
    if (goal === 'lose_weight' && targetWeight >= currentWeight) {
      setTargetWeight(Math.max(currentWeight - 5, 40));
    } else if ((goal === 'gain_weight' || goal === 'build_muscle') && targetWeight <= currentWeight) {
      setTargetWeight(currentWeight + 5);
    }
  };

  const getTargetDate = () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (timeline * 7));
    return targetDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isHealthyRate = () => {
    const maxHealthyLossPerWeek = 1; // kg
    const maxHealthyGainPerWeek = 0.5; // kg
    
    if (selectedGoal === 'lose_weight') {
      return weeklyWeightChange <= maxHealthyLossPerWeek;
    } else if (selectedGoal === 'gain_weight' || selectedGoal === 'build_muscle') {
      return weeklyWeightChange <= maxHealthyGainPerWeek;
    }
    return true;
  };

  return (
    <Container>
      <Title>Set Your Nutrition Goal</Title>
      <Subtitle>
        Choose your primary goal and timeline to create a personalized nutrition plan
      </Subtitle>

      <GoalGrid>
        {goals.map((goal, index) => (
          <GoalCard
            key={goal.key}
            selected={selectedGoal === goal.key}
            onClick={() => handleGoalSelect(goal.key)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <GoalIcon selected={selectedGoal === goal.key}>
              {goal.icon}
            </GoalIcon>
            
            <GoalTitle selected={selectedGoal === goal.key}>
              {goal.title}
            </GoalTitle>
            
            <GoalDescription>
              {goal.description}
            </GoalDescription>
            
            <GoalCalories selected={selectedGoal === goal.key}>
              {goal.calorieAdjustment > 0 ? '+' : ''}{Math.round(goal.calorieAdjustment * 100)}% calories
            </GoalCalories>
          </GoalCard>
        ))}
      </GoalGrid>

      <TimelineSection>
        <TimelineTitle>Customize Your Plan</TimelineTitle>
        
        <TimelineGrid>
          <WeightInputSection>
            <InputLabel>Target Weight (kg)</InputLabel>
            <Input
              type="number"
              min="30"
              max="200"
              step="0.1"
              value={targetWeight}
              onChange={(e) => setTargetWeight(parseFloat(e.target.value) || currentWeight)}
              fullWidth
            />
            <div style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.875rem', 
              color: '#6b7280',
              textAlign: 'center'
            }}>
              Current: {currentWeight} kg
            </div>
          </WeightInputSection>

          <TimelineSlider>
            <InputLabel>Timeline</InputLabel>
            <TimelineValue>{timeline} weeks</TimelineValue>
            <SliderContainer>
              <Slider
                type="range"
                min="4"
                max="52"
                value={timeline}
                onChange={(e) => setTimeline(parseInt(e.target.value))}
              />
              <SliderLabel>
                <span>4 weeks</span>
                <span>52 weeks</span>
              </SliderLabel>
            </SliderContainer>
          </TimelineSlider>
        </TimelineGrid>
      </TimelineSection>

      {weightDifference > 0 && (
        <ProgressPreview>
          <PreviewTitle>Your Plan Preview</PreviewTitle>
          <PreviewGrid>
            <PreviewItem>
              <PreviewValue>{dailyCalories}</PreviewValue>
              <PreviewLabel>Daily Calories</PreviewLabel>
            </PreviewItem>
            
            <PreviewItem>
              <PreviewValue style={{ color: isHealthyRate() ? '#10b981' : '#f59e0b' }}>
                {weeklyWeightChange.toFixed(1)} kg/week
              </PreviewValue>
              <PreviewLabel>
                {selectedGoal === 'lose_weight' ? 'Weight Loss Rate' : 'Weight Gain Rate'}
              </PreviewLabel>
            </PreviewItem>
            
            <PreviewItem>
              <PreviewValue>{getTargetDate()}</PreviewValue>
              <PreviewLabel>Target Date</PreviewLabel>
            </PreviewItem>
            
            <PreviewItem>
              <PreviewValue>{Math.abs(targetWeight - currentWeight).toFixed(1)} kg</PreviewValue>
              <PreviewLabel>Total Change</PreviewLabel>
            </PreviewItem>
          </PreviewGrid>
          
          {!isHealthyRate() && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              background: 'rgba(245, 158, 11, 0.1)', 
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              color: '#92400e',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              ⚠️ Consider extending your timeline for a healthier rate of change
            </div>
          )}
        </ProgressPreview>
      )}
    </Container>
  );
};

export default GoalSettingInterface;