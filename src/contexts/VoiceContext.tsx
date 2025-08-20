import React, { createContext, useContext } from 'react';

const VoiceContext = createContext<any>(null);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <VoiceContext.Provider value={{}}>
      {children}
    </VoiceContext.Provider>
  );
};

export { VoiceContext };

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within VoiceProvider');
  }
  return context;
};