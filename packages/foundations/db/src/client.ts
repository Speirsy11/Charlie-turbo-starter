import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";

export interface DbConnectionConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

/**
 * Creates a Drizzle client over a plain PostgreSQL database (postgres.js).
 *
 * Overloaded so features that pass their own schema get fully typed relational
 * queries (`db.query.*`), while callers that only need raw SQL can omit it.
 * Each feature owns its schema and calls this with discrete connection params
 * from its validated `env`.
 *
 * @example
 * // With schema (typed queries):
 * export const db = createDb(
 *   { host: env.DB_HOST, port: env.DB_PORT, user: env.DB_USER, password: env.DB_PASSWORD, database: env.DB_NAME },
 *   schema,
 * );
 */
export function createDb<TSchema extends Record<string, unknown>>(
  connection: DbConnectionConfig,
  schema: TSchema,
): PostgresJsDatabase<TSchema>;
export function createDb(
  connection: DbConnectionConfig,
): PostgresJsDatabase<Record<never, never>>;
export function createDb<TSchema extends Record<string, unknown>>(
  connection: DbConnectionConfig,
  schema?: TSchema,
) {
  return schema
    ? drizzle({ connection, schema, casing: "snake_case" })
    : drizzle({ connection, casing: "snake_case" });
}
