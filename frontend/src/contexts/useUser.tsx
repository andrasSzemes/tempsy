import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchAuthSession, getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth';
import { hasCognitoSetup } from '../auth/amplify';
import { useUserClient } from './clientProviders/useUserClient';

type UserContextType = {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const hasOAuthCodeInUrl = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  const params = new URLSearchParams(window.location.search);
  return params.has('code');
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userClient = useUserClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const extractUserEmail = async (): Promise<string | null> => {
    const session = await fetchAuthSession();
    const payload = session.tokens?.idToken?.payload;
    const emailValue = payload?.email;
    return typeof emailValue === 'string' ? emailValue : null;
  };

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
        const waitingForOAuthCallback = hasOAuthCodeInUrl();
        const maxAttempts = waitingForOAuthCallback ? 8 : 1;
        let authenticated = false;

        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
          try {
            await getCurrentUser();
            authenticated = true;
            break;
          } catch {
            if (!waitingForOAuthCallback || attempt === maxAttempts - 1) {
              throw new Error('Unable to resolve authenticated user.');
            }
            await sleep(300);
          }
        }

        if (!authenticated) {
          throw new Error('Unable to resolve authenticated user.');
        }

        const email = await extractUserEmail();
        await logTokensInDev();
        if (isMounted) {
          setIsLoggedIn(true);
          setUserEmail(email);
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
          setUserEmail(null);
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
      const email = await extractUserEmail();
      setIsLoggedIn(true);
      setUserEmail(email);
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
        const email = await extractUserEmail();
        setIsLoggedIn(true);
        setUserEmail(email);
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
    setUserEmail(null);
  };

  return <UserContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
