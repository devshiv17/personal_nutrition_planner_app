import React, { useState } from 'react';
import { Button, Input, Card } from '../../../ui';
import { ProfileWizardData } from '../ProfileWizard';

interface GoalsStepProps {
  data: ProfileWizardData;
  onChange: (data: Partial<ProfileWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface GoalOption {
  value: ProfileWizardData['primaryGoal'];
  title: string;
  description: string;
  icon: string;
}

interface DietaryOption {
  value: ProfileWizardData['dietaryPreference'];
  title: string;
  description: string;
  icon: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    value: 'lose_weight',
    title: 'Lose Weight',
    description: 'Reduce body weight through caloric deficit',
    icon: '📉'
  },
  {
    value: 'gain_weight',
    title: 'Gain Weight',
    description: 'Increase body weight through caloric surplus',
    icon: '📈'
  },
  {
    value: 'maintain_weight',
    title: 'Maintain Weight',
    description: 'Keep current weight and focus on nutrition',
    icon: '⚖️'
  },
  {
    value: 'build_muscle',
    title: 'Build Muscle',
    description: 'Increase muscle mass and strength',
    icon: '💪'
  }
];

const DIETARY_OPTIONS: DietaryOption[] = [
  {
    value: 'balanced',
    title: 'Balanced',
    description: 'Well-rounded nutrition with all food groups',
    icon: '🍽️'
  },
  {
    value: 'keto',
    title: 'Ketogenic',
    description: 'High-fat, low-carb approach',
    icon: '🥑'
  },
  {
    value: 'mediterranean',
    title: 'Mediterranean',
    description: 'Rich in fruits, vegetables, and healthy fats',
    icon: '🫒'
  },
  {
    value: 'vegan',
    title: 'Vegan',
    description: 'Plant-based nutrition only',
    icon: '🌱'
  },
  {
    value: 'diabetic',
    title: 'Diabetic-Friendly',
    description: 'Low-glycemic, blood sugar conscious',
    icon: '🩺'
  }
];

export default function GoalsStep({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}: GoalsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGoalSelect = (primaryGoal: ProfileWizardData['primaryGoal']) => {
    onChange({ primaryGoal });
    if (errors.primaryGoal) {
      setErrors(prev => ({ ...prev, primaryGoal: '' }));
    }
  };

  const handleDietarySelect = (dietaryPreference: ProfileWizardData['dietaryPreference']) => {
    onChange({ dietaryPreference });
    if (errors.dietaryPreference) {
      setErrors(prev => ({ ...prev, dietaryPreference: '' }));
    }
  };

  const handleTimelineChange = (value: string) => {
    const weeks = parseInt(value) || 0;
    onChange({ targetTimelineWeeks: weeks });
    if (errors.targetTimelineWeeks) {
      setErrors(prev => ({ ...prev, targetTimelineWeeks: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.primaryGoal) {
      newErrors.primaryGoal = 'Please select your primary goal';
    }

    if (!data.dietaryPreference) {
      newErrors.dietaryPreference = 'Please select your dietary preference';
    }

    if (!data.targetTimelineWeeks || data.targetTimelineWeeks <= 0) {
      newErrors.targetTimelineWeeks = 'Please enter a valid timeline';
    } else if (data.targetTimelineWeeks > 104) {
      newErrors.targetTimelineWeeks = 'Timeline should be within 2 years (104 weeks)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const getTimelineText = () => {
    if (!data.targetTimelineWeeks) return '';
    
    const weeks = data.targetTimelineWeeks;
    if (weeks < 4) return `${weeks} weeks`;
    if (weeks < 52) return `${Math.round(weeks / 4)} months`;
    return `${Math.round(weeks / 52)} year${weeks >= 104 ? 's' : ''}`;
  };

  return (
    <div className="p-6 space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Goals & Preferences
        </h3>
        <p className="text-gray-600">
          Tell us about your health goals and dietary preferences
        </p>
      </div>

      {/* Primary Goal Selection */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">
          What's your primary goal? <span className="text-red-500">*</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GOAL_OPTIONS.map((option) => (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all ${
                data.primaryGoal === option.value
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleGoalSelect(option.value)}
            >
              <div className="p-4 text-center">
                <div className="text-3xl mb-2">{option.icon}</div>
                <h5 className="font-semibold text-gray-900 mb-1">
                  {option.title}
                </h5>
                <p className="text-sm text-gray-600">
                  {option.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
        
        {errors.primaryGoal && (
          <p className="text-red-500 text-sm mt-2">{errors.primaryGoal}</p>
        )}
      </div>

      {/* Timeline */}
      <div>
        <Input
          label="Target Timeline (weeks)"
          type="number"
          value={data.targetTimelineWeeks || ''}
          onChange={(e) => handleTimelineChange(e.target.value)}
          placeholder="Enter number of weeks"
          error={errors.targetTimelineWeeks}
          required
          min="1"
          max="104"
          step="1"
        />
        {getTimelineText() && (
          <p className="text-sm text-gray-600 mt-1">
            Approximately {getTimelineText()}
          </p>
        )}
      </div>

      {/* Dietary Preference Selection */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">
          Dietary Preference <span className="text-red-500">*</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DIETARY_OPTIONS.map((option) => (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all ${
                data.dietaryPreference === option.value
                  ? 'ring-2 ring-green-500 bg-green-50'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleDietarySelect(option.value)}
            >
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">{option.icon}</div>
                <h5 className="font-semibold text-gray-900 mb-1">
                  {option.title}
                </h5>
                <p className="text-sm text-gray-600">
                  {option.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
        
        {errors.dietaryPreference && (
          <p className="text-red-500 text-sm mt-2">{errors.dietaryPreference}</p>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          className="min-w-[120px]"
        >
          Review & Finish
        </Button>
      </div>
    </div>
  );
}