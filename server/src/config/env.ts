import dotenv from 'dotenv';

// Load .env.local first (for local development), fall back to .env (for production)
dotenv.config({ path: '.env.local' });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '8000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  PROD_DATABASE_URL: process.env.PROD_DATABASE_URL || '',
} as const;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
