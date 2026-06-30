import "server-only";

import { createBasicTRPC } from "@charlie/trpc/server";

import { db } from "../db/client";

/**
 * Feature-scoped tRPC primitives, bound to the conversations db. There is no
 * central router — the app mounts this feature's `appRouter` at
 * `/api/trpc/conversations` and wraps the UI in the matching provider.
 */
const {
  createTRPCContext,
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} = createBasicTRPC({ db });

export {
  createTRPCContext,
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
};
