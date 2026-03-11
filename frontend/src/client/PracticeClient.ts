import { fetchAuthSession } from 'aws-amplify/auth';

export type SavePracticeInput = {
  verb: string;
  tense: string;
  subject: string;
  success: boolean;
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
}

export function createPracticeClientFromEnv(): PracticeClient {
  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
  return new PracticeClient(baseUrl);
}
