// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Dietary Preferences
export const DIETARY_PREFERENCES = [
  { value: 'keto', label: 'Keto', description: 'High fat, low carb' },
  { value: 'mediterranean', label: 'Mediterranean', description: 'Balanced, heart-healthy' },
  { value: 'vegan', label: 'Vegan', description: 'Plant-based' },
  { value: 'diabetic', label: 'Diabetic-friendly', description: 'Low glycemic index' }
] as const;

// Activity Levels
export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', multiplier: 1.2, description: 'Little to no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', multiplier: 1.375, description: 'Light exercise 1-3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', multiplier: 1.55, description: 'Moderate exercise 3-5 days/week' },
  { value: 'very_active', label: 'Very Active', multiplier: 1.725, description: 'Hard exercise 6-7 days/week' }
] as const;

// Goal Types
export const GOAL_TYPES = [
  { value: 'weight_loss', label: 'Weight Loss', calorieAdjustment: -500 },
  { value: 'maintenance', label: 'Maintenance', calorieAdjustment: 0 },
  { value: 'muscle_gain', label: 'Muscle Gain', calorieAdjustment: 300 },
  { value: 'health_management', label: 'Health Management', calorieAdjustment: 0 }
] as const;

// Meal Types
export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { value: 'lunch', label: 'Lunch', icon: '☀️' },
  { value: 'dinner', label: 'Dinner', icon: '🌙' },
  { value: 'snack', label: 'Snack', icon: '🍎' }
] as const;

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  MEAL_PLANNING: '/meal-planning',
  MEAL_PLANNING_GENERATOR: '/meal-planning/generator',
  MEAL_PLANNING_CALENDAR: '/meal-planning/calendar',
  MEAL_PLANNING_CURRENT: '/meal-planning/current',
  MEAL_PLANNING_HISTORY: '/meal-planning/history',
  MEAL_PLANNING_GROCERY: '/meal-planning/grocery-list',
  FOOD_LOGGING: '/food-logging',
  FOOD_LOGGING_ADD: '/food-logging/add',
  FOOD_LOGGING_HISTORY: '/food-logging/history',
  VOICE_LOGGING: '/voice-logging',
  VOICE_LOGGING_TUTORIAL: '/voice-logging/tutorial',
  VOICE_LOGGING_HISTORY: '/voice-logging/history',
  VOICE_LOGGING_SETTINGS: '/voice-logging/settings',
  PROGRESS: '/progress',
  PROGRESS_WEIGHT: '/progress/weight',
  PROGRESS_NUTRITION: '/progress/nutrition',
  PROGRESS_ACHIEVEMENTS: '/progress/achievements',
  PROGRESS_REPORTS: '/progress/reports',
  PROGRESS_INSIGHTS: '/progress/insights',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  SETTINGS: '/settings',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_PRIVACY: '/settings/privacy',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_DATA: '/settings/data',
  HELP: '/help',
  ABOUT: '/about',
  FEATURES: '/features',
  PRICING: '/pricing',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  CONTACT: '/contact'
} as const;

// Validation Rules
export const VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  WEIGHT: {
    MIN: 30,
    MAX: 300
  },
  HEIGHT: {
    MIN: 100,
    MAX: 250
  },
  AGE: {
    MIN: 13,
    MAX: 120
  }
} as const;

// Theme Constants
export const COLORS = {
  PRIMARY: '#4F46E5',
  SECONDARY: '#10B981',
  SUCCESS: '#059669',
  WARNING: '#D97706',
  ERROR: '#DC2626',
  INFO: '#2563EB',
  BACKGROUND: '#F9FAFB',
  SURFACE: '#FFFFFF',
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#6B7280',
  TEXT_DISABLED: '#9CA3AF',
  BORDER: '#E5E7EB'
} as const;

export const BREAKPOINTS = {
  MOBILE: '768px',
  TABLET: '1024px',
  DESKTOP: '1280px'
} as const;

export const SPACING = {
  XS: '0.25rem',
  SM: '0.5rem',
  MD: '1rem',
  LG: '1.5rem',
  XL: '2rem',
  XXL: '3rem'
} as const;

// Feature Flags
export const FEATURES = {
  VOICE_LOGGING: true,
  SOCIAL_SHARING: false,
  PREMIUM_FEATURES: false,
  WEARABLE_INTEGRATION: false
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  VOICE_NOT_SUPPORTED: 'Voice recording is not supported in your browser.',
  MICROPHONE_ACCESS_DENIED: 'Microphone access was denied. Please enable it to use voice logging.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  MEAL_PLAN_GENERATED: 'Meal plan generated successfully!',
  FOOD_LOGGED: 'Food logged successfully!',
  WEIGHT_RECORDED: 'Weight recorded successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  SESSION_ID: 'session_id',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  REMEMBER_ME: 'remember_me',
  LAST_ACTIVITY: 'last_activity'
} as const;

// Authentication Constants
export const AUTH_CONFIG = {
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  SESSION_WARNING_THRESHOLD: 2 * 60 * 1000, // 2 minutes before expiry
  ACTIVITY_CHECK_INTERVAL: 30 * 1000, // 30 seconds
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes of inactivity
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
  LOCKOUT_CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour cleanup interval
  PROGRESSIVE_DELAY_BASE: 1000, // Base delay for progressive delays
  PROGRESSIVE_DELAY_MAX: 30000, // Max delay of 30 seconds
} as const;

// Chart Colors
export const CHART_COLORS = [
  '#4F46E5',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F97316'
] as const;

// Nutrition targets (as percentages of total calories)
export const MACRO_TARGETS = {
  keto: { protein: 20, carbs: 5, fats: 75 },
  mediterranean: { protein: 20, carbs: 50, fats: 30 },
  vegan: { protein: 15, carbs: 60, fats: 25 },
  diabetic: { protein: 25, carbs: 45, fats: 30 }
} as const;