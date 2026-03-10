import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { createVerbClientFromEnv, VerbClient } from '../../client/VerbClient';

const VerbClientContext = createContext<VerbClient | undefined>(undefined);

export const VerbClientProvider = ({ children }: { children: ReactNode }) => {
  const client = useMemo(() => createVerbClientFromEnv(), []);

  return <VerbClientContext.Provider value={client}>{children}</VerbClientContext.Provider>;
};

export const useVerbClient = () => {
  const context = useContext(VerbClientContext);
  if (!context) {
    throw new Error('useVerbClient must be used within a VerbClientProvider');
  }
  return context;
};
