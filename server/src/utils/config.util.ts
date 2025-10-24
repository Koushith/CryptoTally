import { env, isProduction, isDevelopment } from '../config/env';

// Production URLs - single source of truth
const PROD_URLS = {
  API: process.env.PROD_API_URL || 'https://api.cryptotally.xyz',
  FRONTEND: process.env.PROD_FRONTEND_URL || 'https://app.cryptotally.xyz',
  WEB: process.env.PROD_WEB_URL || 'https://www.cryptotally.xyz',
} as const;

// Local development URLs
const LOCAL_URLS = {
  API: `http://localhost:${env.PORT}`,
  FRONTEND: 'http://localhost:5173',  // Vite dev server
  WEB: 'http://localhost:3000',       // Landing page
} as const;

/**
 * Get the appropriate URL based on environment
 */
export const getUrl = () => {
  return {
    api: isProduction ? PROD_URLS.API : LOCAL_URLS.API,
    frontend: isProduction ? PROD_URLS.FRONTEND : LOCAL_URLS.FRONTEND,
    web: isProduction ? PROD_URLS.WEB : LOCAL_URLS.WEB,
  };
};

/**
 * Get CORS origin based on environment
 */
export const getCorsOrigin = () => {
  if (isDevelopment) {
    return [LOCAL_URLS.FRONTEND, LOCAL_URLS.WEB];
  }
  return [PROD_URLS.FRONTEND, PROD_URLS.WEB];
};

/**
 * Get full API endpoint URL
 */
export const getApiEndpoint = (path: string) => {
  const { api } = getUrl();
  return `${api}/api${path.startsWith('/') ? path : `/${path}`}`;
};
