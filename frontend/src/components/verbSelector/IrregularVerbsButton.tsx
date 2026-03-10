import styled from 'styled-components';
import { useVerbs } from '../../contexts/useVerbs';

const ButtonWrapper = styled.div`
  padding: 0 0 8px 0;
`;

const StyledButton = styled.button`
  width: 100%;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

function IrregularVerbsButton() {
  const { forceSelectVerbList, irregularVerbsForSelectedTense } = useVerbs();
  console.log('Irregular verbs for selected tense:', irregularVerbsForSelectedTense);

  return (
    <ButtonWrapper>
      <StyledButton type="button" onClick={() => forceSelectVerbList(irregularVerbsForSelectedTense)}>
        Irregular verbs
      </StyledButton>
    </ButtonWrapper>
  );
}

export default IrregularVerbsButton;
