import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchAuthSession, getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth';
import { hasCognitoSetup } from '../auth/amplify';
import { useUserClient } from './clientProviders/useUserClient';

type UserContextType = {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userClient = useUserClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logTokensInDev = async (): Promise<void> => {
    if (!import.meta.env.DEV) {
      return;
    }

    const session = await fetchAuthSession();
    console.log('Cognito tokens (DEV):', {
      idToken: session.tokens?.idToken?.toString(),
      accessToken: session.tokens?.accessToken?.toString(),
      idTokenPayload: session.tokens?.idToken?.payload,
      accessTokenPayload: session.tokens?.accessToken?.payload,
    });
  };

  const ensureCurrentUserExists = async (): Promise<void> => {
    const { userId: cognitoSub } = await getCurrentUser();
    const alreadyExists = await userClient.userExists(cognitoSub);
    if (alreadyExists) {
      return;
    }

    const session = await fetchAuthSession();
    const payload = session.tokens?.idToken?.payload;

    if (import.meta.env.DEV) {
      console.log('Cognito idToken payload claims:', payload);
    }

    const displayNameValue = payload?.name ?? payload?.preferred_username;

    const displayName = typeof displayNameValue === 'string' ? displayNameValue : undefined;

    await userClient.upsertUser({
      name: displayName,
    });
  };

  useEffect(() => {
    if (!hasCognitoSetup) {
      setIsLoggedIn(false);
      return;
    }

    let isMounted = true;

    const checkAuth = async () => {
      try {
        await getCurrentUser();
        await logTokensInDev();
        if (isMounted) {
          setIsLoggedIn(true);
        }
        try {
          await ensureCurrentUserExists();
        } catch (error) {
          // Keep UI logged-in even if backend sync temporarily fails.
          console.error('User initialization failed:', error);
        }
      } catch {
        if (isMounted) {
          setIsLoggedIn(false);
        }
      }
    };

    void checkAuth();

    return () => {
      isMounted = false;
    };
  }, [userClient]);

  const login = async (): Promise<void> => {
    if (!hasCognitoSetup) {
      return;
    }

    try {
      await getCurrentUser();
      setIsLoggedIn(true);
      return;
    } catch {
      // Continue to hosted UI redirect when there is no active user.
    }

    try {
      await signInWithRedirect();
    } catch (error) {
      const isAlreadyAuthenticated =
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        error.name === 'UserAlreadyAuthenticatedException';

      if (isAlreadyAuthenticated) {
        setIsLoggedIn(true);
        return;
      }

      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    if (!hasCognitoSetup) {
      return;
    }
    await signOut();
    setIsLoggedIn(false);
  };

  return <UserContext.Provider value={{ isLoggedIn, login, logout }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
