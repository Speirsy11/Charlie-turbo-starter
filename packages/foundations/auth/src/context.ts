/**
 * Framework-agnostic auth context shared across the stack. The Next.js app
 * resolves Clerk's `auth()` at the edge and maps it into this shape via
 * {@link toAuthContext} before handing it to a feature's tRPC context, so
 * lower layers never depend on Clerk directly.
 */
export interface AuthContext {
  userId: string | null;
  sessionId?: string | null;
  orgId?: string | null;
  getToken?: (options?: { template?: string }) => Promise<string | null>;
}

export function toAuthContext(auth: AuthContext): AuthContext {
  return {
    userId: auth.userId ?? null,
    sessionId: auth.sessionId ?? null,
    orgId: auth.orgId ?? null,
    getToken: auth.getToken,
  };
}

export const anonymousAuthContext = (): AuthContext => ({ userId: null });
