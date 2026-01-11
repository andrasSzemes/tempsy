import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useVerbs } from "../contexts/useVerbs";
import PhraseExercise from "./PhraseExercise";

const MainContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
  padding: 16px;
`;

const NoVerbsMessage = styled.div`
  padding: 2em;
  color: gray;
  margin: auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

function Study() {
  const { availableVerbs, taskList } = useVerbs();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const currentTask = taskList.find(task => task.id === selectedTaskId);
    const currentTaskExists = !!currentTask;
    const currentTaskIsRight = currentTask?.isRight === true;
    
    if (!currentTaskExists || currentTaskIsRight) {
      const firstIncompleteTask = taskList.find(task => task.isRight !== true);
      setSelectedTaskId(firstIncompleteTask ? firstIncompleteTask.id : null);
    }
  }, [taskList, selectedTaskId]);

  return (
    <Container>
      <MainContent>
        {taskList.length > 0 ? (
          taskList.map((task, index) => (
            <PhraseExercise
              isSelected={task.id === selectedTaskId}
              key={task.id}
              phraseToShow={task.phraseToShow}
              verb={task.verb}
              subject={task.subject}
              conjuguatedVerbWithSubject={task.conjuguatedVerbWithSubject}
              availableVerbs={availableVerbs}
              taskId={task.id}
              numOfTentatives={task.numOfTentatives}
              isRight={task.isRight}
              onClick={() => setSelectedTaskId(task.id)}
            />
          ))
        ) : (
          <NoVerbsMessage>
            No practice tasks yet. Go to Learning Space to add verbs for practice.
          </NoVerbsMessage>
        )}
      </MainContent>
    </Container>
  );
}

export default Study;
