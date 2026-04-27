import { PrismaClient } from '@prisma/client';

function ensureDatabaseUrlFromAwsSecrets(): void {
  if (process.env.DATABASE_URL) {
    return;
  }

  const rawSecrets = process.env.AWS_SECRETS;
  if (!rawSecrets) {
    return;
  }

  try {
    const parsed = JSON.parse(rawSecrets) as { DATABASE_URL?: unknown };
    if (typeof parsed.DATABASE_URL === 'string' && parsed.DATABASE_URL.length > 0) {
      process.env.DATABASE_URL = parsed.DATABASE_URL;
    }
  } catch {
    // Keep startup resilient if AWS_SECRETS is not valid JSON
  }
}

ensureDatabaseUrlFromAwsSecrets();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;