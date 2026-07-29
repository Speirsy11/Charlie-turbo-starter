import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Clerk's middleware always runs, even for the dev test session.
 *
 * Skipping it outright breaks every other caller of `auth()` — including the
 * `<Show when="signed-in">` / `<Show when="signed-out">` components on the
 * public landing page, which throw "auth() was called but Clerk can't detect
 * usage of clerkMiddleware()". The dev bypass is handled at the
 * `resolveAuthContext()` level instead, which checks `devAuthUserId()` before
 * calling Clerk.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
