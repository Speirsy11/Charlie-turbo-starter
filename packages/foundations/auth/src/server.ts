import "server-only";

import { auth as clerkAuth } from "@clerk/nextjs/server";

import type { AuthContext } from "./context";
import { toAuthContext } from "./context";
import { devAuthUserId } from "./dev-auth";

/**
 * Resolve the request identity. Clerk remains the default; a configured local
 * development identity is substituted before Clerk is contacted.
 */
export async function resolveAuthContext(): Promise<AuthContext> {
  const userId = devAuthUserId();
  if (userId) return { userId };

  return toAuthContext(await clerkAuth());
}
