import { spawnSync } from 'node:child_process';

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0) {
    return process.env.DATABASE_URL;
  }

  const rawSecrets = process.env.AWS_SECRETS;
  if (!rawSecrets || rawSecrets.length === 0) {
    return undefined;
  }

  // Support both plain secret strings and JSON secrets with DATABASE_URL key.
  if (!rawSecrets.trim().startsWith('{')) {
    return rawSecrets;
  }

  try {
    const parsed = JSON.parse(rawSecrets);
    if (typeof parsed?.DATABASE_URL === 'string' && parsed.DATABASE_URL.length > 0) {
      return parsed.DATABASE_URL;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function run(command, args, env) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const databaseUrl = resolveDatabaseUrl();
if (!databaseUrl) {
  console.error('Startup failed: DATABASE_URL is missing and could not be resolved from AWS_SECRETS.');
  process.exit(1);
}

const env = {
  ...process.env,
  DATABASE_URL: databaseUrl,
};

run('npm', ['run', 'prisma:migrate:deploy'], env);
run('npm', ['start'], env);
