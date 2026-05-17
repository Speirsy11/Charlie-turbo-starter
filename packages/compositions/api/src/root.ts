import { postRouter } from "@charlie/posts";
import { createTRPCRouter } from "@charlie/trpc";

import { authRouter } from "./router/auth";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
