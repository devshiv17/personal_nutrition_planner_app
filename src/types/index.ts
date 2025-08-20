// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Computed from firstName + lastName
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  dietaryPreference?: 'keto' | 'mediterranean' | 'vegan' | 'diabetic';
  targetWeight?: number;
  targetTimeline?: number; // in weeks
  bmi?: number;
  bmr?: number;
  tdee?: number;
  emailVerified?: boolean;
  roles?: string[];
  createdAt: string;
  updatedAt: string;
}

// Authentication types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  sessionId: string | null;
  loading: boolean;
  error: string | null;
  lastActivity: number;
  sessionWarning: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
  sessionId: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UserSession {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  location?: string;
  lastActivity: string;
  isCurrentSession: boolean;
  isMobile: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  allowMultipleSessions: boolean;
}

// Meal Plan types
export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  macros: MacroNutrients;
  imageUrl?: string;
  tags: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  macros: MacroNutrients;
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe: Recipe;
  date: string;
  servings: number;
}

export interface MealPlan {
  id: string;
  userId: string;
  weekStartDate: string;
  dietaryType: User['dietaryPreference'];
  meals: Meal[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  groceryList: GroceryItem[];
  createdAt: string;
  isActive: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
}

// Food Logging types
export interface FoodLog {
  id: string;
  userId: string;
  foodName: string;
  quantity: number;
  unit: string;
  mealType: Meal['type'];
  calories: number;
  macros: MacroNutrients;
  loggedAt: string;
  isVoiceLogged: boolean;
  imageUrl?: string;
}

export interface VoiceLogSession {
  id: string;
  transcript: string;
  audioUrl?: string;
  processedFoods: FoodLog[];
  confidence: number;
  createdAt: string;
}

// Progress types
export interface WeightEntry {
  id: string;
  userId: string;
  weight: number;
  date: string;
  notes?: string;
}

export interface ProgressStats {
  currentWeight: number;
  weightChange: number;
  goalProgress: number; // percentage
  averageCalories: number;
  averageMacros: MacroNutrients;
  streak: number; // days
  adherenceRate: number; // percentage
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'weight' | 'logging' | 'streak' | 'goal';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Form validation types
export interface ValidationErrors {
  [key: string]: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string; }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

// Navigation types
export interface NavItem {
  path: string;
  label: string;
  icon: string;
  requiresAuth?: boolean;
  children?: NavItem[];
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    border: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}