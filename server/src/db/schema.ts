import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

/**
 * Example table - replace with your actual schema
 * This is a placeholder to make drizzle-kit work
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Add more tables here as needed
