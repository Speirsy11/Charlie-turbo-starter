import { createEnv } from "@t3-oss/env-core";

import { dbEnvs, skipValidation } from "@charlie/env-schema";

/**
 * Validates the discrete Postgres connection params. Features import this to
 * build their `createDb` connection from typed, present-checked values.
 */
export function dbEnv() {
  return createEnv({
    server: dbEnvs.server,
    runtimeEnv: dbEnvs.runtimeEnv,
    skipValidation,
  });
}

export const env = dbEnv();
