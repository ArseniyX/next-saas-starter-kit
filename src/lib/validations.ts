import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
});

export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  securityAlerts: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  weeklyReports: z.boolean().optional(),
  billingUpdates: z.boolean().optional(),
});

// Entity validation schemas
export const createEntitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'editor', 'viewer']).default('viewer'),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  phone: z.string().optional(),
  company: z.string().optional(),
});

export const updateEntitySchema = createEntitySchema.partial();

// Subscription validation schemas
export const createCheckoutSessionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
});

export const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription ID is required'),
});

// API request validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  filters: z.object({
    status: z.enum(['active', 'inactive', 'pending']).optional(),
    role: z.enum(['admin', 'editor', 'viewer']).optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
  }).optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
  size: z.number().positive().max(10 * 1024 * 1024), // 10MB max
});

// Webhook validation
export const stripeWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.record(z.any()),
  }),
});

// Helper function to validate and parse data
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

// Type exports
export type UserInput = z.infer<typeof userSchema>;
export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
export type CreateEntityInput = z.infer<typeof createEntitySchema>;
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;