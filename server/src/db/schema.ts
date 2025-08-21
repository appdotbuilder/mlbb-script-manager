import { serial, text, pgTable, timestamp, jsonb, pgEnum, inet } from 'drizzle-orm/pg-core';

// Define enum for script categories
export const scriptCategoryEnum = pgEnum('script_category', ['MLBB', 'MCGG']);

// Scripts table
export const scriptsTable = pgTable('scripts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: scriptCategoryEnum('category').notNull(),
  preview_image_url: text('preview_image_url').notNull(),
  download_urls: jsonb('download_urls').notNull(), // JSON array of strings for download URLs
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Visitors table for tracking page visits
export const visitorsTable = pgTable('visitors', {
  id: serial('id').primaryKey(),
  ip_address: inet('ip_address').notNull(), // Use inet type for IP addresses
  visited_at: timestamp('visited_at').defaultNow().notNull()
});

// TypeScript types for the table schemas
export type Script = typeof scriptsTable.$inferSelect;
export type NewScript = typeof scriptsTable.$inferInsert;

export type Visitor = typeof visitorsTable.$inferSelect;
export type NewVisitor = typeof visitorsTable.$inferInsert;

// Important: Export all tables for proper query building
export const tables = { 
  scripts: scriptsTable, 
  visitors: visitorsTable 
};