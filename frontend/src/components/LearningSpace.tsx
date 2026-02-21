import { useState } from "react";
import styled from 'styled-components';
import { useVerbs } from "../contexts/useVerbs";
import VerbSelector from "./verbSelector/VerbSelector";
import PhraseExercise from "./PhraseExercise";
import DeleteIcon from '@mui/icons-material/Delete';

const Add = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
  font-style: italic;
  padding: 16px 27px;
  background-color: #242424;

  &:hover {
    background-color: #3a3a3a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    background-color: #414141;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
`;

const Arrow = styled.div`
  font-style: normal;
  font-size: 27px;
  color: #d1b48c;
  margin-top: -6px;
  margin-bottom: -12px;
  transition: transform 0.2s ease;

  ${Add}:hover & {
    transform: translateX(4px);
  }
`;

const AddContainer = styled.div`
  position: relative;
  padding: 0px 4px 0px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-left: -40px;
`;

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
  width: 100%;
  height: 100%;
`;

function LearningSpace() {
    const { availableVerbs, addSelectedVerbs, taskList, emptyTaskList } = useVerbs();

    return (
      <Container>
        <VerbSelector />
        <AddContainer>
          {taskList.length > 0 && (
            <DeleteIcon sx={{ position: 'absolute', top: 16, cursor: 'pointer', color: '#d1b48c' }} onClick={() => emptyTaskList()} />
          )}
          <Add onClick={() => addSelectedVerbs()}>
            <div>Click to add</div>
            <div>for practice</div>
            <Arrow>➤</Arrow>
          </Add>
        </AddContainer>
        <MainContent>
          {taskList.length > 0 ? (
            taskList.map((task, index) => (
              <PhraseExercise
                isSelected={false}
                key={task.id}
                phraseToShow={task.phraseToShow}
                verb={task.verb}
                subject={task.subject}
                conjuguatedVerbWithSubject={task.conjuguatedVerbWithSubject}
                availableVerbs={availableVerbs}
              />
            ))
          ) : (
            <NoVerbsMessage>
              Select verbs to practice from the selector on the left.
            </NoVerbsMessage>
          )}
        </MainContent>
      </Container>
    );
}

export default LearningSpace

