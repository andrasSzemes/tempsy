import styled from 'styled-components';
import { useVerbs } from '../../contexts/useVerbs';

const ButtonWrapper = styled.div`
  padding: 0 0 8px 0;
`;

const ToggleButton = styled.button`
  width: 100%;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

function SelectAllCheckbox() {
  const { checkedVerbs, setAllCheckStatus } = useVerbs();
  const allChecked = Object.values(checkedVerbs).every(Boolean);

  return (
    <ButtonWrapper>
      <ToggleButton type="button" onClick={() => setAllCheckStatus(!allChecked)}>
        {allChecked ? 'Deselect all' : 'Select all'}
      </ToggleButton>
    </ButtonWrapper>
  );
}

export default SelectAllCheckbox;
