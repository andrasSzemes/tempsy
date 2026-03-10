import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { createUserClientFromEnv, UserClient } from '../../client/UserClient';

const UserClientContext = createContext<UserClient | undefined>(undefined);

export const UserClientProvider = ({ children }: { children: ReactNode }) => {
  const client = useMemo(() => createUserClientFromEnv(), []);

  return <UserClientContext.Provider value={client}>{children}</UserClientContext.Provider>;
};

export const useUserClient = () => {
  const context = useContext(UserClientContext);
  if (!context) {
    throw new Error('useUserClient must be used within a UserClientProvider');
  }
  return context;
};
