import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { calculateBMR, calculateTDEE, calculateBMI, getBMICategory, getBMIDescription } from '../../../services/healthCalculations';
import type { PersonalData, HealthMetrics } from '../../../services/healthCalculations';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const Container = styled(Card)`
  max-width: 800px;
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
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const GenderSelector = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const GenderOption = styled.button<{ selected: boolean }>`
  flex: 1;
  min-width: 80px;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.selected ? '#667eea' : 'rgba(102, 126, 234, 0.2)'};
  background: ${props => props.selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.selected ? 'white' : '#374151'};
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ResultsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ResultCard = styled.div<{ highlight?: boolean }>`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${props => props.highlight ? pulse : 'none'} 2s ease-in-out infinite;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const ResultValue = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const ResultLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ResultDescription = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.5rem;
  line-height: 1.4;
`;

const BMIStatus = styled.div<{ category: string }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
  background: ${props => {
    switch (props.category) {
      case 'underweight': return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
      case 'normal': return 'linear-gradient(135deg, #10b981 0%, #047857 100%)';
      case 'overweight': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'obese': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
  }};
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(4, 120, 87, 0.05) 100%);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 16px;
  backdrop-filter: blur(10px);
`;

const InfoTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '💡';
    font-size: 1.5rem;
  }
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    padding: 0.5rem 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.6;
    
    &::before {
      content: '✓';
      color: #10b981;
      font-weight: bold;
      margin-right: 0.5rem;
    }
  }
`;

interface BMRCalculatorProps {
  initialData?: Partial<PersonalData>;
  onDataChange?: (data: PersonalData, metrics: HealthMetrics) => void;
}

const BMRCalculator: React.FC<BMRCalculatorProps> = ({ initialData, onDataChange }) => {
  const [formData, setFormData] = useState<PersonalData>({
    weightKg: initialData?.weightKg || 0,
    heightCm: initialData?.heightCm || 0,
    age: initialData?.age || 0,
    gender: initialData?.gender || 'male',
    activityLevel: initialData?.activityLevel || 'sedentary'
  });

  const [metrics, setMetrics] = useState<HealthMetrics>({
    bmi: 0,
    bmiCategory: 'normal',
    bmr: 0,
    tdee: 0
  });

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const { weightKg, heightCm, age } = formData;
    
    if (weightKg > 0 && heightCm > 0 && age > 0) {
      const bmi = calculateBMI(weightKg, heightCm);
      const bmiCategory = getBMICategory(bmi);
      const bmr = calculateBMR(formData);
      const tdee = calculateTDEE(bmr, formData.activityLevel);

      const newMetrics = { bmi, bmiCategory, bmr, tdee };
      setMetrics(newMetrics);
      setIsComplete(true);

      if (onDataChange) {
        onDataChange(formData, newMetrics);
      }
    } else {
      setIsComplete(false);
    }
  }, [formData, onDataChange]);

  const handleInputChange = (field: keyof PersonalData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const handleGenderChange = (gender: PersonalData['gender']) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  return (
    <Container>
      <Title>BMR & TDEE Calculator</Title>
      <Subtitle>Calculate your Basal Metabolic Rate using the Mifflin-St Jeor equation</Subtitle>

      <FormGrid>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Weight (kg)
          </label>
          <Input
            type="number"
            placeholder="Enter weight in kg"
            value={formData.weightKg || ''}
            onChange={(e) => handleInputChange('weightKg', e.target.value)}
            fullWidth
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Height (cm)
          </label>
          <Input
            type="number"
            placeholder="Enter height in cm"
            value={formData.heightCm || ''}
            onChange={(e) => handleInputChange('heightCm', e.target.value)}
            fullWidth
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Age (years)
          </label>
          <Input
            type="number"
            placeholder="Enter age"
            value={formData.age || ''}
            onChange={(e) => handleInputChange('age', e.target.value)}
            fullWidth
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Gender
          </label>
          <GenderSelector>
            <GenderOption
              selected={formData.gender === 'male'}
              onClick={() => handleGenderChange('male')}
              type="button"
            >
              Male
            </GenderOption>
            <GenderOption
              selected={formData.gender === 'female'}
              onClick={() => handleGenderChange('female')}
              type="button"
            >
              Female
            </GenderOption>
            <GenderOption
              selected={formData.gender === 'other'}
              onClick={() => handleGenderChange('other')}
              type="button"
            >
              Other
            </GenderOption>
          </GenderSelector>
        </div>
      </FormGrid>

      {isComplete && (
        <ResultsSection>
          <ResultCard>
            <ResultValue>{metrics.bmi}</ResultValue>
            <ResultLabel>BMI</ResultLabel>
            <BMIStatus category={metrics.bmiCategory}>
              {metrics.bmiCategory.replace('_', ' ')}
            </BMIStatus>
            <ResultDescription>
              {getBMIDescription(metrics.bmiCategory)}
            </ResultDescription>
          </ResultCard>

          <ResultCard highlight>
            <ResultValue>{metrics.bmr}</ResultValue>
            <ResultLabel>BMR</ResultLabel>
            <ResultDescription>
              Calories your body burns at rest per day
            </ResultDescription>
          </ResultCard>

          <ResultCard>
            <ResultValue>{metrics.tdee}</ResultValue>
            <ResultLabel>TDEE</ResultLabel>
            <ResultDescription>
              Total daily energy expenditure including activity
            </ResultDescription>
          </ResultCard>
        </ResultsSection>
      )}

      <InfoSection>
        <InfoTitle>Understanding Your Results</InfoTitle>
        <InfoList>
          <li><strong>BMR (Basal Metabolic Rate)</strong>: The number of calories your body needs to maintain basic physiological functions at rest</li>
          <li><strong>TDEE (Total Daily Energy Expenditure)</strong>: Your BMR plus calories burned through physical activity</li>
          <li><strong>BMI (Body Mass Index)</strong>: A measure of body fat based on height and weight</li>
          <li>These calculations use the scientifically validated Mifflin-St Jeor equation</li>
          <li>Results are estimates and individual metabolism may vary</li>
        </InfoList>
      </InfoSection>
    </Container>
  );
};

export default BMRCalculator;