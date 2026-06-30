import { defineConfig, mergeConfig } from "vitest/config";

import baseConfig from "@charlie/vitest-config/base";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: "backend",
      environment: "node",
      include: ["src/tests/backend/**/*.test.ts"],
    },
  }),
);
