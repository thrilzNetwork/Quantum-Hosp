import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthUIContextType {
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
}

const AuthUIContext = createContext<AuthUIContextType | undefined>(undefined);

export function AuthUIProvider({ children }: { children: ReactNode }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <AuthUIContext.Provider value={{ isLoginOpen, setIsLoginOpen }}>
      {children}
    </AuthUIContext.Provider>
  );
}

export function useAuthUI() {
  const context = useContext(AuthUIContext);
  if (context === undefined) {
    throw new Error('useAuthUI must be used within an AuthUIProvider');
  }
  return context;
}
