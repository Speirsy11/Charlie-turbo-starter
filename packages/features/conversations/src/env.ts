import { createEnv } from "@t3-oss/env-core";

import { dbEnvs, nodeEnvShared, skipValidation } from "@charlie/env-schema";

export function conversationsEnv() {
  return createEnv({
    shared: nodeEnvShared,
    server: dbEnvs.server,
    runtimeEnv: {
      NODE_ENV: process.env.NODE_ENV,
      ...dbEnvs.runtimeEnv,
    },
    skipValidation,
  });
}

export const env = conversationsEnv();
