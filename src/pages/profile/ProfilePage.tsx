import React, { useState, useEffect } from 'react';
import { ProfileWizard, ProfileWizardData } from '../../components/profile/ProfileWizard';
import { Button, Card, Modal } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { profileService, UserStats } from '../../services/profileService';
import { calculateHealthMetrics } from '../../services/healthCalculations';

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const stats = await profileService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const handleProfileComplete = async (data: ProfileWizardData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedUser = await profileService.updateProfile(data);
      
      if (updateUserProfile) {
        updateUserProfile(updatedUser);
      }
      
      await loadUserStats();
      setShowWizard(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const isProfileIncomplete = () => {
    return !user?.weight || !user?.height || !user?.activityLevel || !user?.dietaryPreference;
  };

  const calculateAge = () => {
    if (!user?.age) return null;
    return user.age;
  };

  const getBMI = () => {
    if (user?.weight && user?.height) {
      const bmi = (user.weight / ((user.height / 100) ** 2));
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-600' };
    return { text: 'Obese', color: 'text-red-600' };
  };

  const bmi = getBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <Button onClick={() => setShowWizard(true)}>
          {isProfileIncomplete() ? 'Complete Profile' : 'Edit Profile'}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isProfileIncomplete() && (
        <Card className="mb-6 p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center">
            <div className="mr-3 text-yellow-600">⚠️</div>
            <div>
              <h3 className="font-semibold text-yellow-800">Complete Your Profile</h3>
              <p className="text-yellow-700">
                Complete your profile to get personalized nutrition recommendations and accurate calorie calculations.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{user?.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Age:</span>
              <span className="font-medium">{calculateAge() || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium capitalize">{user?.gender || 'Not set'}</span>
            </div>
          </div>
        </Card>

        {/* Physical Metrics */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Physical Metrics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Height:</span>
              <span className="font-medium">{user?.height ? `${user.height} cm` : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">{user?.weight ? `${user.weight} kg` : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Target Weight:</span>
              <span className="font-medium">{user?.targetWeight ? `${user.targetWeight} kg` : 'Not set'}</span>
            </div>
            {bmi && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">BMI:</span>
                <div className="text-right">
                  <span className="font-medium">{bmi}</span>
                  {bmiCategory && (
                    <div className={`text-sm ${bmiCategory.color}`}>
                      {bmiCategory.text}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Goals & Preferences */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Goals & Preferences</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Activity Level:</span>
              <span className="font-medium capitalize">
                {user?.activityLevel?.replace('_', ' ') || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dietary Preference:</span>
              <span className="font-medium capitalize">
                {user?.dietaryPreference || 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Target Timeline:</span>
              <span className="font-medium">
                {user?.targetTimeline ? `${user.targetTimeline} weeks` : 'Not set'}
              </span>
            </div>
          </div>
        </Card>

        {/* Calculated Metrics */}
        {userStats && (
          <Card className="lg:col-span-3 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Nutritional Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {userStats.calculatedMetrics.bmrCalories || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">BMR</div>
                <div className="text-xs text-gray-500">Calories at rest</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {userStats.calculatedMetrics.tdeeCalories || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">TDEE</div>
                <div className="text-xs text-gray-500">Total daily calories</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {userStats.calculatedMetrics.dailyCalorieTarget || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Goal</div>
                <div className="text-xs text-gray-500">Daily calorie target</div>
              </div>
              
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600">
                  {userStats.profileCompletion}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Complete</div>
                <div className="text-xs text-gray-500">Profile completion</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Profile Wizard Modal */}
      <Modal
        open={showWizard}
        onClose={() => !isLoading && setShowWizard(false)}
        title=""
        showCloseButton={false}
        className="max-w-4xl"
      >
        <ProfileWizard
          user={user || undefined}
          onComplete={handleProfileComplete}
          onCancel={() => setShowWizard(false)}
        />
      </Modal>
    </div>
  );
};

export default ProfilePage;