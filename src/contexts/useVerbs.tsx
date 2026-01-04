import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { conjugaisonPasseCompose } from "../tenses/passeCompose/conjugaison";
import { generateAllCombinaisons, type Combinaison } from "../hooks/useAllCombinaisons";

// Define the shape of the verbs context
interface VerbsContextType {
  checkedVerbs: { [verb: string]: boolean };
  // verbCounters: { [verb: string]: number };
  // setVerbCounters: React.Dispatch<React.SetStateAction<{ [verb: string]: number }>>;
  availableVerbs: string[];
  selectedTense: string;
  setSelectedTense: (tense: string) => void;
  setAllCheckStatus: (checked: boolean) => void;
  toggleVerbList: (verbs: string[]) => void;
  forceSelectVerbList: (verbs: string[]) => void;
  toggleVerb: (verb: string) => void;
  // decreaseCount: (verb: string) => void;
  addSelectedVerbs: () => void;
  taskList: Combinaison[];
  emptyTaskList: () => void;
}

// Create the context with a default value
const VerbsContext = createContext<VerbsContextType | undefined>(undefined);

// Provider component
export const VerbsProvider = ({ children }: { children: ReactNode }) => {
    const [taskList, setTaskList] = useState<Combinaison[]>([]);
    const [selectedTense, setSelectedTense] = useState<string>("passé composé");

    function addSelectedVerbs() {
        const tasks = generateAllCombinaisons(selectedTense, availableVerbs);
        setTaskList((prevTasks) => [...prevTasks, ...tasks]);
    }

    function emptyTaskList() {
        setTaskList([]);
    }

    console.log("taskList", taskList);

    const [checkedVerbs, setCheckedVerbs] = useState<{ [verb: string]: boolean }>(
        Object.fromEntries(Object.keys(conjugaisonPasseCompose).map((verb, index) => [verb, index < 3]))
    );

    const availableVerbs = Object.keys(checkedVerbs).filter(v => checkedVerbs[v]);

    const setAllCheckStatus = (checked: boolean) => {
        setCheckedVerbs(
            Object.fromEntries(
                Object.keys(conjugaisonPasseCompose).map((verb) => [verb, checked])
            )
        );
    };

    const forceSelectVerbList = (verbs: string[]) => {
        setCheckedVerbs((prev) => {
            // Set all verbs to false
            const updated = Object.fromEntries(
                Object.keys(conjugaisonPasseCompose).map((verb) => [verb, false])
            );
            // Then set only the provided verbs to true
            verbs.forEach((v) => {
                if (v in updated) updated[v] = true;
            });
            return updated;
        });
    }

    const toggleVerbList = (verbs: string[]) => {
        const allSelected = verbs.every((v) => checkedVerbs[v]);
        setCheckedVerbs((prev) => {
            const updated = { ...prev };
            verbs.forEach((v) => {
                if (v in updated) updated[v] = !allSelected;
            });
            return updated;
        });
    };

    const toggleVerb = (verb: string) => {
            setCheckedVerbs((prev) => ({
                ...prev,
                [verb]: !prev[verb]
            }));
        };

    return (
      <VerbsContext.Provider value={{
        checkedVerbs,
        // verbCounters,
        toggleVerb,
        // setVerbCounters,
        availableVerbs,
        selectedTense,
        setSelectedTense,
        setAllCheckStatus,
        toggleVerbList,
        forceSelectVerbList,
        // decreaseCount
        addSelectedVerbs,
        taskList,
        emptyTaskList
        }}>
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
