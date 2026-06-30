import { describe, expect, it } from "vitest";

import { appRouter } from "../../api/root";
import { createTRPCContext } from "../../api/trpc";

/**
 * Example backend test: the protected procedures must reject unauthenticated
 * callers before ever touching the database, so this runs without a live
 * Postgres. Swap in a seeded test database to assert `create`/`list` behaviour.
 */
function anonymousCaller() {
  const ctx = createTRPCContext({
    headers: new Headers(),
    auth: { userId: null },
  });
  return appRouter.createCaller(ctx);
}

describe("conversations router", () => {
  it("requires auth to list conversations", async () => {
    await expect(anonymousCaller().conversations.list()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("requires auth to create a conversation", async () => {
    await expect(
      anonymousCaller().conversations.create({}),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
