import { createEnv } from "@t3-oss/env-core";

import { clerkServerEnvs, skipValidation } from "@charlie/env-schema";

export function authEnv() {
  return createEnv({
    server: clerkServerEnvs.server,
    runtimeEnv: clerkServerEnvs.runtimeEnv,
    skipValidation,
  });
}
