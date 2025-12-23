import 'styled-components';
import styled from 'styled-components';
import { conjugaisonPasseCompose } from '../sencetcePieces/passeCompose/conjugaison';
import { useVerbs } from '../contexts/useVerbs';

const irregularVerbs = [
  'avoir',
  'être',
  'faire',
  'mettre',
  'prendre',
  'dire',
  'écrire',
  'voir',
  'pouvoir',
  'vouloir',
  'savoir',
  'connaître',
  'venir',
  'devoir',
  'croire',
  'boire',
  'lire',
  'vivre',
  'recevoir',
  'ouvrir',
  'offrir',
  'naître',
  'mourir',
  'tenir',
  'suivre',
  'rire',
  'plaire',
  'falloir',
  'valoir',
  'pleuvoir',
  'apprendre',
  'comprendre',
  'surprendre',
  'découvrir',
  'souffrir',
  'conduire',
  'produire',
  'traduire',
  'atteindre',
  'craindre',
  'éteindre',
  'joindre',
  'peindre',
  'clore',
  'inclure',
  'cuire',
  'resoudre',
  'absoudre',
];

// const reflexiveVerbs = ['se lever', 'se coucher', 's’habiller', 'se laver', 'se brosser', 'se réveiller', 'se reposer', 'se dépêcher', 'se souvenir de', 'se rendre compte de', 's’intéresser à', 's’ennuyer', 'se fâcher', 'se tromper', 'se taire', 's’asseoir', 's’entendre avec', 'se disputer (avec)', 'se marier (avec)', 'se divorcer', 'se battre', 's’en aller', 'se rendre', 'se servir de', 's’apercevoir de', 'se douter de', 'se passer de', 'se trouver', 'se mettre à', 'se faire à', 'se demander', 'se plaindre de', 'se voir', 's’imaginer', 's’efforcer de', 's’évanouir', 's’indigner', 's’apercevoir que', 's’épanouir', 's’en sortir', 's’attendre à', 's’interroger sur', 'se heurter à', 'se méfier de', 'se replier sur soi-même', 'se raviser', 'se débrouiller', 'se réconcilier', 'se précipiter', 'se figurer'];

// const COIverbsÀ = [ 'appartenir', 'convenir', 'demander', 'dire', 'donner', 'écrire', 'emprunter', 'envoyer', 'offrir', 'parler', 'plaire', 'poser', 'prêter', 'proposer', 'raconter', 'rappeler', 'répondre', 'ressembler', 'souhaiter', 'téléphoner'];
// const targetY = [ 'assister', 'croire', 'faire attention', 'jouer', 'obéir', 'participer', 'penser', 'réfléchir', 'répondre', 'réussir', 's’intéresser', 'tenir' ];
// const targetEn = [ 'avoir besoin', 'avoir envie', 'avoir peur', 'dépendre', 'discuter', 'entendre parler', 'manquer', 'parler', 'profiter', 'rêver', 'se souvenir', 's’occuper', 'se passer' ];

const LeftSideContainer = styled.div`
  width: 400px;
  border-right: #d1d1d1 1px solid;
  display: flex;
  flex-direction: row;
`;

function VerbSelector() {
  const { checkedVerbs, setCheckedVerbs, verbCounters, setVerbCounters } =
    useVerbs();

  return (
    <LeftSideContainer>
      <div>
        <div>
          <div
            style={{
              textAlign: 'center',
              padding: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '0 5px 5px 5px',
                }}
              >
                <label
                  style={{
                    cursor: 'pointer',
                    width: '105px',
                    textAlign: 'left',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={Object.values(checkedVerbs).every(Boolean)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCheckedVerbs(
                        Object.fromEntries(
                          Object.keys(conjugaisonPasseCompose).map((verb) => [
                            verb,
                            checked,
                          ]),
                        ),
                      );
                      setVerbCounters((prev) =>
                        Object.fromEntries(
                          Object.keys(conjugaisonPasseCompose).map((verb) => [
                            verb,
                            checked ? (prev[verb] === 0 ? 3 : prev[verb]) : 0,
                          ]),
                        ),
                      );
                    }}
                  />
                  {Object.values(checkedVerbs).every(Boolean)
                    ? 'Deselect all'
                    : 'Select all'}
                </label>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '8px',
                }}
              >
                <button
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    color: '#888',
                    cursor: 'pointer',
                    fontSize: '1em',
                    padding: '2px 8px',
                  }}
                  onClick={() =>
                    setVerbCounters((prev) =>
                      Object.fromEntries(
                        Object.keys(prev).map((verb) => [
                          verb,
                          checkedVerbs[verb] ? prev[verb] + 1 : prev[verb],
                        ]),
                      ),
                    )
                  }
                >
                  +
                </button>
                <button
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    color: '#888',
                    cursor: 'pointer',
                    fontSize: '1em',
                    padding: '2px 8px',
                  }}
                  onClick={() =>
                    setVerbCounters((prev) =>
                      Object.fromEntries(
                        Object.keys(prev).map((verb) => [
                          verb,
                          checkedVerbs[verb]
                            ? Math.max(0, prev[verb] - 1)
                            : prev[verb],
                        ]),
                      ),
                    )
                  }
                >
                  –
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '8px',
                }}
              >
                <button
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    color: '#888',
                    cursor: 'pointer',
                    fontSize: '1em',
                    padding: '2px 8px',
                  }}
                  onClick={() => {
                    const allIrregularSelected = irregularVerbs.every(
                      (v) => checkedVerbs[v],
                    );
                    setCheckedVerbs((prev) => {
                      const updated = { ...prev };
                      irregularVerbs.forEach((v) => {
                        if (v in updated) updated[v] = !allIrregularSelected;
                      });
                      return updated;
                    });
                    setVerbCounters((prev) => {
                      const updated = { ...prev };
                      irregularVerbs.forEach((v) => {
                        if (v in updated) {
                          updated[v] = !allIrregularSelected
                            ? prev[v] === 0
                              ? 3
                              : prev[v]
                            : 0;
                        }
                      });
                      return updated;
                    });
                  }}
                >
                  Irregular verbs
                </button>
              </div>
            </div>
          </div>
          <div style={{ overflow: 'scroll', padding: '0px 5px' }}>
            {Object.keys(conjugaisonPasseCompose).map((verb) => (
              <div
                key={verb}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    id={verb}
                    name={verb}
                    checked={!!checkedVerbs[verb]}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCheckedVerbs((prev) => {
                        const updated = { ...prev, [verb]: checked };
                        return updated;
                      });
                      setVerbCounters((prev) => ({
                        ...prev,
                        [verb]: checked
                          ? prev[verb] === 0
                            ? 3
                            : prev[verb]
                          : 0,
                      }));
                    }}
                  />
                  <label htmlFor={verb}>{verb}</label>
                </div>
                <span
                  style={{
                    marginLeft: 8,
                    minWidth: 16,
                    textAlign: 'right',
                    color: verbCounters[verb] === 0 ? '#d3d3d3' : '#b0b0b0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {verbCounters[verb]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div
            style={{
              textAlign: 'center',
              padding: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '0 5px 5px 5px',
                }}
              >
                <label
                  style={{
                    cursor: 'pointer',
                    width: '105px',
                    textAlign: 'left',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={Object.values(checkedVerbs).every(Boolean)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCheckedVerbs(
                        Object.fromEntries(
                          Object.keys(conjugaisonPasseCompose).map((verb) => [
                            verb,
                            checked,
                          ]),
                        ),
                      );
                      setVerbCounters((prev) =>
                        Object.fromEntries(
                          Object.keys(conjugaisonPasseCompose).map((verb) => [
                            verb,
                            checked ? (prev[verb] === 0 ? 3 : prev[verb]) : 0,
                          ]),
                        ),
                      );
                    }}
                  />
                  {Object.values(checkedVerbs).every(Boolean)
                    ? 'Deselect all'
                    : 'Select all'}
                </label>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '8px',
                }}
              >
                <button
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    color: '#888',
                    cursor: 'pointer',
                    fontSize: '1em',
                    padding: '2px 8px',
                  }}
                  onClick={() =>
                    setVerbCounters((prev) =>
                      Object.fromEntries(
                        Object.keys(prev).map((verb) => [
                          verb,
                          checkedVerbs[verb] ? prev[verb] + 1 : prev[verb],
                        ]),
                      ),
                    )
                  }
                >
                  +
                </button>
                <button
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    color: '#888',
                    cursor: 'pointer',
                    fontSize: '1em',
                    padding: '2px 8px',
                  }}
                  onClick={() =>
                    setVerbCounters((prev) =>
                      Object.fromEntries(
                        Object.keys(prev).map((verb) => [
                          verb,
                          checkedVerbs[verb]
                            ? Math.max(0, prev[verb] - 1)
                            : prev[verb],
                        ]),
                      ),
                    )
                  }
                >
                  –
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '8px',
                }}
              >
                <button
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    color: '#888',
                    cursor: 'pointer',
                    fontSize: '1em',
                    padding: '2px 8px',
                  }}
                  onClick={() => {
                    const allIrregularSelected = irregularVerbs.every(
                      (v) => checkedVerbs[v],
                    );
                    setCheckedVerbs((prev) => {
                      const updated = { ...prev };
                      irregularVerbs.forEach((v) => {
                        if (v in updated) updated[v] = !allIrregularSelected;
                      });
                      return updated;
                    });
                    setVerbCounters((prev) => {
                      const updated = { ...prev };
                      irregularVerbs.forEach((v) => {
                        if (v in updated) {
                          updated[v] = !allIrregularSelected
                            ? prev[v] === 0
                              ? 3
                              : prev[v]
                            : 0;
                        }
                      });
                      return updated;
                    });
                  }}
                >
                  Irregular verbs
                </button>
              </div>
            </div>
          </div>
          <div style={{ overflow: 'scroll', padding: '0px 5px' }}>
            {Object.keys(conjugaisonPasseCompose).map((verb) => (
              <div
                key={verb}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    id={verb}
                    name={verb}
                    checked={!!checkedVerbs[verb]}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCheckedVerbs((prev) => {
                        const updated = { ...prev, [verb]: checked };
                        return updated;
                      });
                      setVerbCounters((prev) => ({
                        ...prev,
                        [verb]: checked
                          ? prev[verb] === 0
                            ? 3
                            : prev[verb]
                          : 0,
                      }));
                    }}
                  />
                  <label htmlFor={verb}>{verb}</label>
                </div>
                <span
                  style={{
                    marginLeft: 8,
                    minWidth: 16,
                    textAlign: 'right',
                    color: verbCounters[verb] === 0 ? '#d3d3d3' : '#b0b0b0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {verbCounters[verb]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LeftSideContainer>
  );
}

export default VerbSelector;
