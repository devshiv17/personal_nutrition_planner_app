import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Card } from '../../ui/Card';
import type { User } from '../../../types';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const Container = styled(Card)`
  max-width: 1200px;
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

const DietGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DietCard = styled.div<{ selected: boolean }>`
  background: ${props => props.selected 
    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
    : 'rgba(255, 255, 255, 0.8)'
  };
  border: 2px solid ${props => props.selected ? '#667eea' : 'rgba(102, 126, 234, 0.2)'};
  border-radius: 24px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  animation: ${scaleIn} 0.5s ease-out;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 50px rgba(102, 126, 234, 0.25);
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
    height: 6px;
    background: ${props => props.selected 
      ? 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
      : 'transparent'
    };
    background-size: 200% 100%;
    animation: ${props => props.selected ? shimmer : 'none'} 3s ease-in-out infinite;
  }
`;

const DietHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DietIcon = styled.div<{ selected: boolean }>`
  font-size: 3rem;
  filter: ${props => props.selected ? 'none' : 'grayscale(0.3)'};
  transition: all 0.3s ease;
`;

const DietTitleSection = styled.div`
  flex: 1;
`;

const DietTitle = styled.h3<{ selected: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: ${props => props.selected ? '#667eea' : '#374151'};
  transition: all 0.3s ease;
`;

const DietSubtitle = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const DietDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const BenefitsSection = styled.div`
  margin-bottom: 1.5rem;
`;

const BenefitsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '✨';
    font-size: 1rem;
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.875rem;
    padding: 0.25rem 0;
    line-height: 1.5;
    
    &::before {
      content: '✓';
      color: #10b981;
      font-weight: bold;
      margin-right: 0.5rem;
    }
  }
`;

const FoodExamples = styled.div`
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(5px);
  margin-bottom: 1rem;
`;

const FoodTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🍽️';
    font-size: 1rem;
  }
`;

const FoodTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FoodTag = styled.span`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ConsiderationsSection = styled.div`
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 8px;
  padding: 0.75rem;
`;

const ConsiderationsTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '⚠️';
    font-size: 1rem;
  }
`;

const ConsiderationsText = styled.p`
  color: #92400e;
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
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
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🎯';
    font-size: 1.5rem;
  }
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin: 0;
`;

type DietaryPreference = User['dietaryPreference'];

interface DietaryOption {
  key: DietaryPreference;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  benefits: string[];
  foods: string[];
  considerations: string;
}

const dietaryOptions: DietaryOption[] = [
  {
    key: 'mediterranean',
    title: 'Mediterranean Diet',
    subtitle: 'Heart-healthy traditional approach',
    icon: '🫒',
    description: 'Based on traditional eating patterns of Mediterranean countries, emphasizing whole foods, olive oil, fish, and moderate wine consumption.',
    benefits: [
      'Supports heart health',
      'Anti-inflammatory properties',
      'Rich in antioxidants',
      'Sustainable long-term',
      'Supports brain health'
    ],
    foods: ['Olive oil', 'Fish', 'Vegetables', 'Fruits', 'Whole grains', 'Nuts', 'Legumes', 'Herbs'],
    considerations: 'May be higher in calories due to healthy fats. Requires access to fresh, quality ingredients.'
  },
  {
    key: 'keto',
    title: 'Ketogenic Diet',
    subtitle: 'High-fat, low-carb approach',
    icon: '🥑',
    description: 'Very low carbohydrate, high fat diet that puts your body into ketosis, burning fat for fuel instead of carbohydrates.',
    benefits: [
      'Rapid initial weight loss',
      'Appetite suppression',
      'Mental clarity',
      'Stable blood sugar',
      'Increased fat burning'
    ],
    foods: ['Avocados', 'Coconut oil', 'Meat', 'Fish', 'Eggs', 'Cheese', 'Nuts', 'Low-carb vegetables'],
    considerations: 'Requires strict carb monitoring. May cause initial side effects (keto flu). Not suitable for everyone.'
  },
  {
    key: 'vegan',
    title: 'Vegan Diet',
    subtitle: 'Plant-based nutrition',
    icon: '🌱',
    description: 'Completely plant-based diet excluding all animal products, focusing on vegetables, fruits, grains, legumes, nuts, and seeds.',
    benefits: [
      'Environmental sustainability',
      'High in fiber',
      'Rich in antioxidants',
      'Lower chronic disease risk',
      'Ethical considerations'
    ],
    foods: ['Vegetables', 'Fruits', 'Legumes', 'Grains', 'Nuts', 'Seeds', 'Plant milk', 'Tofu'],
    considerations: 'Requires B12 supplementation. Need to combine proteins carefully. May require more meal planning.'
  },
  {
    key: 'diabetic',
    title: 'Diabetic-Friendly',
    subtitle: 'Blood sugar management focus',
    icon: '🩺',
    description: 'Carefully balanced approach focusing on stable blood sugar levels through controlled carbohydrate intake and portion management.',
    benefits: [
      'Stable blood sugar',
      'Weight management',
      'Heart health focus',
      'Reduced complications risk',
      'Sustained energy levels'
    ],
    foods: ['Lean proteins', 'Non-starchy vegetables', 'Whole grains', 'Healthy fats', 'Low-GI fruits'],
    considerations: 'Requires blood sugar monitoring. May need medication adjustments. Consult healthcare provider.'
  }
];

interface DietaryPreferenceSelectorProps {
  selectedPreference?: DietaryPreference;
  onPreferenceChange?: (preference: DietaryPreference) => void;
}

const DietaryPreferenceSelector: React.FC<DietaryPreferenceSelectorProps> = ({
  selectedPreference,
  onPreferenceChange
}) => {
  const [selected, setSelected] = useState<DietaryPreference | undefined>(selectedPreference);

  const handlePreferenceSelect = (preference: DietaryPreference) => {
    setSelected(preference);
    if (onPreferenceChange) {
      onPreferenceChange(preference);
    }
  };

  const selectedOption = dietaryOptions.find(option => option.key === selected);

  return (
    <Container>
      <Title>Dietary Preferences</Title>
      <Subtitle>
        Choose a dietary approach that aligns with your lifestyle, health goals, and personal preferences
      </Subtitle>

      <DietGrid>
        {dietaryOptions.map((option, index) => (
          <DietCard
            key={option.key}
            selected={selected === option.key}
            onClick={() => handlePreferenceSelect(option.key)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <DietHeader>
              <DietIcon selected={selected === option.key}>
                {option.icon}
              </DietIcon>
              <DietTitleSection>
                <DietTitle selected={selected === option.key}>
                  {option.title}
                </DietTitle>
                <DietSubtitle>{option.subtitle}</DietSubtitle>
              </DietTitleSection>
            </DietHeader>
            
            <DietDescription>
              {option.description}
            </DietDescription>
            
            <BenefitsSection>
              <BenefitsTitle>Key Benefits</BenefitsTitle>
              <BenefitsList>
                {option.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </BenefitsList>
            </BenefitsSection>
            
            <FoodExamples>
              <FoodTitle>Typical Foods</FoodTitle>
              <FoodTags>
                {option.foods.map((food, idx) => (
                  <FoodTag key={idx}>{food}</FoodTag>
                ))}
              </FoodTags>
            </FoodExamples>
            
            <ConsiderationsSection>
              <ConsiderationsTitle>Important Considerations</ConsiderationsTitle>
              <ConsiderationsText>{option.considerations}</ConsiderationsText>
            </ConsiderationsSection>
          </DietCard>
        ))}
      </DietGrid>

      {selectedOption && (
        <SelectedInfo>
          <InfoTitle>Selected: {selectedOption.title}</InfoTitle>
          <InfoText>
            You've chosen the {selectedOption.title} approach. This will help us customize your meal recommendations, 
            recipe suggestions, and nutritional guidance to align with your dietary preferences and health goals.
          </InfoText>
        </SelectedInfo>
      )}
    </Container>
  );
};

export default DietaryPreferenceSelector;