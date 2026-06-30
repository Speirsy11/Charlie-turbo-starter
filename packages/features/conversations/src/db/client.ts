import "server-only";

import { createDb } from "@charlie/db";

import { env } from "../env";
import * as schema from "./schema";

/**
 * The conversations feature owns its schema and builds a typed Drizzle client
 * over it via the db foundation's `createDb` factory.
 */
export const db = createDb(
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  schema,
);

export type Db = typeof db;
