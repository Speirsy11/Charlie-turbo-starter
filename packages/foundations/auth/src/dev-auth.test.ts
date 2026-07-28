import { afterEach, describe, expect, it, vi } from "vitest";

import {
  assertDevAuthNotInProduction,
  devAuthUserId,
  isDevAuthEnabled,
} from "./dev-auth";
import { resolveAuthContext } from "./server";

const { clerkAuth } = vi.hoisted(() => ({ clerkAuth: vi.fn() }));

vi.mock("@clerk/nextjs/server", () => ({ auth: clerkAuth }));

afterEach(() => {
  vi.unstubAllEnvs();
  clerkAuth.mockReset();
});

describe("development auth bypass", () => {
  it("resolves the configured user only in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_AUTH_USER_ID", "  user_dev_123  ");

    expect(devAuthUserId()).toBe("user_dev_123");
    expect(isDevAuthEnabled()).toBe(true);
  });

  it("provides the development user to protected server contexts without Clerk", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_AUTH_USER_ID", "user_dev_123");

    await expect(resolveAuthContext()).resolves.toEqual({
      userId: "user_dev_123",
    });
    expect(clerkAuth).not.toHaveBeenCalled();
  });

  it("uses Clerk when the development identity is not configured", async () => {
    const getToken = vi.fn();
    clerkAuth.mockResolvedValue({
      userId: "user_clerk_123",
      sessionId: "session_123",
      orgId: "org_123",
      getToken,
    });

    await expect(resolveAuthContext()).resolves.toEqual({
      userId: "user_clerk_123",
      sessionId: "session_123",
      orgId: "org_123",
      getToken,
    });
    expect(clerkAuth).toHaveBeenCalledOnce();
  });

  it("is disabled outside development even when configured", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("DEV_AUTH_USER_ID", "user_dev_123");

    expect(devAuthUserId()).toBeNull();
    expect(isDevAuthEnabled()).toBe(false);
  });

  it("fails closed when configured for production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DEV_AUTH_USER_ID", "user_dev_123");

    expect(assertDevAuthNotInProduction).toThrow(
      "DEV_AUTH_USER_ID is set in a production build",
    );
  });
});
