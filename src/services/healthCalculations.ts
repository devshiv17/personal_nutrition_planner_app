export interface HealthMetrics {
  bmi: number;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
  bmr: number;
  tdee: number;
}

export interface PersonalData {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
}

export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return 0;
  }
  
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

export const getBMICategory = (bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' => {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

export const getBMIColor = (category: string): string => {
  switch (category) {
    case 'underweight': return 'text-blue-600';
    case 'normal': return 'text-green-600';
    case 'overweight': return 'text-yellow-600';
    case 'obese': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const getBMIDescription = (category: string): string => {
  switch (category) {
    case 'underweight': return 'Below normal weight range';
    case 'normal': return 'Healthy weight range';
    case 'overweight': return 'Above normal weight range';
    case 'obese': return 'Significantly above normal weight range';
    default: return '';
  }
};

export const calculateBMR = (data: PersonalData): number => {
  const { weightKg, heightCm, age, gender } = data;
  
  if (!weightKg || !heightCm || !age || weightKg <= 0 || heightCm <= 0 || age <= 0) {
    return 0;
  }

  let bmr: number;
  
  if (gender === 'male') {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
  } else if (gender === 'female') {
    bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
  } else {
    const maleBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    const femaleBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    bmr = (maleBMR + femaleBMR) / 2;
  }
  
  return Math.round(bmr);
};

export const getActivityMultiplier = (activityLevel: PersonalData['activityLevel']): number => {
  switch (activityLevel) {
    case 'sedentary': return 1.2;
    case 'lightly_active': return 1.375;
    case 'moderately_active': return 1.55;
    case 'very_active': return 1.725;
    default: return 1.2;
  }
};

export const calculateTDEE = (bmr: number, activityLevel: PersonalData['activityLevel']): number => {
  if (!bmr || bmr <= 0) return 0;
  
  const multiplier = getActivityMultiplier(activityLevel);
  return Math.round(bmr * multiplier);
};

export const calculateHealthMetrics = (data: PersonalData): HealthMetrics => {
  const bmi = calculateBMI(data.weightKg, data.heightCm);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(data);
  const tdee = calculateTDEE(bmr, data.activityLevel);

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee
  };
};

export const getCalorieGoal = (
  tdee: number, 
  goal: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle'
): number => {
  switch (goal) {
    case 'lose_weight':
      return Math.round(tdee * 0.8);
    case 'gain_weight':
      return Math.round(tdee * 1.15);
    case 'build_muscle':
      return Math.round(tdee * 1.1);
    case 'maintain_weight':
    default:
      return tdee;
  }
};

export const getWeightChangeRate = (
  goal: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle',
  timelineWeeks: number
): number => {
  const maxHealthyLossPerWeek = 1;
  const maxHealthyGainPerWeek = 0.5;
  
  switch (goal) {
    case 'lose_weight':
      return Math.min(maxHealthyLossPerWeek, 1);
    case 'gain_weight':
    case 'build_muscle':
      return Math.min(maxHealthyGainPerWeek, 0.5);
    case 'maintain_weight':
    default:
      return 0;
  }
};