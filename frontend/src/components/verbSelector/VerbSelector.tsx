import 'styled-components';
import styled from 'styled-components';
import { FormControl, MenuItem, Select } from '@mui/material';
import { useVerbs } from '../../contexts/useVerbs';
import { useLanguage } from '../../contexts/useLanguage';
import SelectAllCheckbox from './SelectAllCheckbox';
import IrregularVerbsButton from './IrregularVerbsButton';
import VerbCheckbox from './VerbCheckbox';

const Container = styled.div`
  width: 200px;
  box-shadow: 10px 0 8px rgba(95, 95, 95, 0.1);
  display: flex;
  flex-direction: column;
`;

const ControlsHeader = styled.div`
  text-align: center;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const VerbList = styled.div`
  overflow: scroll;
  padding: 0px 5px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

function VerbSelector() {
  const { allVerbs, allTenses } = useLanguage();
  const {
    selectedTense,
    setSelectedTense,
  } = useVerbs();

  return (
    <Container>
      <ControlsHeader>
        <div>
          <FormControl fullWidth size="small" sx={{ pt: '3px', mb: 1 }}>
            <Select
            aria-label="Select tense"
            value={selectedTense}
            onChange={(event) => setSelectedTense(event.target.value)}
            MenuProps={{
              anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
              transformOrigin: { vertical: 'top', horizontal: 'left' },
              PaperProps: {
                sx: {
                  mt: 0.5,
                },
              },
            }}
            sx={{
              fontSize: '16px',
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              boxShadow: 'none',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.15)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.35)',
              },
              '&.Mui-focused': {
                boxShadow: 'none',
                outline: 'none',
              },
              '& .MuiSelect-icon': {
                color: 'white',
              },
            }}
          >
            {allTenses.map((tense) => (
              <MenuItem key={tense} value={tense}>{tense}</MenuItem>
            ))}
          </Select>
          </FormControl>
          <SelectAllCheckbox />
          <IrregularVerbsButton />
        </div>
      </ControlsHeader>
      <VerbList>
        {allVerbs.map((verb) => (
          <VerbCheckbox key={verb} verb={verb} />
        ))}
      </VerbList>
    </Container>
  );
}

export default VerbSelector;
