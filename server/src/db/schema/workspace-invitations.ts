import { pgTable, serial, varchar, timestamp, text, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { workspaces } from './workspaces';
import { users } from './users';

/**
 * Workspace Invitations table - Magic link invitations
 *
 * Allows inviting users via secure magic link even if they don't have an account yet
 * Security features:
 * - Cryptographically secure unique tokens
 * - One-time use (status changes to 'accepted' after use)
 * - Expiration (7 days default)
 * - Cannot reuse accepted/expired/revoked invitations
 */
export const workspaceInvitations = pgTable(
  'workspace_invitations',
  {
    id: serial('id').primaryKey(),

    // Workspace and user references
    workspaceId: integer('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    email: text('email').notNull(), // Email of invited user (may not exist yet)

    // Role assignment
    role: varchar('role', { length: 20 }).notNull().default('viewer'), // 'admin', 'editor', 'viewer'

    // Security
    token: text('token').notNull().unique(), // Cryptographically secure random token
    status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'accepted', 'expired', 'revoked'
    expiresAt: timestamp('expires_at').notNull(), // Token expiration (7 days)

    // Metadata
    invitedBy: integer('invited_by')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }), // Who sent the invitation
    acceptedAt: timestamp('accepted_at'), // When invitation was accepted

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // Index for fast token lookups
    tokenIdx: index('idx_workspace_invitations_token').on(table.token),

    // Index for email and status lookups
    emailStatusIdx: index('idx_workspace_invitations_email_status').on(table.email, table.status),

    // Index for workspace lookups
    workspaceIdx: index('idx_workspace_invitations_workspace_id').on(table.workspaceId),

    // Unique constraint: prevent duplicate pending invitations for same email+workspace
    uniquePendingIdx: uniqueIndex('idx_workspace_invitations_unique_pending')
      .on(table.workspaceId, table.email, table.status)
      .where(sql`status = 'pending'`),
  })
);

export type WorkspaceInvitation = typeof workspaceInvitations.$inferSelect;
export type NewWorkspaceInvitation = typeof workspaceInvitations.$inferInsert;
