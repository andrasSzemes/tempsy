type GetVerbsResponse = {
  verbs: string[];
};

type GetIrregularByTenseResponse = {
  irregularByTense: Record<string, string[]>;
};

type GetTensesResponse = {
  tenses: string[];
};

export class VerbClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async getVerbs(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/verbs`);

    if (!response.ok) {
      throw new Error(`Could not fetch verbs (status ${response.status}).`);
    }

    const data = (await response.json()) as GetVerbsResponse;
    return data.verbs;
  }

  async getIrregularByTense(): Promise<Record<string, string[]>> {
    const response = await fetch(`${this.baseUrl}/api/verbs/irregular`);

    if (!response.ok) {
      throw new Error(`Could not fetch irregular verbs (status ${response.status}).`);
    }

    const data = (await response.json()) as GetIrregularByTenseResponse;
    return data.irregularByTense;
  }

  async getTenses(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/verbs/tense`);

    if (!response.ok) {
      throw new Error(`Could not fetch tenses (status ${response.status}).`);
    }

    const data = (await response.json()) as GetTensesResponse;
    return data.tenses;
  }
}

export function createVerbClientFromEnv(): VerbClient {
  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
  return new VerbClient(baseUrl);
}
