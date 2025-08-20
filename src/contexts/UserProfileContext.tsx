import React, { createContext, useContext } from 'react';

const UserProfileContext = createContext<any>(null);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UserProfileContext.Provider value={{}}>
      {children}
    </UserProfileContext.Provider>
  );
};

export { UserProfileContext };

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
};