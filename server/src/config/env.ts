import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Load .env.local first (for local development), fall back to .env (for production)
const localEnvPath = resolve(process.cwd(), '.env.local');
const prodEnvPath = resolve(process.cwd(), '.env');

if (existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
} else if (existsSync(prodEnvPath)) {
  dotenv.config({ path: prodEnvPath });
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '8000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  PROD_DATABASE_URL: process.env.PROD_DATABASE_URL || '',
  // Alchemy API keys for blockchain access
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY || '',
  ALCHEMY_ETH_URL: process.env.ALCHEMY_ETH_URL || '',
  ALCHEMY_POLYGON_URL: process.env.ALCHEMY_POLYGON_URL || '',
  ALCHEMY_ARBITRUM_URL: process.env.ALCHEMY_ARBITRUM_URL || '',
  ALCHEMY_BASE_URL: process.env.ALCHEMY_BASE_URL || '',
  ALCHEMY_OPTIMISM_URL: process.env.ALCHEMY_OPTIMISM_URL || '',
  // Public RPC URLs
  BSC_RPC_URL: process.env.BSC_RPC_URL || '',
  AVALANCHE_RPC_URL: process.env.AVALANCHE_RPC_URL || '',
  FANTOM_RPC_URL: process.env.FANTOM_RPC_URL || '',
  // Telegram Bot (optional - for notifications)
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
} as const;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
