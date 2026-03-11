import { createCombinationClientFromEnv } from '../client/CombinationClient';

export interface Combinaison {
  id: string;
  verb: string;
  conjuguatedVerbWithSubject: string;
  subject: string;
  phraseToShow: string;
  tense: string;
  numOfTentatives: number;
  isRight: boolean | null;
}

const combinationClient = createCombinationClientFromEnv();

function resolveBackendTense(tense: string): string {
  const normalized = tense.trim().toLowerCase();

  if (normalized === 'passé composé' || normalized === 'passe compose') {
    return 'Passé Composé';
  }

  return tense;
}

export async function fetchCombinaisons(
  tense: string,
  verbs: string[],
  personalised: boolean = false,
): Promise<Combinaison[]> {
  if (!Array.isArray(verbs) || verbs.length === 0) {
    return [];
  }

  const items = await combinationClient.generateCombinations({
    tense: resolveBackendTense(tense),
    verbs,
    personalised,
  });

  return items.map((item) => ({
    id: crypto.randomUUID(),
    verb: item.verb,
    conjuguatedVerbWithSubject: item.conjuguatedVerbWithSubject,
    subject: item.subject,
    phraseToShow: item.phraseToShow,
    tense: item.tense,
    numOfTentatives: 0,
    isRight: null,
  }));
}
