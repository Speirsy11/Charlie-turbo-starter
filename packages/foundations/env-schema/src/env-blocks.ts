import { z } from "zod/v4";

/**
 * Reusable env "blocks" shared across every package's `env.ts`.
 *
 * Each block is a `{ server?, client?, runtimeEnv }` fragment that a package
 * spreads into its own `createEnv()` call. Centralising the schema + the
 * `process.env` wiring here means a variable is described once and every
 * consumer stays in sync. See any package's `env.ts` for the spread pattern.
 */

/** Shared `NODE_ENV` — goes in the `shared` slot of `createEnv`. */
export const nodeEnvShared = {
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
};

/** Discrete Postgres connection params consumed by `createDb` (db foundation). */
export const dbEnvs = {
  server: {
    DB_HOST: z.string().nonempty(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string().nonempty(),
    DB_PASSWORD: z.string().nonempty(),
    DB_NAME: z.string().nonempty(),
  },
  runtimeEnv: {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
  },
};

/** Clerk server secret — used by the auth foundation (server-only). */
export const clerkServerEnvs = {
  server: {
    CLERK_SECRET_KEY: z.string().min(1),
  },
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
};

/** Clerk publishable key — exposed to the browser by the Next.js app. */
export const clerkClientEnvs = {
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
};

/** Anthropic credentials + model for the Vercel AI SDK (chat service). */
export const anthropicEnvs = {
  server: {
    ANTHROPIC_API_KEY: z.string().min(1),
    ANTHROPIC_MODEL: z.string().default("claude-sonnet-4-6"),
  },
  runtimeEnv: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
  },
};

/**
 * Base `skipValidation` — true during CI, lint, and tests (`SKIP_ENV_VALIDATION`)
 * so env vars aren't required to type-check, lint or run unit tests. Combine
 * with package-specific conditions using `||`.
 */
export const skipValidation =
  !!process.env.CI ||
  !!process.env.SKIP_ENV_VALIDATION ||
  process.env.npm_lifecycle_event === "lint";
