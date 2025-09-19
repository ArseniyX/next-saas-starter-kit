import { drizzle } from "drizzle-orm/vercel-postgres"
import { sql } from "@vercel/postgres"
import * as schema from "./schema"

// Use Vercel Postgres for both local and production
export const db = drizzle(sql, { schema })

export * from "./schema"