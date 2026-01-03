import styled from 'styled-components';
import { useVerbs } from '../../contexts/useVerbs';
import irregularVerbs from '../../tenses/passeCompose/irregularVerbs';

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
`;

const StyledButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #888;
  cursor: pointer;
  font-size: 1em;
  padding: 2px 8px;
`;

function IrregularVerbsButton() {
  const { forceSelectVerbList } = useVerbs();

  return (
    <ButtonWrapper>
      <StyledButton onClick={() => forceSelectVerbList(irregularVerbs.passeCompose)}>
        Irregular verbs
      </StyledButton>
    </ButtonWrapper>
  );
}

export default IrregularVerbsButton;
