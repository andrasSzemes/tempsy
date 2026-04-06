import prisma from '../lib/prisma.js';
import { randomUUID } from 'node:crypto';

export type AuthProvider = 'registry' | 'google';

export type UserIdentityLookup = {
  id: string;
  createdAt: Date;
};

export type UserUpsertRow = {
  id: string;
  registryCognitoSub: string | null;
  googleCognitoSub: string | null;
  email: string;
  name: string | null;
  createdAt: Date;
};

type ExistsRow = {
  exists: boolean;
};

function providerWhere(provider: AuthProvider, cognitoSub: string) {
  return provider === 'google'
    ? { googleCognitoSub: cognitoSub }
    : { registryCognitoSub: cognitoSub };
}

export async function findUserIdByProviderSub(provider: AuthProvider, cognitoSub: string): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: providerWhere(provider, cognitoSub),
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function findUserIdentityByProviderSub(
  provider: AuthProvider,
  cognitoSub: string,
): Promise<UserIdentityLookup | null> {
  const user = await prisma.user.findFirst({
    where: providerWhere(provider, cognitoSub),
    select: { id: true, createdAt: true },
  });

  return user ?? null;
}

export async function countUsers(): Promise<number> {
  return prisma.user.count();
}

export async function userExistsByIdentifier(identifier: string): Promise<boolean> {
  const rows = await prisma.$queryRaw<ExistsRow[]>`
    SELECT EXISTS(
      SELECT 1
      FROM "User"
      WHERE "id" = ${identifier}
         OR "registryCognitoSub" = ${identifier}
         OR "googleCognitoSub" = ${identifier}
    ) AS "exists";
  `;

  return rows[0]?.exists === true;
}

export async function upsertUserByClaims(
  provider: AuthProvider,
  cognitoSub: string,
  email: string,
  resolvedName: string | null,
): Promise<UserUpsertRow | null> {
  const generatedId = randomUUID();
  const rows = await prisma.$queryRaw<UserUpsertRow[]>`
    WITH existing AS (
      SELECT "id"
      FROM "User"
      WHERE (CASE WHEN ${provider} = 'registry' THEN "registryCognitoSub" ELSE "googleCognitoSub" END) = ${cognitoSub}
         OR "email" = ${email}
      LIMIT 1
    ),
    updated AS (
      UPDATE "User"
      SET "registryCognitoSub" = CASE WHEN ${provider} = 'registry' THEN ${cognitoSub} ELSE "registryCognitoSub" END,
          "googleCognitoSub" = CASE WHEN ${provider} = 'google' THEN ${cognitoSub} ELSE "googleCognitoSub" END,
          "email" = ${email},
          "name" = ${resolvedName}
      WHERE "id" IN (SELECT "id" FROM existing)
      RETURNING "id", "registryCognitoSub", "googleCognitoSub", "email", "name", "createdAt"
    ),
    inserted AS (
      INSERT INTO "User" ("id", "registryCognitoSub", "googleCognitoSub", "email", "name")
      SELECT
        ${generatedId},
        CASE WHEN ${provider} = 'registry' THEN ${cognitoSub} ELSE NULL END,
        CASE WHEN ${provider} = 'google' THEN ${cognitoSub} ELSE NULL END,
        ${email},
        ${resolvedName}
      WHERE NOT EXISTS (SELECT 1 FROM existing)
      RETURNING "id", "registryCognitoSub", "googleCognitoSub", "email", "name", "createdAt"
    )
    SELECT * FROM updated
    UNION ALL
    SELECT * FROM inserted;
  `;

  return rows[0] ?? null;
}
