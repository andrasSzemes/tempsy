import { useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import { useVerbs } from "../contexts/useVerbs";
import { useCombinaison } from "../hooks/useCombinaison";
import VerbSelector from "./verbSelector/VerbSelector";

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
  justify-content: center;
  display: flex;
  align-items: center;
`;

const Phrase = styled.div`
  display: flex;
  align-items: end;
`;

const ActivePartContainer = styled.div`
  margin: 0px 5px;
  display: flex;
  flex-direction: column;
`;

const Replace = styled.div`
  font-style: italic;
`;

const StyledInput = styled.input<{ $isRight: boolean | null }>`
  color: ${props => 
    props.$isRight === null ? 'inherit' : 
    props.$isRight ? 'green' : 'red'
  };
`;

const NoVerbsMessage = styled.div`
  padding: 2em;
  color: gray;
`;

function LearningSpace() {
    const [tense, setTense] = useState('passé composé');
    const { availableVerbs, /*decreaseCount */ addSelectedVerbs } = useVerbs();
    const { verb, conjuguatedVerbWithSubject, phraseToShow, subject, nextCombinaison } = useCombinaison(tense, availableVerbs);

    // program states
    const [isRight, setIsRight] = useState<null | boolean>(null);
    const [numOfTentatives, setNumOfTentatives] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (numOfTentatives >= 3 && inputRef.current) {
            inputRef.current.value = conjuguatedVerbWithSubject;
            setIsRight(true);
        }
    }, [numOfTentatives]);

    useEffect(() => {
        if (availableVerbs.length > 0 && !availableVerbs.includes(verb || '')) {
            nextCombinaison();
            setIsRight(null);
            setNumOfTentatives(0);
            if (inputRef?.current) {
                inputRef.current.value = "";
            }
        }
        if (availableVerbs.length === 0) {
            nextCombinaison();
            setIsRight(null);
            setNumOfTentatives(0);
        }
    }, [availableVerbs]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputRef.current) {
            if (inputRef.current.value.length > 0) {
                if (conjuguatedVerbWithSubject == inputRef.current.value.toLowerCase()) {
                    setIsRight(true);
                    if (verb) {
                        // decreaseCount(verb);
                    }
                    setTimeout(() => {
                        nextCombinaison();
                        setIsRight(null);
                        setNumOfTentatives(0);
                        if (inputRef?.current) {
                            inputRef.current.value = "";
                        }
                    }, 1000);
                } else {
                    setNumOfTentatives(current => current + 1)
                    setIsRight(false);
                }
            } else {
                setNumOfTentatives(current => current + 1)
            }
        }
    };

    const firstPart = phraseToShow.split('(')[0];
    const secondPart = phraseToShow.split(')')[1];

    return (
      <>
        <VerbSelector />
        <AddContainer>
          <Add onClick={() => addSelectedVerbs()}>
            <div>Click to add</div>
            <div>for practice</div>
            <Arrow>➤</Arrow>
          </Add>
        </AddContainer>
        <MainContent>
          {verb ? (
            <Phrase>
              <div>{firstPart}</div>
              <ActivePartContainer>
                <Replace>
                  {!isRight ? subject + ', ' + verb : '‎'}
                </Replace>
                <div>
                  <StyledInput
                    $isRight={isRight}
                    type="text"
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </ActivePartContainer>
              <div>{secondPart}</div>
            </Phrase>
          ) : (
            <NoVerbsMessage>
              Please select at least one verb.
            </NoVerbsMessage>
          )}
        </MainContent>
      </>
    );
}

export default LearningSpace

