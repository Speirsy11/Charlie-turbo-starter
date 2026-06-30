import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@charlie/eslint-config/base";

export default defineConfig(baseConfig, restrictEnvAccess);
