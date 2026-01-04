import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Phrase = styled.div`
  display: flex;
  align-items: end;
  margin: 32px 0px;
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
  nextCombinaison: () => void;
  availableVerbs: string[];
}

function PhraseExercise({
  isSelected,
  phraseToShow,
  verb,
  subject,
  conjuguatedVerbWithSubject,
  nextCombinaison,
  availableVerbs,
}: PhraseExerciseProps) {
  const [isRight, setIsRight] = useState<null | boolean>(null);
  const [numOfTentatives, setNumOfTentatives] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const firstPart = phraseToShow.split('(')[0];
  const secondPart = phraseToShow.split(')')[1];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (numOfTentatives >= 3 && inputRef.current) {
      inputRef.current.value = conjuguatedVerbWithSubject;
      setIsRight(true);
    }
  }, [numOfTentatives, conjuguatedVerbWithSubject]);

  useEffect(() => {
    if (availableVerbs.length > 0 && !availableVerbs.includes(verb || '')) {
      nextCombinaison();
      setIsRight(null);
      setNumOfTentatives(0);
      if (inputRef?.current) {
        inputRef.current.value = '';
      }
    }
    if (availableVerbs.length === 0) {
      nextCombinaison();
      setIsRight(null);
      setNumOfTentatives(0);
    }
  }, [availableVerbs, verb, nextCombinaison]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      if (inputRef.current.value.length > 0) {
        if (
          conjuguatedVerbWithSubject == inputRef.current.value.toLowerCase()
        ) {
          setIsRight(true);
          setTimeout(() => {
            nextCombinaison();
            setIsRight(null);
            setNumOfTentatives(0);
            if (inputRef?.current) {
              inputRef.current.value = '';
            }
          }, 1000);
        } else {
          setNumOfTentatives((current) => current + 1);
          setIsRight(false);
        }
      } else {
        setNumOfTentatives((current) => current + 1);
      }
    }
  };

  return (
    <Phrase>
      <div>{firstPart}</div>

      {!isSelected && (
        <CollapsedReplace>
          <div>({!isRight ? subject + ', ' + verb : '‎'})</div>
          <TenseLabel>passé composé</TenseLabel>
        </CollapsedReplace>
      )}

      {isSelected && (
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
