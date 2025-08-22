import React, { useState, useMemo } from 'react';
import { Button, Card } from '../../../ui';
import { ProfileWizardData } from '../ProfileWizard';
import { calculateBMR, calculateTDEE } from '../../../../services/healthCalculations';

interface ActivityLevelStepProps {
  data: ProfileWizardData;
  onChange: (data: Partial<ProfileWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ActivityOption {
  value: ProfileWizardData['activityLevel'];
  title: string;
  description: string;
  examples: string[];
  multiplier: number;
}

const ACTIVITY_LEVELS: ActivityOption[] = [
  {
    value: 'sedentary',
    title: 'Sedentary',
    description: 'Little to no exercise, desk job',
    examples: [
      'Office work with minimal movement',
      'Watching TV, reading most of the day',
      'Less than 5,000 steps per day'
    ],
    multiplier: 1.2
  },
  {
    value: 'lightly_active',
    title: 'Lightly Active',
    description: 'Light exercise 1-3 days per week',
    examples: [
      'Light workouts 1-3 times per week',
      '5,000-7,500 steps per day',
      'Occasional walks or light activities'
    ],
    multiplier: 1.375
  },
  {
    value: 'moderately_active',
    title: 'Moderately Active',
    description: 'Moderate exercise 3-5 days per week',
    examples: [
      'Regular workouts 3-5 times per week',
      '7,500-10,000 steps per day',
      'Sports or gym sessions regularly'
    ],
    multiplier: 1.55
  },
  {
    value: 'very_active',
    title: 'Very Active',
    description: 'Heavy exercise 6-7 days per week',
    examples: [
      'Intense workouts 6-7 times per week',
      'More than 10,000 steps per day',
      'Training for competitions or very active job'
    ],
    multiplier: 1.725
  }
];

export default function ActivityLevelStep({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}: ActivityLevelStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleActivitySelect = (activityLevel: ProfileWizardData['activityLevel']) => {
    onChange({ activityLevel });
    if (errors.activityLevel) {
      setErrors(prev => ({ ...prev, activityLevel: '' }));
    }
  };

  const calorieEstimates = useMemo(() => {
    if (data.heightCm && data.currentWeightKg && data.dateOfBirth && data.gender) {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      const personalData = {
        weightKg: data.currentWeightKg,
        heightCm: data.heightCm,
        age,
        gender: data.gender,
        activityLevel: data.activityLevel
      };

      const bmr = calculateBMR(personalData);
      const tdee = calculateTDEE(bmr, data.activityLevel);
      
      return { bmr, tdee };
    }
    return null;
  }, [data.heightCm, data.currentWeightKg, data.dateOfBirth, data.gender, data.activityLevel]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.activityLevel) {
      newErrors.activityLevel = 'Please select your activity level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Activity Level
        </h3>
        <p className="text-gray-600">
          This helps us calculate your daily calorie needs
        </p>
      </div>

      <div className="space-y-4">
        {ACTIVITY_LEVELS.map((option) => (
          <Card
            key={option.value}
            className={`cursor-pointer transition-all ${
              data.activityLevel === option.value
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => handleActivitySelect(option.value)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      checked={data.activityLevel === option.value}
                      onChange={() => handleActivitySelect(option.value)}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <h4 className="font-semibold text-gray-900">
                      {option.title}
                    </h4>
                    <span className="ml-2 text-sm text-gray-500">
                      ({option.multiplier}x BMR)
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    {option.description}
                  </p>
                  
                  <ul className="text-sm text-gray-500 space-y-1">
                    {option.examples.map((example, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {errors.activityLevel && (
          <p className="text-red-500 text-sm">{errors.activityLevel}</p>
        )}
      </div>

      {calorieEstimates && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Your Estimated Daily Calories
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {calorieEstimates.bmr}
                </div>
                <div className="text-sm text-gray-600">
                  BMR (Base Metabolic Rate)
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Calories at rest
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {calorieEstimates.tdee}
                </div>
                <div className="text-sm text-gray-600">
                  TDEE (Total Daily Energy)
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Calories with activity
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              These estimates will be refined based on your goals in the next step
            </div>
          </div>
        </Card>
      )}

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
          Next Step
        </Button>
      </div>
    </div>
  );
}