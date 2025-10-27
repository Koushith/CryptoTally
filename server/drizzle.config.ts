import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load .env.local first if it exists, then fallback to .env
dotenv.config({ path: '.env.local' });
dotenv.config();

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
} satisfies Config;
