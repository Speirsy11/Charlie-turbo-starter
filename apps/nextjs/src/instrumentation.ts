import { assertDevAuthNotInProduction } from "@charlie/auth/server";

/** Runs before requests so an unsafe production bypass prevents startup. */
export function register() {
  assertDevAuthNotInProduction();
}
