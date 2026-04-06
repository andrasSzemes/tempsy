import { Router, Request, Response } from 'express';
import type { TokenClaims } from '../types/TokenClaims.js';
import {
  findCombinationsByTenseAndVerbs,
  findPersonalisedCombinationsByTenseAndVerbs,
} from '../repositories/combinationsRepository.js';
import { findTimeMarkersByTenseId, type TimeMarkerRow } from '../repositories/timeMarkersRepository.js';
import { findTenseByName } from '../repositories/tensesRepository.js';
import { findUserIdByProviderSub, type AuthProvider } from '../repositories/usersRepository.js';

type GenerateCombinationsBody = {
  tense?: unknown;
  verbs?: unknown;
  personalised?: unknown;
};

const combinationsRouter = Router();

function getRandomItem<T>(items: T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function capitalizeStart(sentence: string): string {
  if (!sentence) {
    return '';
  }
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function ensureSentenceEnding(sentence: string): string {
  const trimmed = sentence.trim();
  if (trimmed.length === 0) {
    return '';
  }

  const lastChar = trimmed[trimmed.length - 1];
  if (['.', '!', '?'].includes(lastChar)) {
    return trimmed;
  }

  return `${trimmed}.`;
}

function normalizePhraseToShow(phrase: string): string {
  return ensureSentenceEnding(capitalizeStart(phrase));
}

function addTimeMarker(sentence: string, marker: TimeMarkerRow): string {
  const trimmedSentence = sentence.trim();
  if (trimmedSentence.length === 0) {
    return '';
  }

  if (marker.placement === 'beginningOfSentence') {
    return `${marker.text}, ${trimmedSentence}`;
  }

  return `${trimmedSentence} ${marker.text}`;
}

function extractBearerToken(req: { header(name: string): string | undefined }): string | null {
  const authHeader = req.header('authorization');
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

function decodeJwtPayload(token: string): TokenClaims | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json) as TokenClaims;
  } catch {
    return null;
  }
}

function resolveAuthProvider(claims: TokenClaims): AuthProvider {
  if (!Array.isArray(claims.identities)) {
    return 'registry';
  }

  const hasGoogleIdentity = claims.identities.some((identity) => {
    if (typeof identity !== 'object' || identity === null) {
      return false;
    }
    if (!('providerName' in identity)) {
      return false;
    }
    return String(identity.providerName).toLowerCase() === 'google';
  });

  return hasGoogleIdentity ? 'google' : 'registry';
}

combinationsRouter.post('/generate', async (req: Request<unknown, unknown, GenerateCombinationsBody>, res: Response) => {
  const { tense, verbs, personalised } = req.body ?? {};

  if (typeof tense !== 'string' || tense.trim().length === 0) {
    return res.status(400).json({ message: 'tense must be a non-empty string.' });
  }

  if (!Array.isArray(verbs) || verbs.length === 0) {
    return res.status(400).json({ message: 'verbs must be a non-empty string array.' });
  }

  if (personalised !== undefined && typeof personalised !== 'boolean') {
    return res.status(400).json({ message: 'personalised must be a boolean when provided.' });
  }

  const shouldPersonalise = personalised === true;

  const normalizedVerbs = Array.from(
    new Set(
      verbs
        .filter((verb): verb is string => typeof verb === 'string')
        .map((verb) => verb.trim())
        .filter((verb) => verb.length > 0),
    ),
  );

  if (normalizedVerbs.length === 0) {
    return res.status(400).json({ message: 'verbs must contain at least one non-empty string.' });
  }

  try {
    const trimmedTense = tense.trim();
    const tenseRow = await findTenseByName(trimmedTense);

    if (!tenseRow) {
      return res.status(404).json({ message: 'Tense not found.' });
    }

    let userId: string | null = null;
    if (shouldPersonalise) {
      const token = extractBearerToken(req);
      const claims = token ? decodeJwtPayload(token) : null;
      const cognitoSub = claims && typeof claims.sub === 'string' && claims.sub.length > 0 ? claims.sub : null;

      if (claims && cognitoSub) {
        const provider = resolveAuthProvider(claims);
        userId = await findUserIdByProviderSub(provider, cognitoSub);
      }
    }

    const items = userId
      ? await findPersonalisedCombinationsByTenseAndVerbs(tenseRow, normalizedVerbs, userId)
      : await findCombinationsByTenseAndVerbs(tenseRow, normalizedVerbs);

    const timeMarkers = await findTimeMarkersByTenseId(tenseRow.id);

    const normalizedItems = items.map((item) => {
      const phraseWithOptionalMarker =
        timeMarkers.length > 0
          ? addTimeMarker(item.phraseToShow, getRandomItem(timeMarkers))
          : item.phraseToShow;

      return {
        ...item,
        phraseToShow: normalizePhraseToShow(phraseWithOptionalMarker),
      };
    });

    return res.status(200).json({ items: normalizedItems });
  } catch (error) {
    return res.status(500).json({
      message: 'Could not generate combinations.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default combinationsRouter;
