import { auth } from "@clerk/nextjs/server";

import { toAuthContext } from "@charlie/auth";
import { appRouter, createTRPCContext } from "@charlie/conversations/server";
import { createTRPCRoute } from "@charlie/trpc/server";

export const { GET, POST, OPTIONS } = createTRPCRoute({
  endpoint: "/api/trpc/conversations",
  router: appRouter,
  createContext: async (req) =>
    createTRPCContext({
      headers: req.headers,
      auth: toAuthContext(await auth()),
    }),
});
