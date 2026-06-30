import { conversationsRouter } from "./routers/conversations";
import { createTRPCRouter } from "./trpc";

/**
 * The conversations feature's own app router. The Next.js app mounts this at
 * `/api/trpc/conversations`; the feature's React provider is typed to this
 * `AppRouter`, never to a shared/central one.
 */
export const appRouter = createTRPCRouter({
  conversations: conversationsRouter,
});

export type AppRouter = typeof appRouter;
