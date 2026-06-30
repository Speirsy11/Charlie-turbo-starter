import { defineConfig, mergeConfig } from "vitest/config";

import baseConfig from "@charlie/vitest-config/base";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: "chat",
      environment: "node",
      include: ["src/**/*.test.ts"],
    },
  }),
);
