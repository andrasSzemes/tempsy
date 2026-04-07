import styled from 'styled-components';
import { useVerbs } from "../contexts/useVerbs";
import { useUser } from '../contexts/useUser';
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
  font-size: 14px;

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
  color: #fff;
  margin: auto;
  user-select: none;
  width: 100%;
  max-width: 920px;
`;

const EmptyStateGrid = styled.div`
  display: flex;
  gap: 18px;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
`;

const InfoCard = styled.div`
  flex: 1 1 320px;
  max-width: 430px;
  min-height: 250px;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid rgba(209, 180, 140, 0.45);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 1.45;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.div`
  color: #f3d7ac;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
`;

const CardBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const TaskRow = styled.div`
  width: 100%;
  max-width: 980px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #c78d86;
  }
`;

const DeleteBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: #b66f67;
`;

const RowDeleteIcon = styled(DeleteIcon)`
  font-size: 18px !important;
`;

const TaskRowInner = styled.div`
  display: flex;
  justify-content: center;

  ${TaskRow}:hover & + ${DeleteBadge} {
    opacity: 1;
  }
`;

function Setup() {
  const { availableVerbs, addSelectedVerbs, taskList, removeTask } = useVerbs();
  const { isLoggedIn } = useUser();

    return (
      <Container>
        <VerbSelector />
        <AddContainer>
          <Add onClick={() => void addSelectedVerbs()}>
            <div>Click to add</div>
            <div>for practice</div>
            <Arrow>➤</Arrow>
          </Add>
        </AddContainer>
        <MainContent>
          {taskList.length > 0 ? (
            taskList.map((task) => (
              <TaskRow key={task.id} onClick={() => removeTask(task.id)} title="Remove task">
                <TaskRowInner>
                  <PhraseExercise
                    isSelected={false}
                    phraseToShow={task.phraseToShow}
                    verb={task.verb}
                    subject={task.subject}
                    conjuguatedVerbWithSubject={task.conjuguatedVerbWithSubject}
                    availableVerbs={availableVerbs}
                    tense={task.tense}
                  />
                </TaskRowInner>
                <DeleteBadge>
                  <RowDeleteIcon />
                </DeleteBadge>
              </TaskRow>
            ))
          ) : (
            <NoVerbsMessage>
              <EmptyStateGrid>
                <InfoCard>
                  <CardTitle>1. SETUP</CardTitle>
                  <CardBody>
                    Select tense
                    <br />
                    <span style={{ fontStyle: 'italic', fontSize: 13 }}>- Passe Compose, Present, ... -</span>
                    {isLoggedIn && (
                      <>
                        <br />
                        <span>Choose <b><i>Tailored</i></b> mode to practice only</span>
                        not reviewed or not mastered conjugations
                        <br />
                      </>
                    )}
                    <br />
                    Select verbs
                    <br />
                    <br />
                    Click on the arrow
                    <br />
                    to add them to the task list
                  </CardBody>
                </InfoCard>

                <InfoCard>
                  <CardTitle>2. PRACTICE</CardTitle>
                  <CardBody>
                    Click on the left side on "Practice" to start learning.
                    <br />
                    <br />
                    You will have three chances to try each conjugation,
                    <br />
                    then the correct answer will be shown.
                    <br />
                    <br />
                    Good luck!
                  </CardBody>
                </InfoCard>
              </EmptyStateGrid>
            </NoVerbsMessage>
          )}
        </MainContent>
      </Container>
    );
}

export default Setup

