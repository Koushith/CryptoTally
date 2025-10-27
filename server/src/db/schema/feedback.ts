import { pgTable, serial, varchar, timestamp, text } from 'drizzle-orm/pg-core';

/**
 * Feedback table - User feedback and feature requests
 *
 * Stores feedback submitted by users through the feedback form
 */
export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  type: varchar('type', { length: 50 }).notNull(), // 'bug', 'feature', 'improvement', 'other'
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
