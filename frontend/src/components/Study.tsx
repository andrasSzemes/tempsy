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

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 16px 0;
`;

const ProgressTrack = styled.div`
  width: 100%;
  max-width: 700px;
  height: 20px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  position: relative;
`;

const SolvedProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  background: rgba(255, 255, 255, 0.12);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  transition: width 200ms ease;
  overflow: hidden;
`;

const WrongProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  background: rgba(220, 53, 69, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 200ms ease;
`;

const CorrectProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  background: rgba(40, 167, 69, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 200ms ease;
`;

const SegmentCount = styled.span`
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  text-shadow: 0 1px 4px rgba(0,0,0,0.7), 0 0px 2px rgba(0,0,0,0.5);
`;

const ProgressLabel = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 6px auto 0;
  font-size: 0.78rem;
  text-align: right;
  color: rgba(255, 255, 255, 0.75);
`;

function Study() {
  const { availableVerbs, taskList } = useVerbs();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const correctTaskCount = taskList.filter((task) => task.isRight === true).length;
  const wrongTaskCount = taskList.filter((task) => task.isRight === false).length;
  const solvedTaskCount = correctTaskCount + wrongTaskCount;
  const solvedPercent = taskList.length > 0 ? (solvedTaskCount / taskList.length) * 100 : 0;
  const wrongPercent = taskList.length > 0 ? (wrongTaskCount / taskList.length) * 100 : 0;
  const correctPercent = taskList.length > 0 ? (correctTaskCount / taskList.length) * 100 : 0;
  const wrongPercentWithinSolved = solvedTaskCount > 0 ? (wrongTaskCount / solvedTaskCount) * 100 : 0;
  const correctPercentWithinSolved = solvedTaskCount > 0 ? (correctTaskCount / solvedTaskCount) * 100 : 0;

  useEffect(() => {
    const currentTask = taskList.find(task => task.id === selectedTaskId);
    const currentTaskExists = !!currentTask;
    const currentTaskIsResolved = currentTask?.isRight !== null;
    
    if (!currentTaskExists || currentTaskIsResolved) {
      const currentIndex = taskList.findIndex(task => task.id === selectedTaskId);
      
      // Try to find next unresolved task after current position
      let nextIncompleteTask = taskList.slice(currentIndex + 1).find(task => task.isRight === null);
      
      // If no task after, try to find previous unresolved task
      if (!nextIncompleteTask && currentIndex > 0) {
        nextIncompleteTask = taskList.slice(0, currentIndex).reverse().find(task => task.isRight === null);
      }
      
      setSelectedTaskId(nextIncompleteTask ? nextIncompleteTask.id : null);
    }
  }, [taskList, selectedTaskId]);

  return (
    <Container>
      {taskList.length > 0 && (
        <>
          <ProgressContainer>
            <ProgressTrack>
              <SolvedProgressFill $percent={solvedPercent}>
                <WrongProgressFill $percent={wrongPercentWithinSolved}>
                  {wrongTaskCount > 0 && <SegmentCount>{wrongTaskCount}</SegmentCount>}
                </WrongProgressFill>
                <CorrectProgressFill $percent={correctPercentWithinSolved}>
                  {correctTaskCount > 0 && <SegmentCount>{correctTaskCount}</SegmentCount>}
                </CorrectProgressFill>
              </SolvedProgressFill>
            </ProgressTrack>
          </ProgressContainer>
          <ProgressLabel>{solvedTaskCount} / {taskList.length}</ProgressLabel>
        </>
      )}
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
              tense={task.tense}
            />
          ))
        ) : (
          <NoVerbsMessage>
            No practice tasks yet. Go to Setup to add verbs for practice.
          </NoVerbsMessage>
        )}
      </MainContent>
    </Container>
  );
}

export default Study;
