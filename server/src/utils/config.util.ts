import { env, isProduction } from '../config/env';

// Production URLs - single source of truth
const PROD_URLS = {
  API: process.env.PROD_API_URL || 'https://api.cryptotally.xyz',
  FRONTEND: process.env.PROD_FRONTEND_URL || 'https://app.cryptotally.xyz',
  WEB: process.env.PROD_WEB_URL || 'https://www.cryptotally.xyz',
} as const;

// Local development URLs
const LOCAL_URLS = {
  API: `http://localhost:${env.PORT}`,
  FRONTEND: 'http://localhost:5173',  // Vite dev server default
  FRONTEND_ALT: 'http://localhost:5174',  // Vite dev server alternate
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
 * Always includes localhost for local testing
 */
export const getCorsOrigin = (): string[] => {
  const origins: string[] = [
    LOCAL_URLS.FRONTEND,      // http://localhost:5173
    LOCAL_URLS.FRONTEND_ALT,  // http://localhost:5174
    LOCAL_URLS.WEB,           // http://localhost:3000
  ];

  if (isProduction) {
    origins.push(PROD_URLS.FRONTEND, PROD_URLS.WEB);
  }

  return origins;
};

/**
 * Get full API endpoint URL
 */
export const getApiEndpoint = (path: string) => {
  const { api } = getUrl();
  return `${api}/api${path.startsWith('/') ? path : `/${path}`}`;
};
