import { drizzle as drizzlePg } from "drizzle-orm/vercel-postgres"
import { sql } from "@vercel/postgres"
import * as schema from "./schema"

let db: any

if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
  // Use PostgreSQL in production or when DATABASE_URL is set
  db = drizzlePg(sql, { schema })
} else {
  // Use SQLite for local development only
  // Dynamic import to avoid build issues in production
  const { drizzle } = require("drizzle-orm/better-sqlite3")
  const Database = require("better-sqlite3")
  const sqlite = new Database("dev.db")
  db = drizzle(sqlite, { schema })
}

export { db }
export * from "./schema"