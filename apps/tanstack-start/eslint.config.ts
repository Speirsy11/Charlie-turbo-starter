import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@charlie/eslint-config/base";
import { reactConfig } from "@charlie/eslint-config/react";

export default defineConfig(
  {
    ignores: [".nitro/**", ".output/**", ".tanstack/**"],
  },
  baseConfig,
  reactConfig,
  restrictEnvAccess,
);
