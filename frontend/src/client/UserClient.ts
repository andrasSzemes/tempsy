import type { User } from '../types/User';
import { fetchAuthSession } from 'aws-amplify/auth';

export class UserClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async upsertUser(input?: User): Promise<void> {
    const session = await fetchAuthSession();
    const bearerToken = session.tokens?.idToken?.toString();

    if (!bearerToken) {
      throw new Error('Missing ID token for authorized user sync request.');
    }

    const response = await fetch(`${this.baseUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(input ?? {}),
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
  }

  async userExists(identifier: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/users/${encodeURIComponent(identifier)}`, {
      method: 'HEAD',
    });

    if (response.status === 404) {
      return false;
    }

    if (response.ok) {
      return true;
    }

    throw new Error(`Could not check user existence (status ${response.status}).`);
  }
}

export function createUserClientFromEnv(): UserClient {
  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
  return new UserClient(baseUrl);
}
