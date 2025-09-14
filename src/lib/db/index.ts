import { drizzle } from "drizzle-orm/vercel-postgres"
import { sql } from "@vercel/postgres"
import * as schema from "./schema"

// Use Vercel Postgres for both local and production
// For local development, you'll need to set up a local PostgreSQL database
// or use Vercel's database preview environments
export const db = drizzle(sql, { schema })

export * from "./schema"