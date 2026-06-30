import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
await jiti.import("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@charlie/admin",
    "@charlie/auth",
    "@charlie/chat",
    "@charlie/conversations",
    "@charlie/db",
    "@charlie/env-schema",
    "@charlie/query-client",
    "@charlie/trpc",
    "@charlie/ui",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  typescript: { ignoreBuildErrors: true },
};

export default config;
