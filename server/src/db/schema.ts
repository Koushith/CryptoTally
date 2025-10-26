import { pgTable, serial, varchar, timestamp, text } from 'drizzle-orm/pg-core';

/**
 * Feedback table - stores user feedback and feature requests
 */
export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  type: varchar('type', { length: 50 }).notNull(), // 'bug', 'feature', 'improvement', 'other'
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Waitlist table - stores email signups for waitlist with detailed profile info
 */
export const waitlist = pgTable('waitlist', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),

  // Profile information
  userType: varchar('user_type', { length: 50 }), // 'individual', 'startup', 'freelancer', 'enterprise'
  companyName: varchar('company_name', { length: 255 }),
  teamSize: varchar('team_size', { length: 50 }), // '1', '2-10', '11-50', '51-200', '200+'
  paymentVolume: varchar('payment_volume', { length: 50 }), // '<10k', '10k-100k', '>100k'
  useCase: text('use_case'), // What they plan to use it for

  // Additional info
  source: varchar('source', { length: 50 }), // 'landing' or 'app'
  referralSource: varchar('referral_source', { length: 100 }), // How they heard about us

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Example users table - for future authentication
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
