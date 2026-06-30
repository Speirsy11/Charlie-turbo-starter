import type { AnyTRPCRouter, inferRouterContext } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export interface CreateTRPCRouteConfig<TRouter extends AnyTRPCRouter> {
  /** The endpoint the client posts to, e.g. `/api/trpc/conversations`. */
  endpoint: string;
  /** The feature's tRPC app router. */
  router: TRouter;
  /**
   * Resolves the feature's context for a request. The app wires auth here
   * (Clerk → `toAuthContext`) so lower layers stay framework-agnostic.
   */
  createContext: (req: Request) => Promise<inferRouterContext<TRouter>>;
}

export interface TRPCRouteHandlers {
  GET: (req: Request) => Promise<Response>;
  POST: (req: Request) => Promise<Response>;
  OPTIONS: () => Response;
}

const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
};

/**
 * Builds the Next.js App Router handlers (`GET`, `POST`, `OPTIONS`) for a
 * feature's tRPC endpoint. Every per-feature route file used to hand-roll the
 * same CORS + `fetchRequestHandler` + error-logging boilerplate; this owns that
 * convention so each route collapses to a few lines.
 *
 * @example
 * export const { GET, POST, OPTIONS } = createTRPCRoute({
 *   endpoint: "/api/trpc/conversations",
 *   router: appRouter,
 *   createContext: async (req) =>
 *     createTRPCContext({ headers: req.headers, auth: toAuthContext(await auth()) }),
 * });
 */
export function createTRPCRoute<TRouter extends AnyTRPCRouter>(
  config: CreateTRPCRouteConfig<TRouter>,
): TRPCRouteHandlers {
  const { endpoint, router, createContext } = config;

  const handler = async (req: Request) => {
    const response = await fetchRequestHandler({
      endpoint,
      req,
      router,
      createContext: () => createContext(req),
      onError({ error, path }) {
        console.error(`>>> tRPC Error on '${path}'`, error);
      },
    });

    setCorsHeaders(response);
    return response;
  };

  const OPTIONS = () => {
    const response = new Response(null, { status: 204 });
    setCorsHeaders(response);
    return response;
  };

  return { GET: handler, POST: handler, OPTIONS };
}
