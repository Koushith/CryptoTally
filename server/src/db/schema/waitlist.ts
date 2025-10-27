import { pgTable, serial, varchar, timestamp, text } from 'drizzle-orm/pg-core';

/**
 * Waitlist table - Email signups for waitlist
 *
 * Stores user information from waitlist signup form with detailed profile data
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

export type Waitlist = typeof waitlist.$inferSelect;
export type NewWaitlist = typeof waitlist.$inferInsert;
