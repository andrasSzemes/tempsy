import styled from 'styled-components';
import { useVerbs } from '../../contexts/useVerbs';

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 5px 5px 5px;
`;

const StyledLabel = styled.label`
  cursor: pointer;
  width: 105px;
  text-align: left;
`;

function SelectAllCheckbox() {
  const { checkedVerbs, setAllCheckStatus } = useVerbs();

  return (
    <CheckboxWrapper>
      <StyledLabel>
        <input
          type="checkbox"
          checked={Object.values(checkedVerbs).every(Boolean)}
          onChange={(e) => setAllCheckStatus(e.target.checked)}
        />
        {Object.values(checkedVerbs).every(Boolean)
          ? 'Deselect all'
          : 'Select all'}
      </StyledLabel>
    </CheckboxWrapper>
  );
}

export default SelectAllCheckbox;
