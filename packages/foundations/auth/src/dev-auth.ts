/**
 * Development-only identity override.
 *
 * `DEV_AUTH_USER_ID` is deliberately honoured only when NODE_ENV is exactly
 * `development`. Use a stable local identity; this helper never provisions one.
 */
const ENV_VAR = "DEV_AUTH_USER_ID";

function rawDevAuthUserId(): string | undefined {
  // This guard must inspect the raw environment before validated app env
  // initialization; otherwise an unsafe production value could be skipped.
  // eslint-disable-next-line no-restricted-properties
  const value = process.env[ENV_VAR]?.trim();
  return value === "" ? undefined : value;
}

/** Refuse to boot if a production deployment is configured to bypass auth. */
export function assertDevAuthNotInProduction(): void {
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NODE_ENV === "production" && rawDevAuthUserId()) {
    throw new Error(
      `${ENV_VAR} is set in a production build. This variable bypasses ` +
        "authentication entirely and must never be set outside local " +
        "development. Refusing to start.",
    );
  }
}

/** The local development identity, or null when Clerk must authenticate. */
export function devAuthUserId(): string | null {
  // eslint-disable-next-line no-restricted-properties
  if (process.env.NODE_ENV !== "development") return null;
  return rawDevAuthUserId() ?? null;
}

export function isDevAuthEnabled(): boolean {
  return devAuthUserId() !== null;
}
