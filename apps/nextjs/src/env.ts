import { createEnv } from "@t3-oss/env-nextjs";

import { authEnv } from "@charlie/auth/env";
import {
  clerkClientEnvs,
  nodeEnvShared,
  skipValidation,
  vercel,
} from "@charlie/env-schema";

export const env = createEnv({
  extends: [authEnv(), vercel()],
  shared: nodeEnvShared,
  /**
   * Client-side env vars. Database (`DB_*`) and Anthropic creds are owned by the
   * conversations feature and chat service respectively, not the app.
   */
  client: clerkClientEnvs.client,
  /**
   * Destructure client/shared vars from `process.env` so they aren't tree-shaken.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  skipValidation,
});
