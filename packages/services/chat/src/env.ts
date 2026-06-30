import { createEnv } from "@t3-oss/env-core";

import { anthropicEnvs, skipValidation } from "@charlie/env-schema";

export function chatEnv() {
  return createEnv({
    server: anthropicEnvs.server,
    runtimeEnv: anthropicEnvs.runtimeEnv,
    skipValidation,
  });
}

export const env = chatEnv();
