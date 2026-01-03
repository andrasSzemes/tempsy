import { useEffect, useRef, useState } from 'react';
import { examples, conjugaison } from './tenses/conditionel/conditionel';
import './App.css'
import Passe from './_maybe-usefull-later/Passe';
import LearningSpace from './components/LearningSpace';
import { VerbsProvider } from './contexts/useVerbs';


function getRandomItem<T>(array: T[]): T | null {
  if (!Array.isArray(array) || array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function capitalizeStart(sentence: string): string {
  if (!sentence) return '';
  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
}

// IDEAS: show the conjugaison of the verb after 3 enters

function App() {
  const [shouldRestart, setShouldRestart] = useState(false);
  const [subject, setSubject] = useState("");
  const [phraseToWorkWith, setPhraseToWorkWith] = useState("");
  const [activePart, setActivePart] = useState<{ text: string | null, verb: string | null, wrong: boolean, right: boolean, tentatives: number}>({
    text: "",
    verb: null,
    wrong: false,
    right: false,
    tentatives: 0
  });


  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let example: any = getRandomItem(examples.situationsHypothetiques);

    // example: Si SUJET (avoir) plus de temps, SUJET (lire) davantage.
    let sentence = example?.sentence || "";
    const subject: string = getRandomItem(example?.sujet || []) || "";
    setSubject(subject);

    let sentenceWithSujet = sentence
                              .replace(/SUJET/g, subject || "")
                              .replace(/si\s+ils/i, "s'ils")
                              .replace(/si\s+il/i, "s'il");

    sentenceWithSujet = capitalizeStart(sentenceWithSujet);
    setPhraseToWorkWith(sentenceWithSujet);

    
    const verbs = [...sentenceWithSujet.matchAll(/\(([^)]+)\)/g)].map(m => m[1]);
    if (verbs.length > 0) {
      setActivePart({ text: `(${verbs[0]})`, verb: verbs[0], wrong: false, right: false, tentatives: 0 });
    }
    
  
    // let sensenteWithSujetConjugated = sentenceWithSujet;
    // verbs.forEach(verb => {
    //   console.log(verb, conjugaison[verb]);
    //   sensenteWithSujetConjugated = sensenteWithSujetConjugated.replace(`(${verb})`, conjugaison[verb][sujet]);
    // })

  }, [shouldRestart]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      if (inputRef.current.value.length > 0 && activePart.verb) {
        console.log("solution", conjugaison[activePart.verb][subject])
        if (conjugaison[activePart.verb][subject] == inputRef.current.value) {
          setActivePart(current => ({...current, wrong: false, right: true}))
          setTimeout(() => {
              setPhraseToWorkWith(current => {
                const updatedSentence = current.replace(activePart.text as string, conjugaison[activePart.verb as string][subject]);

                if (inputRef?.current) {
                  inputRef.current.value = "";
                }

                const verbs = [...updatedSentence.matchAll(/\(([^)]+)\)/g)].map(m => m[1]);
                if (verbs.length > 0) {
                  setActivePart({ text: `(${verbs[0]})`, verb: verbs[0], wrong: false, right: false, tentatives: 0 });
                } else {
                  setShouldRestart(!shouldRestart);
                }
                return updatedSentence;
              });
          }, 1000);
        } else {
          setActivePart(current => ({...current, wrong: true, tentatives: current.tentatives + 1}))
        }
      } else {
        setActivePart(current => ({...current, tentatives: current.tentatives + 1 }))
      }
    }
  };

  let firstPart, secondPart;
  if (activePart.text) {
    [firstPart, secondPart] = phraseToWorkWith.split(activePart.text);
  }

  return (
    <>
      {/* <Passe/> */}
      <VerbsProvider>
        <LearningSpace/>
      </VerbsProvider>
    </>
  );
}

export default App
