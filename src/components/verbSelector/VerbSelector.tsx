import 'styled-components';
import styled from 'styled-components';
import { conjugaisonPasseCompose } from '../../sencetcePieces/passeCompose/conjugaison';
import { useVerbs } from '../../contexts/useVerbs';
import SelectAllCheckbox from './SelectAllCheckbox';
import IrregularVerbsButton from './IrregularVerbsButton';
import VerbCheckbox from './VerbCheckbox';

// const reflexiveVerbs = ['se lever', 'se coucher', 's’habiller', 'se laver', 'se brosser', 'se réveiller', 'se reposer', 'se dépêcher', 'se souvenir de', 'se rendre compte de', 's’intéresser à', 's’ennuyer', 'se fâcher', 'se tromper', 'se taire', 's’asseoir', 's’entendre avec', 'se disputer (avec)', 'se marier (avec)', 'se divorcer', 'se battre', 's’en aller', 'se rendre', 'se servir de', 's’apercevoir de', 'se douter de', 'se passer de', 'se trouver', 'se mettre à', 'se faire à', 'se demander', 'se plaindre de', 'se voir', 's’imaginer', 's’efforcer de', 's’évanouir', 's’indigner', 's’apercevoir que', 's’épanouir', 's’en sortir', 's’attendre à', 's’interroger sur', 'se heurter à', 'se méfier de', 'se replier sur soi-même', 'se raviser', 'se débrouiller', 'se réconcilier', 'se précipiter', 'se figurer'];

// const COIverbsÀ = [ 'appartenir', 'convenir', 'demander', 'dire', 'donner', 'écrire', 'emprunter', 'envoyer', 'offrir', 'parler', 'plaire', 'poser', 'prêter', 'proposer', 'raconter', 'rappeler', 'répondre', 'ressembler', 'souhaiter', 'téléphoner'];
// const targetY = [ 'assister', 'croire', 'faire attention', 'jouer', 'obéir', 'participer', 'penser', 'réfléchir', 'répondre', 'réussir', 's’intéresser', 'tenir' ];
// const targetEn = [ 'avoir besoin', 'avoir envie', 'avoir peur', 'dépendre', 'discuter', 'entendre parler', 'manquer', 'parler', 'profiter', 'rêver', 'se souvenir', 's’occuper', 'se passer' ];

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
  const {
    /*verbCounters, setVerbCounters */
  } = useVerbs();

  return (
    <Container>
      <ControlsHeader>
        <div>
          <SelectAllCheckbox />
          <IrregularVerbsButton />
        </div>
      </ControlsHeader>
      <VerbList>
        {Object.keys(conjugaisonPasseCompose).map((verb) => (
          <VerbCheckbox key={verb} verb={verb} />
        ))}
      </VerbList>
    </Container>
  );
}

export default VerbSelector;
