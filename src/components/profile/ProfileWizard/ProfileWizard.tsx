import React, { useState, useCallback } from 'react';
import { User } from '../../../types';
import { Button, Card } from '../../ui';
import PersonalInfoStep from './steps/PersonalInfoStep';
import PhysicalMetricsStep from './steps/PhysicalMetricsStep';
import ActivityLevelStep from './steps/ActivityLevelStep';
import GoalsStep from './steps/GoalsStep';
import ReviewStep from './steps/ReviewStep';

export interface ProfileWizardData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  primaryGoal: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle';
  targetTimelineWeeks: number;
  dietaryPreference: 'keto' | 'mediterranean' | 'vegan' | 'diabetic' | 'balanced';
}

interface ProfileWizardProps {
  user?: User;
  onComplete: (data: ProfileWizardData) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

const STEPS = [
  { id: 'personal', title: 'Personal Information', description: 'Basic details about you' },
  { id: 'physical', title: 'Physical Metrics', description: 'Height, weight, and measurements' },
  { id: 'activity', title: 'Activity Level', description: 'Your daily activity and exercise' },
  { id: 'goals', title: 'Goals & Preferences', description: 'What you want to achieve' },
  { id: 'review', title: 'Review & Confirm', description: 'Confirm your information' },
];

export default function ProfileWizard({ 
  user, 
  onComplete, 
  onCancel, 
  className = '' 
}: ProfileWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileWizardData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dateOfBirth: '',
    gender: user?.gender || 'other',
    heightCm: user?.height || 0,
    currentWeightKg: user?.weight || 0,
    targetWeightKg: user?.targetWeight || 0,
    activityLevel: user?.activityLevel || 'sedentary',
    primaryGoal: 'maintain_weight',
    targetTimelineWeeks: user?.targetTimeline || 12,
    dietaryPreference: user?.dietaryPreference || 'balanced',
  });

  const updateFormData = useCallback((data: Partial<ProfileWizardData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      await onComplete(formData);
    } catch (error) {
      console.error('Error completing profile setup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'personal':
        return (
          <PersonalInfoStep
            data={formData}
            onChange={updateFormData}
            onNext={handleNext}
          />
        );
      case 'physical':
        return (
          <PhysicalMetricsStep
            data={formData}
            onChange={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'activity':
        return (
          <ActivityLevelStep
            data={formData}
            onChange={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'goals':
        return (
          <GoalsStep
            data={formData}
            onChange={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'review':
        return (
          <ReviewStep
            data={formData}
            onChange={updateFormData}
            onComplete={handleComplete}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 ${className}`}>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < STEPS.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {STEPS[currentStep].title}
          </h2>
          <p className="text-gray-600">
            {STEPS[currentStep].description}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        {renderStep()}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        
        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {STEPS.length}
        </div>
      </div>
    </div>
  );
}