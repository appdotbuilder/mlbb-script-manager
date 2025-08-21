import { z } from 'zod';

// Script categories enum
export const scriptCategorySchema = z.enum(['MLBB', 'MCGG']);
export type ScriptCategory = z.infer<typeof scriptCategorySchema>;

// Script schema
export const scriptSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: scriptCategorySchema,
  preview_image_url: z.string(),
  download_urls: z.array(z.string()).min(2).max(4), // 2-4 download URLs
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Script = z.infer<typeof scriptSchema>;

// Input schema for creating scripts
export const createScriptInputSchema = z.object({
  name: z.string().min(1, "Script name is required"),
  category: scriptCategorySchema,
  preview_image_url: z.string().url("Valid image URL is required"),
  download_urls: z.array(z.string().url("Valid download URL is required")).min(2, "At least 2 download URLs required").max(4, "Maximum 4 download URLs allowed")
});

export type CreateScriptInput = z.infer<typeof createScriptInputSchema>;

// Input schema for updating scripts
export const updateScriptInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  category: scriptCategorySchema.optional(),
  preview_image_url: z.string().url().optional(),
  download_urls: z.array(z.string().url()).min(2).max(4).optional()
});

export type UpdateScriptInput = z.infer<typeof updateScriptInputSchema>;

// Visitor tracking schema
export const visitorSchema = z.object({
  id: z.number(),
  ip_address: z.string(),
  visited_at: z.coerce.date()
});

export type Visitor = z.infer<typeof visitorSchema>;

// Input schema for tracking visitors
export const trackVisitorInputSchema = z.object({
  ip_address: z.string().ip("Valid IP address is required")
});

export type TrackVisitorInput = z.infer<typeof trackVisitorInputSchema>;

// Admin authentication schema
export const adminLoginInputSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

export type AdminLoginInput = z.infer<typeof adminLoginInputSchema>;

// Admin session response schema
export const adminSessionSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  token: z.string().optional()
});

export type AdminSession = z.infer<typeof adminSessionSchema>;

// Dashboard stats schema
export const dashboardStatsSchema = z.object({
  unique_visitors_today: z.number().int().nonnegative(),
  total_scripts: z.number().int().nonnegative(),
  scripts_by_category: z.record(scriptCategorySchema, z.number().int().nonnegative())
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Query schemas
export const getScriptsByCategoryInputSchema = z.object({
  category: scriptCategorySchema
});

export type GetScriptsByCategoryInput = z.infer<typeof getScriptsByCategoryInputSchema>;

export const getScriptByIdInputSchema = z.object({
  id: z.number()
});

export type GetScriptByIdInput = z.infer<typeof getScriptByIdInputSchema>;

export const deleteScriptInputSchema = z.object({
  id: z.number()
});

export type DeleteScriptInput = z.infer<typeof deleteScriptInputSchema>;