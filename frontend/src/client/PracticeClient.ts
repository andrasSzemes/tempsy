import { fetchAuthSession } from 'aws-amplify/auth';

export type SavePracticeInput = {
  verb: string;
  tense: string;
  subject: string;
  success: boolean;
};

export type PracticeStatistics = {
  month: {
    year: number;
    month: number;
    label: string;
  };
  range: {
    startYear: number;
    startMonth: number;
    endYear: number;
    endMonth: number;
  };
  user: {
    registeredAt: string;
  };
  totals: {
    monthly: number;
    allTime: number;
  };
  dailyCounts: Array<{
    date: string;
    count: number;
  }>;
  tenseBreakdown: Array<{
    tense: string;
    count: number;
    percentage: number;
  }>;
};

export class PracticeClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async savePractice(input: SavePracticeInput): Promise<void> {
    const session = await fetchAuthSession();
    const bearerToken = session.tokens?.idToken?.toString();

    if (!bearerToken) {
      return;
    }

    const response = await fetch(`${this.baseUrl}/api/practice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(input),
    });

    if (response.status === 202) {
      // Backend intentionally skips processing when user_id claim is unavailable.
      return;
    }

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const body = (await response.json()) as { message?: unknown };
        if (typeof body.message === 'string' && body.message.length > 0) {
          message = body.message;
        }
      } catch {
        // Keep default message for non-JSON errors.
      }
      throw new Error(message);
    }
  }

  async getStatistics(year: number, month: number): Promise<PracticeStatistics> {
    const session = await fetchAuthSession();
    const bearerToken = session.tokens?.idToken?.toString();

    if (!bearerToken) {
      throw new Error('Missing ID token for statistics request.');
    }

    const params = new URLSearchParams({
      year: String(year),
      month: String(month),
    });

    const response = await fetch(`${this.baseUrl}/api/practice/statistics?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const body = (await response.json()) as { message?: unknown };
        if (typeof body.message === 'string' && body.message.length > 0) {
          message = body.message;
        }
      } catch {
        // Keep default message for non-JSON errors.
      }
      throw new Error(message);
    }

    return (await response.json()) as PracticeStatistics;
  }
}

export function createPracticeClientFromEnv(): PracticeClient {
  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
  return new PracticeClient(baseUrl);
}
