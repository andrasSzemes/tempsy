import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useVerbs } from '../contexts/useVerbs';

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
`;

const StyledInput = styled.input<{ $isRight: boolean | null }>`
  color: ${(props) =>
    props.$isRight === null ? 'inherit' : props.$isRight ? 'green' : 'red'};
`;

interface PhraseExerciseProps {
  isSelected?: boolean;
  phraseToShow: string;
  verb: string;
  subject: string;
  conjuguatedVerbWithSubject: string;
  availableVerbs: string[];
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
  taskId,
  numOfTentatives = 0,
  isRight = null,
  onClick,
}: PhraseExerciseProps) {
  const { updateTaskAttempts, updateTaskIsRight } = useVerbs();
  const inputRef = useRef<HTMLInputElement>(null);

  const firstPart = phraseToShow.split('(')[0];
  const secondPart = phraseToShow.split(')')[1];
  
  const displayConjugation = firstPart === '' 
    ? capitalizeFirst(conjuguatedVerbWithSubject)
    : conjuguatedVerbWithSubject;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (numOfTentatives >= 3 && inputRef.current) {
      inputRef.current.value = conjuguatedVerbWithSubject;
      if (taskId) updateTaskIsRight(taskId, true);
    }
  }, [numOfTentatives, conjuguatedVerbWithSubject, taskId, updateTaskIsRight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      if (inputRef.current.value.length > 0) {
        if (
          conjuguatedVerbWithSubject == inputRef.current.value.toLowerCase()
        ) {
          if (taskId) updateTaskIsRight(taskId, true);
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
            updateTaskAttempts(taskId, numOfTentatives + 1);
            updateTaskIsRight(taskId, false);
          }
        }
      } else {
        if (taskId) updateTaskAttempts(taskId, numOfTentatives + 1);
      }
    }
  };

  return (
    <Phrase onClick={isRight === true ? undefined : onClick} $isRight={isRight}>
      <div>{firstPart}</div>

      {isRight && (
        <CollapsedReplace>
          <div style={{color: 'green'}}>{displayConjugation}</div>
          <TenseLabel>passé composé</TenseLabel>
        </CollapsedReplace>
      )}

      {!isRight && !isSelected && (
        <CollapsedReplace>
          <div>({!isRight ? subject + ', ' + verb : '‎'})</div>
          <TenseLabel>passé composé</TenseLabel>
        </CollapsedReplace>
      )}

      {!isRight && isSelected && (
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
        </ActivePartContainer>
      )}
      <div>{secondPart}</div>
    </Phrase>
  );
}

export default PhraseExercise;
