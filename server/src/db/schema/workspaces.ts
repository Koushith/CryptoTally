import { pgTable, serial, varchar, timestamp, text, integer, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * Workspaces table - Organization/workspace data
 *
 * Workspaces can be personal (individual) or organization (team)
 * Each user can belong to multiple workspaces
 */
export const workspaces = pgTable('workspaces', {
  id: serial('id').primaryKey(),

  // Workspace info
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(), // URL-friendly identifier
  description: text('description'),

  // Workspace type
  type: varchar('type', { length: 50 }).notNull(), // 'personal', 'organization'

  // Owner (creator of workspace)
  ownerId: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Settings
  logoUrl: text('logo_url'),
  isActive: boolean('is_active').default(true).notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
