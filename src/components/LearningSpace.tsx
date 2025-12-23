import { useEffect, useRef, useState } from "react";
import { useVerbs } from "../contexts/useVerbs";
import { useCombinaison } from "../hooks/useCombinaison";
import VerbSelector from "./VerbSelector";

const irregularVerbs = [
  'avoir', 'être', 'faire', 'mettre', 'prendre', 'dire', 'écrire', 'voir', 'pouvoir', 'vouloir', 'savoir', 'connaître', 'venir', 'devoir', 'croire', 'boire', 'lire', 'vivre', 'recevoir', 'ouvrir', 'offrir', 'naître', 'mourir', 'tenir', 'suivre', 'rire', 'plaire', 'falloir', 'valoir', 'pleuvoir', 'apprendre', 'comprendre', 'surprendre', 'découvrir', 'souffrir', 'conduire', 'produire', 'traduire', 'atteindre', 'craindre', 'éteindre', 'joindre', 'peindre', 'clore', 'inclure', 'cuire', 'resoudre', 'absoudre'
];

const reflexiveVerbs = ['se lever', 'se coucher', 's’habiller', 'se laver', 'se brosser', 'se réveiller', 'se reposer', 'se dépêcher', 'se souvenir de', 'se rendre compte de', 's’intéresser à', 's’ennuyer', 'se fâcher', 'se tromper', 'se taire', 's’asseoir', 's’entendre avec', 'se disputer (avec)', 'se marier (avec)', 'se divorcer', 'se battre', 's’en aller', 'se rendre', 'se servir de', 's’apercevoir de', 'se douter de', 'se passer de', 'se trouver', 'se mettre à', 'se faire à', 'se demander', 'se plaindre de', 'se voir', 's’imaginer', 's’efforcer de', 's’évanouir', 's’indigner', 's’apercevoir que', 's’épanouir', 's’en sortir', 's’attendre à', 's’interroger sur', 'se heurter à', 'se méfier de', 'se replier sur soi-même', 'se raviser', 'se débrouiller', 'se réconcilier', 'se précipiter', 'se figurer'];

const COIverbsÀ = [ 'appartenir', 'convenir', 'demander', 'dire', 'donner', 'écrire', 'emprunter', 'envoyer', 'offrir', 'parler', 'plaire', 'poser', 'prêter', 'proposer', 'raconter', 'rappeler', 'répondre', 'ressembler', 'souhaiter', 'téléphoner'];
const targetY = [ 'assister', 'croire', 'faire attention', 'jouer', 'obéir', 'participer', 'penser', 'réfléchir', 'répondre', 'réussir', 's’intéresser', 'tenir' ];
const targetEn = [ 'avoir besoin', 'avoir envie', 'avoir peur', 'dépendre', 'discuter', 'entendre parler', 'manquer', 'parler', 'profiter', 'rêver', 'se souvenir', 's’occuper', 'se passer' ];

function LearningSpace() {
    const [tense, setTense] = useState('passé composé');
    const { availableVerbs, decreaseCount } = useVerbs();
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
                        decreaseCount(verb);
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
            <VerbSelector/>
            <div style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                {verb ? (
                <div className="phrase">
                    <div>{firstPart}</div>
                    <div className="activePartContainer">
                    <div className="replace">{!isRight ? subject + ', ' + verb : '‎'}</div>
                    <div>
                        <input
                        className={isRight == null ? '' : (isRight ? 'right' : 'wrong')}
                        type="text"
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                        />
                    </div>
                    </div>
                    <div>{secondPart}</div>
                </div>
                ) : (
                <div style={{padding: '2em', color: 'gray'}}>Please select at least one verb.</div>
                )}
            </div>
        </>
  );
}

export default LearningSpace

