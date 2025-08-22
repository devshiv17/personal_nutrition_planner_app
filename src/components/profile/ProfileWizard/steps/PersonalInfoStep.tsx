import React, { useState } from 'react';
import { Button } from '../../../ui';
import { Input } from '../../../ui';
import { ProfileWizardData } from '../ProfileWizard';

interface PersonalInfoStepProps {
  data: ProfileWizardData;
  onChange: (data: Partial<ProfileWizardData>) => void;
  onNext: () => void;
}

export default function PersonalInfoStep({ data, onChange, onNext }: PersonalInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ProfileWizardData, value: string) => {
    onChange({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (data.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!data.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (data.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13 || age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    if (!data.gender) {
      newErrors.gender = 'Please select your gender';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const calculateAge = () => {
    if (!data.dateOfBirth) return null;
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const age = calculateAge();

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Let's start with your basic information
        </h3>
        <p className="text-gray-600">
          This helps us personalize your nutrition plan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="First Name"
            type="text"
            value={data.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter your first name"
            error={errors.firstName}
            required
          />
        </div>

        <div>
          <Input
            label="Last Name"
            type="text"
            value={data.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter your last name"
            error={errors.lastName}
            required
          />
        </div>
      </div>

      <div>
        <Input
          label="Date of Birth"
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          error={errors.dateOfBirth}
          required
          max={new Date().toISOString().split('T')[0]}
        />
        {age && (
          <p className="text-sm text-gray-600 mt-1">
            You are {age} years old
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('gender', option.value)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                data.gender === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
        )}
      </div>

      <div className="flex justify-end pt-6">
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