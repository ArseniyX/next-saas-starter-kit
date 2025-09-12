import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"
import { createId } from "@paralleldrive/cuid2"

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  role: text("role", { enum: ["admin", "user"] }).default("user").notNull(),
  
  // Profile information
  phone: text("phone"),
  company: text("company"),
  location: text("location"),
  
  // Settings
  theme: text("theme", { enum: ["light", "dark", "system"] }).default("system"),
  language: text("language").default("en"),
  timezone: text("timezone").default("UTC"),
  
  // Notifications preferences
  emailNotifications: integer("email_notifications", { mode: "boolean" }).default(true),
  pushNotifications: integer("push_notifications", { mode: "boolean" }).default(false),
  securityAlerts: integer("security_alerts", { mode: "boolean" }).default(true),
  marketingEmails: integer("marketing_emails", { mode: "boolean" }).default(false),
  weeklyReports: integer("weekly_reports", { mode: "boolean" }).default(true),
  billingUpdates: integer("billing_updates", { mode: "boolean" }).default(true),
}, (table) => {
  return {
    emailIdx: index("email_idx").on(table.email),
  }
})

// Sessions table
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
}, (table) => {
  return {
    userIdIdx: index("session_user_id_idx").on(table.userId),
  }
})

// Accounts table (for OAuth providers)
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
}, (table) => {
  return {
    userIdIdx: index("account_user_id_idx").on(table.userId),
  }
})

// Verification tokens
export const verificationTokens = sqliteTable("verification_tokens", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
}, (table) => {
  return {
    tokenIdx: index("verification_token_idx").on(table.token),
  }
})

// Entities table (for the entities management feature)
export const entities = sqliteTable("entities", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["admin", "editor", "viewer"] }).default("viewer").notNull(),
  status: text("status", { enum: ["active", "inactive", "pending"] }).default("pending").notNull(),
  avatar: text("avatar"),
  phone: text("phone"),
  company: text("company"),
  lastLogin: integer("last_login", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  createdBy: text("created_by").references(() => users.id),
}, (table) => {
  return {
    emailIdx: index("entity_email_idx").on(table.email),
    createdByIdx: index("entity_created_by_idx").on(table.createdBy),
  }
})

// Billing/subscription table
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planName: text("plan_name").notNull(),
  planPrice: integer("plan_price").notNull(), // in cents
  billingCycle: text("billing_cycle", { enum: ["monthly", "yearly"] }).notNull(),
  status: text("status", { enum: ["active", "cancelled", "past_due", "trialing"] }).default("active").notNull(),
  currentPeriodStart: integer("current_period_start", { mode: "timestamp" }).notNull(),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }).notNull(),
  cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" }).default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
}, (table) => {
  return {
    userIdIdx: index("subscription_user_id_idx").on(table.userId),
  }
})

// Subscription Plans
export const plans = sqliteTable("plans", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  stripePriceId: text("stripe_price_id").notNull().unique(),
  price: integer("price").notNull(), // in cents
  currency: text("currency").notNull().default("usd"),
  interval: text("interval", { enum: ["month", "year"] }).notNull(),
  features: text("features").notNull(), // JSON string
  limits: text("limits"), // JSON string for usage limits
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
})

// Payment History
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: text("subscription_id").references(() => subscriptions.id),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").notNull().default("usd"),
  status: text("status").notNull(),
  invoiceUrl: text("invoice_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
}, (table) => {
  return {
    userIdIdx: index("payment_user_id_idx").on(table.userId),
  }
})

// Usage tracking
export const usage = sqliteTable("usage", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: text("subscription_id").references(() => subscriptions.id),
  apiCalls: integer("api_calls").default(0).notNull(),
  storage: integer("storage").default(0).notNull(), // in bytes
  users: integer("users").default(0).notNull(),
  resetAt: integer("reset_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
}, (table) => {
  return {
    userIdIdx: index("usage_user_id_idx").on(table.userId),
  }
})

// Export types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert
export type Entity = typeof entities.$inferSelect
export type NewEntity = typeof entities.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
export type Plan = typeof plans.$inferSelect
export type NewPlan = typeof plans.$inferInsert
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
export type Usage = typeof usage.$inferSelect
export type NewUsage = typeof usage.$inferInsert