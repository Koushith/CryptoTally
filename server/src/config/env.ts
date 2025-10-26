import dotenv from 'dotenv';

const useProdEnvFile = true;

// Load .env.local
dotenv.config({ path: useProdEnvFile ? '.env' : '.env.local' });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '5000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  PROD_DATABASE_URL: process.env.PROD_DATABASE_URL || '',
} as const;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
