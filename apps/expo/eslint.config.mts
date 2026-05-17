import { defineConfig } from "eslint/config";

import { baseConfig } from "@charlie/eslint-config/base";
import { reactConfig } from "@charlie/eslint-config/react";

export default defineConfig(
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  baseConfig,
  reactConfig,
);
