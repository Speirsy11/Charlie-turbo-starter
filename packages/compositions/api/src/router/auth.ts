import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "@charlie/trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.auth;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
} satisfies TRPCRouterRecord;
