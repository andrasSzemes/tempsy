import { useState, useCallback } from "react";
import { sentencePasseCompose } from "../tenses/passeCompose/context";
import { timeMarkerPasseCompose } from "../tenses/passeCompose/timeMarker";
import { conjugaisonPasseCompose } from "../tenses/passeCompose/conjugaison";

function getRandomItem<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function getRandomSubject() {
  return getRandomItem([
    "je",
    "tu",
    "il",
    "elle",
    "on",
    "nous",
    "vous",
    "ils",
    "elles",
  ]);
}

function conjugateVerb(verb: string, tense: string, subject: string) {
    return conjugaisonPasseCompose[verb][subject];
}

function capitalizeStart(sentence: string): string {
  if (!sentence) return '';
  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
}

function addTimeMarker(sentence: string, marker: { placement: string; text: string }) {
    if (marker.placement == 'beginningOfSentence') {
        return `${marker.text}, ${sentence}`;
    }
    if (marker.placement == 'endOfSentence') {
        return `${sentence} ${marker.text}`;
    }
}

/**
 * Custom React hook for generating and managing a random verb “combinaison” for French conjugation practice.
 *
 * This hook provides state and helpers for:
 * - Randomly selecting a verb from a list of available verbs.
 * - Randomly selecting a sentence and time marker for the chosen verb.
 * - Randomly selecting a subject pronoun.
 * - Generating the correctly conjugated verb form for the current combination.
 * - Generating a display-ready phrase with the time marker and sentence.
 * - Advancing to a new random combination on demand.
 * 
 * @param tense The tense to use for conjugation (e.g., "passeCompose").
 * @param verbs An array of verb infinitives to choose from.
 * @returns An object containing the current verb, conjugated form, subject, display phrase, and a function to get the next combination.
 */
export function useCombinaison(tense: string, verbs: string[]) {
  const [verb, setVerb] = useState(() => getRandomItem(verbs));
  const [sentence, setSentence] = useState(() => verb ? getRandomItem(sentencePasseCompose[verb]) : "");
  const [timeMarker, setTimeMarker] = useState(() => getRandomItem(timeMarkerPasseCompose));
  const [subject, setSubject] = useState(getRandomSubject());

  const nextCombinaison = useCallback(
    (newVerbs?: string[]) => {
      const verbList = newVerbs || verbs;
      const newVerb = getRandomItem(verbList);
      setVerb(newVerb);
      setSentence(newVerb ? getRandomItem(sentencePasseCompose[newVerb]) : "");
      setTimeMarker(getRandomItem(timeMarkerPasseCompose));
      setSubject(getRandomSubject());
    },
    [verbs, tense]
  );

  const conjuguatedVerbWithSubject = verb ? conjugateVerb(verb, tense, subject) : '';
  const phraseToShow = verb ? capitalizeStart(addTimeMarker(sentence, timeMarker) + '.') : '';

  return {
    verb,
    conjuguatedVerbWithSubject,
    subject,
    phraseToShow,
    nextCombinaison,
  };
}
