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
      const currentIndex = taskList.findIndex(task => task.id === selectedTaskId);
      
      // Try to find next incomplete task after current position
      let nextIncompleteTask = taskList.slice(currentIndex + 1).find(task => task.isRight !== true);
      
      // If no task after, try to find previous incomplete task
      if (!nextIncompleteTask && currentIndex > 0) {
        nextIncompleteTask = taskList.slice(0, currentIndex).reverse().find(task => task.isRight !== true);
      }
      
      setSelectedTaskId(nextIncompleteTask ? nextIncompleteTask.id : null);
    }
  }, [taskList, selectedTaskId]);

  return (
    <Container>
      <MainContent>
        {taskList.length > 0 && (
          <span style={{fontSize: '16px', color: '#d1b48c', marginBottom: '12px', fontWeight: 500}}>Setup</span>
        )}
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
              tense={task.tense}
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
