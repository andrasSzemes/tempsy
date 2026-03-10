import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { CombinationClient, createCombinationClientFromEnv } from '../client/CombinationClient';

const CombinationClientContext = createContext<CombinationClient | undefined>(undefined);

export const CombinationClientProvider = ({ children }: { children: ReactNode }) => {
  const client = useMemo(() => createCombinationClientFromEnv(), []);

  return <CombinationClientContext.Provider value={client}>{children}</CombinationClientContext.Provider>;
};

export const useCombinationClient = () => {
  const context = useContext(CombinationClientContext);
  if (!context) {
    throw new Error('useCombinationClient must be used within a CombinationClientProvider');
  }
  return context;
};
