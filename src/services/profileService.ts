import axios from 'axios';
import { ProfileWizardData } from '../components/profile/ProfileWizard';
import { User, ApiResponse } from '../types';

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  primaryGoal?: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle';
  targetTimelineWeeks?: number;
  dietaryPreference?: 'keto' | 'mediterranean' | 'vegan' | 'diabetic' | 'balanced';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

export interface UserStats {
  profileCompletion: number;
  currentMetrics: {
    weight?: {
      value: number;
      unit: string;
      recordedAt: string;
    };
    bodyFat?: {
      value: number;
      unit: string;
      recordedAt: string;
    };
  };
  calculatedMetrics: {
    bmrCalories: number;
    tdeeCalories: number;
    dailyCalorieTarget: number;
  };
  goals: {
    targetWeightKg?: number;
    primaryGoal?: string;
    targetTimelineWeeks?: number;
    weightProgressPercentage?: number;
  };
}

export interface HealthMetric {
  id: string;
  metricType: 'weight' | 'body_fat' | 'muscle_mass' | 'blood_pressure_systolic' | 'blood_pressure_diastolic' | 'glucose' | 'cholesterol' | 'heart_rate';
  value: number;
  unit: string;
  recordedAt: string;
  source: 'manual' | 'device' | 'api';
  deviceId?: string;
  notes?: string;
}

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const mapProfileDataToAPI = (data: ProfileWizardData): ProfileUpdateData => {
  const goalMapping: Record<string, string> = {
    'lose_weight': 'weight_loss',
    'gain_weight': 'weight_gain',
    'maintain_weight': 'maintenance',
    'build_muscle': 'muscle_gain'
  };

  const dietaryMapping: Record<string, string> = {
    'balanced': 'maintenance',
    'diabetic': 'diabetic_friendly'
  };

  return {
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    heightCm: data.heightCm,
    currentWeightKg: data.currentWeightKg,
    targetWeightKg: data.targetWeightKg,
    activityLevel: data.activityLevel,
    primaryGoal: (goalMapping[data.primaryGoal] || data.primaryGoal) as 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle',
    targetTimelineWeeks: data.targetTimelineWeeks,
    dietaryPreference: (dietaryMapping[data.dietaryPreference] || data.dietaryPreference) as 'keto' | 'mediterranean' | 'vegan' | 'diabetic' | 'balanced'
  };
};

const mapUserFromAPI = (apiUser: any): User => {
  const goalMapping: Record<string, string> = {
    'weight_loss': 'lose_weight',
    'weight_gain': 'gain_weight',
    'maintenance': 'maintain_weight',
    'muscle_gain': 'build_muscle'
  };

  const dietaryMapping: Record<string, string> = {
    'maintenance': 'balanced',
    'diabetic_friendly': 'diabetic'
  };

  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.first_name || '',
    lastName: apiUser.last_name || '',
    name: `${apiUser.first_name || ''} ${apiUser.last_name || ''}`.trim(),
    age: apiUser.date_of_birth ? new Date().getFullYear() - new Date(apiUser.date_of_birth).getFullYear() : undefined,
    gender: apiUser.gender,
    weight: apiUser.current_weight_kg,
    height: apiUser.height_cm,
    activityLevel: apiUser.activity_level,
    dietaryPreference: dietaryMapping[apiUser.dietary_preference] || apiUser.dietary_preference,
    targetWeight: apiUser.target_weight_kg,
    targetTimeline: apiUser.target_timeline_weeks,
    bmr: apiUser.bmr_calories,
    tdee: apiUser.tdee_calories,
    emailVerified: !!apiUser.email_verified_at,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at
  };
};

export const profileService = {
  async getProfile(): Promise<User> {
    try {
      const response = await axios.get(
        `${API_BASE}/user/profile`,
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        return mapUserFromAPI(response.data.data);
      }

      throw new Error(response.data.message || 'Failed to fetch profile');
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },

  async updateProfile(data: ProfileWizardData): Promise<User> {
    try {
      const apiData = mapProfileDataToAPI(data);
      
      const response = await axios.put(
        `${API_BASE}/user/profile`,
        apiData,
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        return mapUserFromAPI(response.data.data);
      }

      throw new Error(response.data.message || 'Failed to update profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  async getUserStats(): Promise<UserStats> {
    try {
      const response = await axios.get(
        `${API_BASE}/user/stats`,
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        const data = response.data.data;
        return {
          profileCompletion: data.profile_completion,
          currentMetrics: {
            weight: data.current_metrics.weight ? {
              value: data.current_metrics.weight.value,
              unit: data.current_metrics.weight.unit,
              recordedAt: data.current_metrics.weight.recorded_at
            } : undefined,
            bodyFat: data.current_metrics.body_fat ? {
              value: data.current_metrics.body_fat.value,
              unit: data.current_metrics.body_fat.unit,
              recordedAt: data.current_metrics.body_fat.recorded_at
            } : undefined
          },
          calculatedMetrics: {
            bmrCalories: data.calculated_metrics.bmr_calories,
            tdeeCalories: data.calculated_metrics.tdee_calories,
            dailyCalorieTarget: data.calculated_metrics.daily_calorie_target
          },
          goals: {
            targetWeightKg: data.goals.target_weight_kg,
            primaryGoal: data.goals.primary_goal,
            targetTimelineWeeks: data.goals.target_timeline_weeks,
            weightProgressPercentage: data.goals.weight_progress_percentage
          }
        };
      }

      throw new Error(response.data.message || 'Failed to fetch user stats');
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user stats');
    }
  },

  async recordHealthMetric(metric: Omit<HealthMetric, 'id'>): Promise<HealthMetric> {
    try {
      const apiData = {
        metric_type: metric.metricType,
        value: metric.value,
        unit: metric.unit,
        recorded_at: metric.recordedAt,
        source: metric.source,
        device_id: metric.deviceId,
        notes: metric.notes
      };

      const response = await axios.post(
        `${API_BASE}/user/metrics`,
        apiData,
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        const data = response.data.data;
        return {
          id: data.id,
          metricType: data.metric_type,
          value: data.value,
          unit: data.unit,
          recordedAt: data.recorded_at,
          source: data.source,
          deviceId: data.device_id,
          notes: data.notes
        };
      }

      throw new Error(response.data.message || 'Failed to record health metric');
    } catch (error: any) {
      console.error('Error recording health metric:', error);
      throw new Error(error.response?.data?.message || 'Failed to record health metric');
    }
  },

  async getHealthMetrics(filters?: {
    metricType?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    perPage?: number;
  }): Promise<{ data: HealthMetric[]; pagination: any }> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key === 'perPage' ? 'per_page' : key, value.toString());
          }
        });
      }

      const response = await axios.get(
        `${API_BASE}/user/metrics?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        const metrics = response.data.data.data.map((metric: any): HealthMetric => ({
          id: metric.id,
          metricType: metric.metric_type,
          value: metric.value,
          unit: metric.unit,
          recordedAt: metric.recorded_at,
          source: metric.source,
          deviceId: metric.device_id,
          notes: metric.notes
        }));

        return {
          data: metrics,
          pagination: response.data.data.pagination || response.data.data
        };
      }

      throw new Error(response.data.message || 'Failed to fetch health metrics');
    } catch (error: any) {
      console.error('Error fetching health metrics:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch health metrics');
    }
  }
};