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
