import "server-only";

export { createBasicTRPC } from "./create-basic-trpc";
export type { BasicTRPCContext } from "./create-basic-trpc";
export { createTRPCRoute } from "./create-trpc-route";
export type {
  CreateTRPCRouteConfig,
  TRPCRouteHandlers,
} from "./create-trpc-route";
