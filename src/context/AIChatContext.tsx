import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AIChatContextType {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  clearChat: () => void;
  isChatCleared: boolean;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

interface AIChatProviderProps {
  children: ReactNode;
}

export const AIChatProvider: React.FC<AIChatProviderProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatCleared, setIsChatCleared] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const toggleChat = () => setIsChatOpen(prev => !prev);
  
  // Function to clear chat history
  const clearChat = () => {
    setIsChatCleared(true);
    // Reset the flag after a short delay to allow components to react
    setTimeout(() => setIsChatCleared(false), 100);
  };

  return (
    <AIChatContext.Provider
      value={{
        isChatOpen,
        openChat,
        closeChat,
        toggleChat,
        clearChat,
        isChatCleared
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = (): AIChatContextType => {
  const context = useContext(AIChatContext);
  if (context === undefined) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};
