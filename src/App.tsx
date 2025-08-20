import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'styled-components';

import { AuthProvider } from './contexts/AuthContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { MealPlanProvider } from './contexts/MealPlanContext';
import { FoodLogProvider } from './contexts/FoodLogContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { NotificationProvider } from './contexts/NotificationContext';

import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import { ROUTES } from './constants';

// Page imports
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MealPlanningPage from './pages/meal-planning/MealPlanningPage';
import FoodLoggingPage from './pages/food-logging/FoodLoggingPage';
import VoiceLoggingPage from './pages/voice-logging/VoiceLoggingPage';
import ProgressPage from './pages/progress/ProgressPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import HelpPage from './pages/help/HelpPage';

// Layout components
import Layout from './components/navigation/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <Router>
            <AuthProvider>
              <UserProfileProvider>
                <MealPlanProvider>
                  <FoodLogProvider>
                    <VoiceProvider>
                      <NotificationProvider>
                        <Routes>
                          {/* Public routes */}
                          <Route path={ROUTES.HOME} element={<HomePage />} />
                          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                          <Route path={ROUTES.ABOUT} element={<div>About Page</div>} />
                          <Route path={ROUTES.FEATURES} element={<div>Features Page</div>} />
                          <Route path={ROUTES.PRICING} element={<div>Pricing Page</div>} />
                          <Route path={ROUTES.PRIVACY} element={<div>Privacy Page</div>} />
                          <Route path={ROUTES.TERMS} element={<div>Terms Page</div>} />
                          <Route path={ROUTES.CONTACT} element={<div>Contact Page</div>} />
                          <Route path={ROUTES.HELP} element={<HelpPage />} />

                          {/* Protected routes with layout */}
                          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                            <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
                            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                            
                            {/* Meal Planning routes */}
                            <Route path={ROUTES.MEAL_PLANNING} element={<MealPlanningPage />} />
                            <Route path={ROUTES.MEAL_PLANNING_GENERATOR} element={<div>Meal Plan Generator</div>} />
                            <Route path={ROUTES.MEAL_PLANNING_CALENDAR} element={<div>Meal Plan Calendar</div>} />
                            <Route path={ROUTES.MEAL_PLANNING_CURRENT} element={<div>Current Meal Plan</div>} />
                            <Route path={ROUTES.MEAL_PLANNING_HISTORY} element={<div>Meal Plan History</div>} />
                            <Route path={ROUTES.MEAL_PLANNING_GROCERY} element={<div>Grocery List</div>} />
                            
                            {/* Food Logging routes */}
                            <Route path={ROUTES.FOOD_LOGGING} element={<FoodLoggingPage />} />
                            <Route path={ROUTES.FOOD_LOGGING_ADD} element={<div>Add Food</div>} />
                            <Route path={ROUTES.FOOD_LOGGING_HISTORY} element={<div>Food Log History</div>} />
                            
                            {/* Voice Logging routes */}
                            <Route path={ROUTES.VOICE_LOGGING} element={<VoiceLoggingPage />} />
                            <Route path={ROUTES.VOICE_LOGGING_TUTORIAL} element={<div>Voice Tutorial</div>} />
                            <Route path={ROUTES.VOICE_LOGGING_HISTORY} element={<div>Voice History</div>} />
                            <Route path={ROUTES.VOICE_LOGGING_SETTINGS} element={<div>Voice Settings</div>} />
                            
                            {/* Progress routes */}
                            <Route path={ROUTES.PROGRESS} element={<ProgressPage />} />
                            <Route path={ROUTES.PROGRESS_WEIGHT} element={<div>Weight Progress</div>} />
                            <Route path={ROUTES.PROGRESS_NUTRITION} element={<div>Nutrition Progress</div>} />
                            <Route path={ROUTES.PROGRESS_ACHIEVEMENTS} element={<div>Achievements</div>} />
                            <Route path={ROUTES.PROGRESS_REPORTS} element={<div>Reports</div>} />
                            <Route path={ROUTES.PROGRESS_INSIGHTS} element={<div>Insights</div>} />
                            
                            {/* Profile and Settings routes */}
                            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                            <Route path={ROUTES.PROFILE_EDIT} element={<div>Edit Profile</div>} />
                            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                            <Route path={ROUTES.SETTINGS_NOTIFICATIONS} element={<div>Notification Settings</div>} />
                            <Route path={ROUTES.SETTINGS_PRIVACY} element={<div>Privacy Settings</div>} />
                            <Route path={ROUTES.SETTINGS_ACCOUNT} element={<div>Account Settings</div>} />
                            <Route path={ROUTES.SETTINGS_DATA} element={<div>Data Management</div>} />
                          </Route>

                          {/* Catch all route */}
                          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                        </Routes>
                      </NotificationProvider>
                    </VoiceProvider>
                  </FoodLogProvider>
                </MealPlanProvider>
              </UserProfileProvider>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;