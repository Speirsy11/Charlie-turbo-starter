import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z, ZodError } from "zod/v4";

import type { AuthContext } from "@charlie/auth";

/**
 * The context every feature router shares: the incoming request headers, the
 * resolved {@link AuthContext}, and the feature's own typed db client. Features
 * supply `TDb` via {@link createBasicTRPC}, so each owns a context bound to its
 * schema without a central router.
 */
export interface BasicTRPCContext<TDb> {
  headers: Headers;
  auth: AuthContext;
  db: TDb;
}

/**
 * Builds a feature's tRPC primitives — its context factory, router builder and
 * procedures — bound to the feature's own db client. This is the decentralized
 * model: there is no shared `appRouter`; each feature calls this and owns its
 * router, route handler and React provider.
 *
 * @example
 * const { createTRPCContext, createTRPCRouter, publicProcedure } =
 *   createBasicTRPC({ db });
 */
export function createBasicTRPC<TDb>(config: { db: TDb }) {
  const { db } = config;

  type Ctx = BasicTRPCContext<TDb>;

  const createTRPCContext = (opts: {
    headers: Headers;
    auth: AuthContext;
  }): Ctx => ({
    headers: opts.headers,
    auth: opts.auth,
    db,
  });

  const t = initTRPC.context<Ctx>().create({
    transformer: superjson,
    errorFormatter: ({ shape, error }) => ({
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? z.flattenError(error.cause as ZodError<Record<string, unknown>>)
            : null,
      },
    }),
  });

  const timingMiddleware = t.middleware(async ({ next, path }) => {
    const start = Date.now();

    if (t._config.isDev) {
      // artificial delay in dev to surface request waterfalls
      const waitMs = Math.floor(Math.random() * 400) + 100;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    const result = await next();

    const end = Date.now();
    console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

    return result;
  });

  const publicProcedure = t.procedure.use(timingMiddleware);

  const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
    if (!ctx.auth.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        auth: { ...ctx.auth, userId: ctx.auth.userId },
      },
    });
  });

  return {
    createTRPCContext,
    createTRPCRouter: t.router,
    publicProcedure,
    protectedProcedure,
  };
}
