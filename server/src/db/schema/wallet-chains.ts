import { pgTable, serial, varchar, timestamp, integer, decimal, boolean } from 'drizzle-orm/pg-core';
import { wallets } from './wallets';

/**
 * Wallet Chains table - Tracks which chains each wallet has activity on
 *
 * Stores chain-specific data for each wallet (balance, transaction count, etc.)
 * Each wallet can have multiple chain records
 */
export const walletChains = pgTable('wallet_chains', {
  id: serial('id').primaryKey(),

  // Wallet relationship
  walletId: integer('wallet_id')
    .notNull()
    .references(() => wallets.id, { onDelete: 'cascade' }),

  // Chain info
  chainName: varchar('chain_name', { length: 100 }).notNull(), // 'Ethereum', 'Polygon', etc.
  chainId: integer('chain_id').notNull(), // 1 for Ethereum, 137 for Polygon, etc.

  // Activity data
  hasActivity: boolean('has_activity').notNull().default(false),
  transactionCount: integer('transaction_count').default(0).notNull(),

  // Balance info (stored as string to handle large numbers)
  balance: varchar('balance', { length: 255 }), // Native token balance (e.g., ETH, MATIC)
  balanceUsd: decimal('balance_usd', { precision: 20, scale: 2 }), // USD value

  // Last activity
  lastActivityAt: timestamp('last_activity_at'),
  lastActivityDescription: varchar('last_activity_description', { length: 500 }),

  // Sync status
  lastSyncedAt: timestamp('last_synced_at'),
  syncStatus: varchar('sync_status', { length: 50 }).default('pending'), // 'pending', 'syncing', 'synced', 'error'

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type WalletChain = typeof walletChains.$inferSelect;
export type NewWalletChain = typeof walletChains.$inferInsert;
