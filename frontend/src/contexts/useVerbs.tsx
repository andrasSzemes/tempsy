import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchCombinaisons, type Combinaison } from "../services/combinaisonService";
import { useLanguage } from "./useLanguage";

// Define the shape of the verbs context
interface VerbsContextType {
    checkedVerbs: { [verb: string]: boolean };
    availableVerbs: string[];
    irregularVerbsForSelectedTense: string[];
    selectedTense: string;
    setSelectedTense: (tense: string) => void;
    setAllCheckStatus: (checked: boolean) => void;
    toggleVerbList: (verbs: string[]) => void;
    forceSelectVerbList: (verbs: string[]) => void;
    toggleVerb: (verb: string) => void;
    addSelectedVerbs: () => Promise<void>;
    isTailoredSetupEnabled: boolean;
    setTailoredSetupEnabled: (enabled: boolean) => void;
    taskList: Combinaison[];
    emptyTaskList: () => void;
    resetTaskList: () => void;
    isTaskListResetable: boolean;
    updateTaskAttempts: (taskId: string, numOfTentatives: number) => void;
    updateTaskIsRight: (taskId: string, isRight: boolean | null) => void;
}

// Create the context with a default value
const VerbsContext = createContext<VerbsContextType | undefined>(undefined);

// Provider component
export const VerbsProvider = ({ children }: { children: ReactNode }) => {
    const { allVerbs, allTenses, irregularByTense } = useLanguage();

    const [taskList, setTaskList] = useState<Combinaison[]>([]);
    const [selectedTense, setSelectedTense] = useState<string>("Passé Composé");
    const [checkedVerbs, setCheckedVerbs] = useState<{ [verb: string]: boolean }>({});
    const [isTailoredSetupEnabled, setTailoredSetupEnabled] = useState(false);

    useEffect(() => {
        if (allVerbs.length === 0) {
            setCheckedVerbs({});
            return;
        }

        setCheckedVerbs((prev) => {
            const next: { [verb: string]: boolean } = {};
            allVerbs.forEach((verb, index) => {
                next[verb] = prev[verb] ?? index < 3;
            });
            return next;
        });
    }, [allVerbs]);

    useEffect(() => {
        if (allTenses.length > 0 && !allTenses.includes(selectedTense)) {
            setSelectedTense(allTenses.includes('Passé Composé') ? 'Passé Composé' : allTenses[0]);
        }
    }, [allTenses, selectedTense]);

    async function addSelectedVerbs() {
        try {
            const tasks = await fetchCombinaisons(selectedTense, availableVerbs, isTailoredSetupEnabled);
            setTaskList((prevTasks) => [...prevTasks, ...tasks]);
        } catch (error) {
            console.error('Could not generate combinations from backend:', error);
        }
    }

    function emptyTaskList() {
        setTaskList([]);
    }

    function resetTaskList() {
        setTaskList((prevTasks) =>
            prevTasks.map((task) => ({
                ...task,
                numOfTentatives: 0,
                isRight: null,
            }))
        );
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

        const isTaskListResetable = taskList.some(
            (task) => task.numOfTentatives !== 0 || task.isRight !== null
        );

        return (
            <VerbsContext.Provider value={{
                checkedVerbs,
                toggleVerb,
                availableVerbs,
                irregularVerbsForSelectedTense,
                selectedTense,
                setSelectedTense,
                setAllCheckStatus,
                toggleVerbList,
                forceSelectVerbList,
                addSelectedVerbs,
                isTailoredSetupEnabled,
                setTailoredSetupEnabled,
                taskList,
                emptyTaskList,
                resetTaskList,
                isTaskListResetable,
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
