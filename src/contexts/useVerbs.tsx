import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { conjugaisonPasseCompose } from "../sencetcePieces/passeCompose/conjugaison";

// Define the shape of the verbs context
interface VerbsContextType {
  checkedVerbs: { [verb: string]: boolean };
  setCheckedVerbs: React.Dispatch<React.SetStateAction<{ [verb: string]: boolean }>>;
  verbCounters: { [verb: string]: number };
  setVerbCounters: React.Dispatch<React.SetStateAction<{ [verb: string]: number }>>;
  availableVerbs: string[];
  decreaseCount: (verb: string) => void;
}

// Create the context with a default value
const VerbsContext = createContext<VerbsContextType | undefined>(undefined);

// Provider component
export const VerbsProvider = ({ children }: { children: ReactNode }) => {
    const [checkedVerbs, setCheckedVerbs] = useState<{ [verb: string]: boolean }>(
        Object.fromEntries(Object.keys(conjugaisonPasseCompose).map(verb => [verb, true]))
    );
    const [verbCounters, setVerbCounters] = useState<{ [verb: string]: number }>(
        Object.fromEntries(Object.keys(conjugaisonPasseCompose).map(verb => [verb, 3]))
    );

    const availableVerbs = Object.keys(checkedVerbs).filter(v => checkedVerbs[v] && verbCounters[v] > 0);
    const decreaseCount = (verb: string) => {
        setVerbCounters(prev => ({...prev, [verb]: Math.max(0, (prev[verb] || 0) - 1)}));
    };

    return (
      <VerbsContext.Provider value={{ checkedVerbs, setCheckedVerbs, verbCounters, setVerbCounters, availableVerbs, decreaseCount }}>
        {children}
      </VerbsContext.Provider>
    );
};

// Custom hook to use the verbs context
export const useVerbs = () => {
  const context = useContext(VerbsContext);
  if (!context) {
    throw new Error("useVerbs must be used within a VerbsProvider");
  }
  return context;
};
