import { pgTable, text, integer, timestamp, index, boolean } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  role: text("role").default("user").notNull(),

  // Profile information
  phone: text("phone"),
  company: text("company"),
  location: text("location"),

  // Settings
  theme: text("theme").default("system"),
  language: text("language").default("en"),
  timezone: text("timezone").default("UTC"),

  // Notifications preferences
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(false),
  securityAlerts: boolean("security_alerts").default(true),
  marketingEmails: boolean("marketing_emails").default(false),
  weeklyReports: boolean("weekly_reports").default(true),
  billingUpdates: boolean("billing_updates").default(true),
}, (table) => {
  return {
    emailIdx: index("email_idx").on(table.email),
  }
})

// Sessions table
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("session_user_id_idx").on(table.userId),
  }
})

// Accounts table (for OAuth providers)
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("account_user_id_idx").on(table.userId),
  }
})

// Verification tokens
export const verificationTokens = pgTable("verification_tokens", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    tokenIdx: index("verification_token_idx").on(table.token),
  }
})

// Entities table (for the entities management feature)
export const entities = pgTable("entities", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").default("viewer").notNull(),
  status: text("status").default("pending").notNull(),
  avatar: text("avatar"),
  phone: text("phone"),
  company: text("company"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: text("created_by").references(() => users.id),
}, (table) => {
  return {
    emailIdx: index("entity_email_idx").on(table.email),
    createdByIdx: index("entity_created_by_idx").on(table.createdBy),
  }
})

// Billing/subscription table
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planName: text("plan_name").notNull(),
  planPrice: integer("plan_price").notNull(), // in cents
  billingCycle: text("billing_cycle").notNull(),
  status: text("status").default("active").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("subscription_user_id_idx").on(table.userId),
  }
})

// Subscription Plans
export const plans = pgTable("plans", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  stripePriceId: text("stripe_price_id").notNull().unique(),
  price: integer("price").notNull(), // in cents
  currency: text("currency").notNull().default("usd"),
  interval: text("interval").notNull(),
  features: text("features").notNull(), // JSON string
  limits: text("limits"), // JSON string for usage limits
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Payment History
export const payments = pgTable("payments", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: text("subscription_id").references(() => subscriptions.id),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").notNull().default("usd"),
  status: text("status").notNull(),
  invoiceUrl: text("invoice_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index("payment_user_id_idx").on(table.userId),
  }
})

// Usage tracking
export const usage = pgTable("usage", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: text("subscription_id").references(() => subscriptions.id),
  apiCalls: integer("api_calls").default(0).notNull(),
  storage: integer("storage").default(0).notNull(), // in bytes
  users: integer("users").default(0).notNull(),
  resetAt: timestamp("reset_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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