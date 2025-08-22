import React, { useMemo } from 'react';
import { Button, Card } from '../../../ui';
import { ProfileWizardData } from '../ProfileWizard';
import { calculateHealthMetrics, getCalorieGoal } from '../../../../services/healthCalculations';

interface ReviewStepProps {
  data: ProfileWizardData;
  onChange: (data: Partial<ProfileWizardData>) => void;
  onComplete: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function ReviewStep({ 
  data, 
  onChange, 
  onComplete, 
  onBack, 
  isLoading 
}: ReviewStepProps) {
  const healthMetrics = useMemo(() => {
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

      const metrics = calculateHealthMetrics(personalData);
      const calorieGoal = getCalorieGoal(metrics.tdee, data.primaryGoal);
      
      return { ...metrics, calorieGoal, age };
    }
    return null;
  }, [data]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatGoal = (goal: string) => {
    return goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatActivity = (activity: string) => {
    return activity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDietary = (dietary: string) => {
    return dietary.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getBMIColor = (category: string) => {
    switch (category) {
      case 'underweight': return 'text-blue-600 bg-blue-50';
      case 'normal': return 'text-green-600 bg-green-50';
      case 'overweight': return 'text-yellow-600 bg-yellow-50';
      case 'obese': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Review Your Profile
        </h3>
        <p className="text-gray-600">
          Please review your information before completing setup
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{data.firstName} {data.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date of Birth:</span>
              <span className="font-medium">{formatDate(data.dateOfBirth)}</span>
            </div>
            {healthMetrics && (
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{healthMetrics.age} years</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium">{formatActivity(data.gender)}</span>
            </div>
          </div>
        </Card>

        {/* Physical Metrics */}
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Physical Metrics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Height:</span>
              <span className="font-medium">{data.heightCm} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Weight:</span>
              <span className="font-medium">{data.currentWeightKg} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Target Weight:</span>
              <span className="font-medium">{data.targetWeightKg} kg</span>
            </div>
            {healthMetrics && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">BMI:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBMIColor(healthMetrics.bmiCategory)}`}>
                  {healthMetrics.bmi} ({formatActivity(healthMetrics.bmiCategory)})
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Activity & Goals */}
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Activity & Goals</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Activity Level:</span>
              <span className="font-medium">{formatActivity(data.activityLevel)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Primary Goal:</span>
              <span className="font-medium">{formatGoal(data.primaryGoal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timeline:</span>
              <span className="font-medium">{data.targetTimelineWeeks} weeks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dietary Preference:</span>
              <span className="font-medium">{formatDietary(data.dietaryPreference)}</span>
            </div>
          </div>
        </Card>

        {/* Calculated Metrics */}
        {healthMetrics && (
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h4 className="font-semibold text-gray-900 mb-3">Your Calculated Metrics</h4>
            <div className="space-y-3">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {healthMetrics.bmr}
                </div>
                <div className="text-xs text-gray-600">BMR (calories/day at rest)</div>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {healthMetrics.tdee}
                </div>
                <div className="text-xs text-gray-600">TDEE (total daily calories)</div>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {healthMetrics.calorieGoal}
                </div>
                <div className="text-xs text-gray-600">Goal calories/day</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Important Note
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                These calculations are estimates based on standard formulas. Individual results may vary. 
                Consult with a healthcare professional before making significant dietary changes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
        
        <Button
          onClick={onComplete}
          disabled={isLoading}
          className="min-w-[140px]"
        >
          {isLoading ? 'Setting up...' : 'Complete Setup'}
        </Button>
      </div>
    </div>
  );
}