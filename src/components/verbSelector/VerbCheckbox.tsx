import styled from 'styled-components';
import { useVerbs } from '../../contexts/useVerbs';

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CheckboxWrapper = styled.div``;

interface VerbCheckboxProps {
  verb: string;
}

function VerbCheckbox({ verb }: VerbCheckboxProps) {
  const { checkedVerbs, toggleVerb } = useVerbs();

  return (
    <CheckboxContainer>
      <CheckboxWrapper>
        <input
          type="checkbox"
          id={verb}
          name={verb}
          checked={!!checkedVerbs[verb]}
          onChange={() => toggleVerb(verb)}
        />
        <label htmlFor={verb}>{verb}</label>
      </CheckboxWrapper>
    </CheckboxContainer>
  );
}

export default VerbCheckbox;
