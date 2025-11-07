import { pgTable, serial, varchar, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';

/**
 * Wallets table - Stores wallet addresses connected to workspaces
 *
 * Each wallet can be connected to multiple chains (stored in wallet_chains)
 * This is a read-only tracking system - no private keys stored
 */
export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),

  // Workspace relationship
  workspaceId: integer('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),

  // Wallet info
  address: varchar('address', { length: 255 }).notNull(), // Ethereum address (0x...)
  label: varchar('label', { length: 255 }), // User-defined label (e.g., "Treasury", "Operations")

  // Status
  isActive: boolean('is_active').default(true).notNull(),
  lastSyncedAt: timestamp('last_synced_at'), // Last time we synced blockchain data

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;
