import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchCombinaisons, type Combinaison } from "../services/combinaisonService";
import { useVerbClient } from "./clientProviders/useVerbClient";

// Define the shape of the verbs context
interface VerbsContextType {
    allVerbs: string[];
  checkedVerbs: { [verb: string]: boolean };
  availableVerbs: string[];
    irregularByTense: Record<string, string[]>;
    irregularVerbsForSelectedTense: string[];
  selectedTense: string;
  setSelectedTense: (tense: string) => void;
  setAllCheckStatus: (checked: boolean) => void;
  toggleVerbList: (verbs: string[]) => void;
  forceSelectVerbList: (verbs: string[]) => void;
  toggleVerb: (verb: string) => void;
    addSelectedVerbs: () => Promise<void>;
  taskList: Combinaison[];
  emptyTaskList: () => void;
  updateTaskAttempts: (taskId: string, numOfTentatives: number) => void;
  updateTaskIsRight: (taskId: string, isRight: boolean | null) => void;
}

// Create the context with a default value
const VerbsContext = createContext<VerbsContextType | undefined>(undefined);

// Provider component
export const VerbsProvider = ({ children }: { children: ReactNode }) => {
    const verbClient = useVerbClient();
    
    const [taskList, setTaskList] = useState<Combinaison[]>([]);
    const [selectedTense, setSelectedTense] = useState<string>("Passé Composé");
    const [allVerbs, setAllVerbs] = useState<string[]>([]);
    const [irregularByTense, setIrregularByTense] = useState<Record<string, string[]>>({});
    const [checkedVerbs, setCheckedVerbs] = useState<{ [verb: string]: boolean }>({});

    useEffect(() => {
        let isMounted = true;

        const loadVerbData = async () => {
            try {
                const [verbs, irregularMap] = await Promise.all([
                    verbClient.getVerbs(),
                    verbClient.getIrregularByTense(),
                ]);

                if (!isMounted) {
                    return;
                }

                setAllVerbs(verbs);
                setIrregularByTense(irregularMap);
                setCheckedVerbs(Object.fromEntries(verbs.map((verb, index) => [verb, index < 3])));
            } catch (error) {
                console.error('Could not load verbs data from backend:', error);
            }
        };

        void loadVerbData();

        return () => {
            isMounted = false;
        };
    }, [verbClient]);

    async function addSelectedVerbs() {
        try {
            const tasks = await fetchCombinaisons(selectedTense, availableVerbs);
            setTaskList((prevTasks) => [...prevTasks, ...tasks]);
        } catch (error) {
            console.error('Could not generate combinations from backend:', error);
        }
    }

    function emptyTaskList() {
        setTaskList([]);
    }

    function updateTaskAttempts(taskId: string, numOfTentatives: number) {
        setTaskList((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, numOfTentatives } : task
            )
        );
    }

    function updateTaskIsRight(taskId: string, isRight: boolean | null) {
        setTaskList((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, isRight } : task
            )
        );
    }

    console.log("taskList", taskList);

    const availableVerbs = Object.keys(checkedVerbs).filter(v => checkedVerbs[v]);

    const irregularVerbsForSelectedTense = irregularByTense[selectedTense] ?? [];

    const setAllCheckStatus = (checked: boolean) => {
        setCheckedVerbs(
            Object.fromEntries(
                allVerbs.map((verb) => [verb, checked])
            )
        );
    };

    const forceSelectVerbList = (verbs: string[]) => {
        setCheckedVerbs((prev) => {
            // Set all verbs to false
            const updated = Object.fromEntries(
                allVerbs.map((verb) => [verb, false])
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
                allVerbs,
        checkedVerbs,
        toggleVerb,
        availableVerbs,
                irregularByTense,
                irregularVerbsForSelectedTense,
        selectedTense,
        setSelectedTense,
        setAllCheckStatus,
        toggleVerbList,
        forceSelectVerbList,
        addSelectedVerbs,
        taskList,
        emptyTaskList,
        updateTaskAttempts,
        updateTaskIsRight
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
