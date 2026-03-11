import { fetchAuthSession } from 'aws-amplify/auth';

export type GenerateCombinationsInput = {
  tense: string;
  verbs: string[];
  personalised?: boolean;
};

export type GeneratedCombinationItem = {
  verb: string;
  subject: string;
  conjuguatedVerbWithSubject: string;
  phraseToShow: string;
  tense: string;
};

type GenerateCombinationsResponse = {
  items: GeneratedCombinationItem[];
};

export class CombinationClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async generateCombinations(input: GenerateCombinationsInput): Promise<GeneratedCombinationItem[]> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (input.personalised === true) {
      const session = await fetchAuthSession();
      const bearerToken = session.tokens?.idToken?.toString();
      if (bearerToken) {
        headers.Authorization = `Bearer ${bearerToken}`;
      }
    }

    const response = await fetch(`${this.baseUrl}/api/combinations/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const body = (await response.json()) as { message?: unknown };
        if (typeof body.message === 'string' && body.message.length > 0) {
          message = body.message;
        }
      } catch {
        // Keep default error message when response body is not JSON.
      }
      throw new Error(message);
    }

    const data = (await response.json()) as GenerateCombinationsResponse;
    return data.items;
  }
}

export function createCombinationClientFromEnv(): CombinationClient {
  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
  return new CombinationClient(baseUrl);
}
