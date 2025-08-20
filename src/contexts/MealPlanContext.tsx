import React, { createContext, useContext } from 'react';

const MealPlanContext = createContext<any>(null);

export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MealPlanContext.Provider value={{}}>
      {children}
    </MealPlanContext.Provider>
  );
};

export { MealPlanContext };

export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within MealPlanProvider');
  }
  return context;
};