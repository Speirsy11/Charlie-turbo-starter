import { clerkMiddleware } from "@clerk/nextjs/server";

import { isDevAuthEnabled } from "@charlie/auth/server";

const withClerk = clerkMiddleware();

/**
 * Clerk's development handshake runs before its callback, so a local bypass
 * must skip the middleware altogether. The shared predicate is false outside
 * NODE_ENV=development.
 */
export default function proxy(...args: Parameters<typeof withClerk>) {
  if (isDevAuthEnabled()) return undefined;
  return withClerk(...args);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
