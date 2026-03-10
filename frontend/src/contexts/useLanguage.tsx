import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useVerbClient } from './clientProviders/useVerbClient';

type LanguageContextType = {
  allVerbs: string[];
  allTenses: string[];
  irregularByTense: Record<string, string[]>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const verbClient = useVerbClient();
  const [allVerbs, setAllVerbs] = useState<string[]>([]);
  const [allTenses, setAllTenses] = useState<string[]>([]);
  const [irregularByTense, setIrregularByTense] = useState<Record<string, string[]>>({});

  useEffect(() => {
    let isMounted = true;

    const loadLanguageData = async () => {
      try {
        const [verbs, irregularMap, tenses] = await Promise.all([
          verbClient.getVerbs(),
          verbClient.getIrregularByTense(),
          verbClient.getTenses(),
        ]);

        if (!isMounted) {
          return;
        }

        setAllVerbs(verbs);
        setAllTenses(tenses);
        setIrregularByTense(irregularMap);
      } catch (error) {
        console.error('Could not load language data from backend:', error);
      }
    };

    void loadLanguageData();

    return () => {
      isMounted = false;
    };
  }, [verbClient]);

  return <LanguageContext.Provider value={{ allVerbs, allTenses, irregularByTense }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
