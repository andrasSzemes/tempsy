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

export interface Combinaison {
  id: string;
  verb: string;
  conjuguatedVerbWithSubject: string;
  subject: string;
  phraseToShow: string;
}

/**
 * Generates a list of verb "combinaisons" for French conjugation practice.
 *
 * Creates one combination for each verb in the provided array.
 * Each combination includes: verb, subject, conjugated form, and a display-ready phrase.
 * Subjects, sentences, and time markers are randomly selected for each verb.
 * 
 * @param tense The tense to use for conjugation (e.g., "passeCompose").
 * @param verbs An array of verb infinitives to create combinations for.
 * @returns An array of combinations, one for each verb.
 */
export function generateAllCombinaisons(tense: string, verbs: string[]): Combinaison[] {
  return verbs
    .filter((verb) => {
      if (!sentencePasseCompose[verb]) {
        console.error(`Missing sentence data for verb: "${verb}" in sentencePasseCompose`);
        return false;
      }
      if (!conjugaisonPasseCompose[verb]) {
        console.error(`Missing conjugation data for verb: "${verb}" in conjugaisonPasseCompose`);
        return false;
      }
      return true;
    })
    .map((verb) => {
      const sentence = getRandomItem(sentencePasseCompose[verb]);
      const timeMarker = getRandomItem(timeMarkerPasseCompose);
      const subject = getRandomSubject();
      
      const conjuguatedVerbWithSubject = conjugateVerb(verb, tense, subject);
      const phraseToShow = capitalizeStart(addTimeMarker(sentence, timeMarker) + '.');

      return {
        id: crypto.randomUUID(),
        verb,
        conjuguatedVerbWithSubject,
        subject,
        phraseToShow,
      };
    });
}
