export { createDb, type DbConnectionConfig } from "./client";

// Re-export Drizzle's SQL helpers (eq, desc, and, sql, …) so features build
// queries from a single `@charlie/db` import.
export * from "drizzle-orm/sql";
export { alias } from "drizzle-orm/pg-core";
