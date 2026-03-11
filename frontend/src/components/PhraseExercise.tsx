import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useVerbs } from '../contexts/useVerbs';
import { useUser } from '../contexts/useUser';
import { usePracticeClient } from '../contexts/clientProviders/usePracticeClient';

const Phrase = styled.div<{ onClick?: () => void; $isRight?: boolean | null }>`
  display: flex;
  align-items: end;
  margin: 32px 0px;
  cursor: ${props => props.onClick && props.$isRight !== true ? 'pointer' : 'default'};
`;

const ActivePartContainer = styled.div`
  margin: 0px 5px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 8px;
  font-weight: bold;
`;

const Replace = styled.div`
  font-style: italic;
`;

const CollapsedReplace = styled(Replace)`
  padding: 0 8px;
  font-weight: bold;
  position: relative;
`;

const TenseLabel = styled.div`
  font-size: 0.75rem;
  text-align: center;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  white-space: nowrap;
  font-style: italic;
`;

const StyledInput = styled.input<{ $isRight: boolean | null }>`
  color: ${(props) =>
    props.$isRight === null ? 'rgba(255, 255, 255, 0.87)' : props.$isRight ? 'green' : 'red'};
  border: 1px solid #555;
  border-radius: 4px;
  background: #1f1f1f;

  &:focus {
    outline: none;
    border-color: #d2b48c;
    box-shadow: 0 0 0 2px rgba(210, 180, 140, 0.35);
  }
`;

interface PhraseExerciseProps {
  isSelected?: boolean;
  phraseToShow: string;
  verb: string;
  subject: string;
  conjuguatedVerbWithSubject: string;
  availableVerbs: string[];
  tense: string;
  taskId?: string;
  numOfTentatives?: number;
  isRight?: boolean | null;
  onClick?: () => void;
}

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

function PhraseExercise({
  isSelected,
  phraseToShow,
  verb,
  subject,
  conjuguatedVerbWithSubject,
  availableVerbs,
  tense,
  taskId,
  numOfTentatives = 0,
  isRight = null,
  onClick,
}: PhraseExerciseProps) {
  const { updateTaskAttempts, updateTaskIsRight } = useVerbs();
  const { isLoggedIn } = useUser();
  const practiceClient = usePracticeClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const firstPart = phraseToShow.split('(')[0];
  const secondPart = phraseToShow.split(')')[1];
  const isResolved = isRight !== null;
  const canTypeAnswer = isSelected && isRight === null;

  const sendPracticeResult = (success: boolean) => {
    if (!isLoggedIn) {
      return;
    }

    void practiceClient.savePractice({
      verb,
      tense,
      subject,
      success,
    }).catch((error) => {
      console.error('Could not save practice result:', error);
    });
  };
  
  const displayConjugation = firstPart === '' 
    ? capitalizeFirst(conjuguatedVerbWithSubject)
    : conjuguatedVerbWithSubject;

  useEffect(() => {
    if (isSelected) {
      inputRef.current?.focus();
    }
  }, [isSelected]);

  // useEffect(() => {
  //   if (numOfTentatives >= 3 && inputRef.current) {
  //     inputRef.current.value = conjuguatedVerbWithSubject;
  //     if (taskId) updateTaskIsRight(taskId, true);
  //   }
  // }, [numOfTentatives, conjuguatedVerbWithSubject, taskId, updateTaskIsRight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      if (inputRef.current.value.length > 0) {
        if (
          conjuguatedVerbWithSubject == inputRef.current.value.toLowerCase()
        ) {
          if (taskId) {
            updateTaskIsRight(taskId, true);
            sendPracticeResult(true);
          }
          setTimeout(() => {
            // nextCombinaison();
            // TODO CHECK IF WORKS


            // if (taskId) {
            //   updateTaskIsRight(taskId, null);
            //   updateTaskAttempts(taskId, 0);
            // }
            // if (inputRef?.current) {
            //   inputRef.current.value = '';
            // }
          }, 1000);
        } else {
          if (taskId) {
            const nextAttempts = numOfTentatives + 1;
            updateTaskAttempts(taskId, nextAttempts);
            if (nextAttempts >= 3) {
              updateTaskIsRight(taskId, false);
              sendPracticeResult(false);
            }
          }
        }
      } else {
        if (taskId) {
          const nextAttempts = numOfTentatives + 1;
          updateTaskAttempts(taskId, nextAttempts);
          if (nextAttempts >= 3) {
            updateTaskIsRight(taskId, false);
            sendPracticeResult(false);
          }
        }
      }
    }
  };

  return (
    <Phrase onClick={isRight === true ? undefined : onClick} $isRight={isRight}>
      <div>{firstPart}</div>


      {isResolved && (
        <CollapsedReplace>
          <div style={{color: isRight ? 'green' : 'red'}}>{displayConjugation}</div>
          <TenseLabel>{tense}</TenseLabel>
        </CollapsedReplace>
      )}

      {!isResolved && !isSelected && (
        <CollapsedReplace>
          <div>({!isRight ? subject + ', ' + verb : '‎'})</div>
          <TenseLabel>{tense}</TenseLabel>
        </CollapsedReplace>
      )}

      {canTypeAnswer && (
        <ActivePartContainer>
          <Replace>{!isRight ? subject + ', ' + verb : '‎'}</Replace>
          <div>
            <StyledInput
              $isRight={isRight}
              type="text"
              ref={inputRef}
              onKeyDown={handleKeyDown}
            />
          </div>
          <TenseLabel>{tense}</TenseLabel>
        </ActivePartContainer>
      )}
      <div>{secondPart}</div>
    </Phrase>
  );
}

export default PhraseExercise;
