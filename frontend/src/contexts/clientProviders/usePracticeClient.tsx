import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { createPracticeClientFromEnv, PracticeClient } from '../../client/PracticeClient';

const PracticeClientContext = createContext<PracticeClient | undefined>(undefined);

export const PracticeClientProvider = ({ children }: { children: ReactNode }) => {
  const client = useMemo(() => createPracticeClientFromEnv(), []);

  return <PracticeClientContext.Provider value={client}>{children}</PracticeClientContext.Provider>;
};

export const usePracticeClient = () => {
  const context = useContext(PracticeClientContext);
  if (!context) {
    throw new Error('usePracticeClient must be used within a PracticeClientProvider');
  }
  return context;
};
