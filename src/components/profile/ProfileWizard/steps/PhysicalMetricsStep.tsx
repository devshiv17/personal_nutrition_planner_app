import React, { useState, useMemo } from 'react';
import { Button, Input, Card } from '../../../ui';
import { ProfileWizardData } from '../ProfileWizard';
import { calculateBMI, getBMICategory, getBMIColor, getBMIDescription } from '../../../../services/healthCalculations';

interface PhysicalMetricsStepProps {
  data: ProfileWizardData;
  onChange: (data: Partial<ProfileWizardData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PhysicalMetricsStep({ 
  data, 
  onChange, 
  onNext, 
  onBack 
}: PhysicalMetricsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ProfileWizardData, value: string | number) => {
    onChange({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const bmiData = useMemo(() => {
    if (data.heightCm && data.currentWeightKg) {
      const bmi = calculateBMI(data.currentWeightKg, data.heightCm);
      const category = getBMICategory(bmi);
      const color = getBMIColor(category);
      const description = getBMIDescription(category);
      
      return { bmi, category, color, description };
    }
    return null;
  }, [data.heightCm, data.currentWeightKg]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.heightCm || data.heightCm <= 0) {
      newErrors.heightCm = 'Height is required';
    } else if (data.heightCm < 100 || data.heightCm > 250) {
      newErrors.heightCm = 'Please enter a valid height (100-250 cm)';
    }

    if (!data.currentWeightKg || data.currentWeightKg <= 0) {
      newErrors.currentWeightKg = 'Current weight is required';
    } else if (data.currentWeightKg < 30 || data.currentWeightKg > 300) {
      newErrors.currentWeightKg = 'Please enter a valid weight (30-300 kg)';
    }

    if (!data.targetWeightKg || data.targetWeightKg <= 0) {
      newErrors.targetWeightKg = 'Target weight is required';
    } else if (data.targetWeightKg < 30 || data.targetWeightKg > 300) {
      newErrors.targetWeightKg = 'Please enter a valid target weight (30-300 kg)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const heightInFeet = useMemo(() => {
    if (!data.heightCm) return '';
    const totalInches = data.heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }, [data.heightCm]);

  const weightInLbs = useMemo(() => {
    if (!data.currentWeightKg) return '';
    return Math.round(data.currentWeightKg * 2.205);
  }, [data.currentWeightKg]);

  const targetWeightInLbs = useMemo(() => {
    if (!data.targetWeightKg) return '';
    return Math.round(data.targetWeightKg * 2.205);
  }, [data.targetWeightKg]);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Physical Measurements
        </h3>
        <p className="text-gray-600">
          Help us calculate your BMI and metabolic needs
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            label="Height (cm)"
            type="number"
            value={data.heightCm || ''}
            onChange={(e) => handleInputChange('heightCm', parseFloat(e.target.value) || 0)}
            placeholder="Enter your height in centimeters"
            error={errors.heightCm}
            required
            min="100"
            max="250"
            step="0.1"
          />
          {heightInFeet && (
            <p className="text-sm text-gray-600 mt-1">
              Approximately {heightInFeet}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Current Weight (kg)"
            type="number"
            value={data.currentWeightKg || ''}
            onChange={(e) => handleInputChange('currentWeightKg', parseFloat(e.target.value) || 0)}
            placeholder="Enter your current weight in kilograms"
            error={errors.currentWeightKg}
            required
            min="30"
            max="300"
            step="0.1"
          />
          {weightInLbs && (
            <p className="text-sm text-gray-600 mt-1">
              Approximately {weightInLbs} lbs
            </p>
          )}
        </div>

        <div>
          <Input
            label="Target Weight (kg)"
            type="number"
            value={data.targetWeightKg || ''}
            onChange={(e) => handleInputChange('targetWeightKg', parseFloat(e.target.value) || 0)}
            placeholder="Enter your target weight in kilograms"
            error={errors.targetWeightKg}
            required
            min="30"
            max="300"
            step="0.1"
          />
          {targetWeightInLbs && (
            <p className="text-sm text-gray-600 mt-1">
              Approximately {targetWeightInLbs} lbs
            </p>
          )}
        </div>
      </div>

      {bmiData && (
        <Card className="p-4 bg-gray-50">
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Current BMI
            </h4>
            <div className={`text-3xl font-bold ${bmiData.color} mb-1`}>
              {bmiData.bmi}
            </div>
            <div className={`text-sm font-medium ${bmiData.color} mb-1`}>
              {bmiData.category.replace('_', ' ').toUpperCase()}
            </div>
            <div className="text-xs text-gray-600">
              {bmiData.description}
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