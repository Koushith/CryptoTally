import { pgTable, serial, varchar, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * Passkeys (WebAuthn Credentials)
 *
 * Stores WebAuthn credentials for passwordless authentication
 * Multiple passkeys can be registered per user (different devices)
 */
export const passkeys = pgTable('passkeys', {
  id: serial('id').primaryKey(),

  // Link to user
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // WebAuthn credential data
  credentialId: text('credential_id').notNull().unique(), // Base64URL encoded credential ID
  publicKey: text('public_key').notNull(), // Base64URL encoded public key
  counter: integer('counter').notNull().default(0), // Signature counter for replay protection

  // Credential metadata
  deviceType: varchar('device_type', { length: 50 }), // 'platform' (Face ID/Touch ID) or 'cross-platform' (USB key)
  backupEligible: boolean('backup_eligible').default(false), // Can be backed up to cloud
  backupState: boolean('backup_state').default(false), // Currently backed up
  transports: text('transports'), // JSON array: ['usb', 'nfc', 'ble', 'internal']

  // User-friendly name
  name: varchar('name', { length: 255 }), // e.g., "MacBook Pro Touch ID", "iPhone 15"

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at'),
});

/**
 * Passkey Challenges
 *
 * Temporary storage for authentication challenges
 * Prevents replay attacks
 */
export const passkeysChallenges = pgTable('passkeys_challenges', {
  id: serial('id').primaryKey(),
  challenge: text('challenge').notNull().unique(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 20 }).notNull(), // 'registration' or 'authentication'
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
