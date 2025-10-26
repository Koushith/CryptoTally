import dotenv from 'dotenv';

//const useProdEnvFile = false; //  Change to false when developing locally

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
// Load .env.local
dotenv.config({ path: isDevelopment ? '.env.local' : '.env' });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '5000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  PROD_DATABASE_URL: process.env.PROD_DATABASE_URL || '',
} as const;
