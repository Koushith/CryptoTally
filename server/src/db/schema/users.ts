import { pgTable, serial, varchar, timestamp, text, boolean } from 'drizzle-orm/pg-core';

/**
 * Users table - Authentication and profile data
 *
 * This table stores user account information from Firebase Auth
 * and additional profile data synced to PostgreSQL
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  // Firebase Auth ID (uid from Firebase)
  firebaseUid: varchar('firebase_uid', { length: 128 }).notNull().unique(),

  // Basic profile
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  photoUrl: text('photo_url'),

  // Auth provider info
  authProvider: varchar('auth_provider', { length: 50 }).notNull(), // 'google', 'email', 'passkey'
  emailVerified: boolean('email_verified').default(false).notNull(),

  // Account status
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
