import { pgTable, serial, integer, varchar, timestamp, boolean, unique } from 'drizzle-orm/pg-core';
import { users } from './users';
import { workspaces } from './workspaces';

/**
 * Workspace Members table - User membership in workspaces
 *
 * Defines which users belong to which workspaces and their roles
 * Role-based access control: admin, contributor, viewer
 */
export const workspaceMembers = pgTable(
  'workspace_members',
  {
    id: serial('id').primaryKey(),

    // Relationships
    workspaceId: integer('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // Role and permissions
    role: varchar('role', { length: 50 }).notNull(), // 'admin', 'contributor', 'viewer'

    // Invitation info
    invitedBy: integer('invited_by').references(() => users.id),
    invitedAt: timestamp('invited_at'),
    joinedAt: timestamp('joined_at').defaultNow(),

    // Status
    isActive: boolean('is_active').default(true).notNull(),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // Ensure a user can only be a member once per workspace
    uniqueWorkspaceUser: unique().on(table.workspaceId, table.userId),
  })
);

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
