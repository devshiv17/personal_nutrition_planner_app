import React, { createContext, useContext } from 'react';

const FoodLogContext = createContext<any>(null);

export const FoodLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FoodLogContext.Provider value={{}}>
      {children}
    </FoodLogContext.Provider>
  );
};

export { FoodLogContext };

export const useFoodLog = () => {
  const context = useContext(FoodLogContext);
  if (!context) {
    throw new Error('useFoodLog must be used within FoodLogProvider');
  }
  return context;
};