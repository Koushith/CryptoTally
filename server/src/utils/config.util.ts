import { env, isDevelopment } from '../config/env';

export type ServiceType = 'backend' | 'frontend' | 'landing';

export const getBaseUrl = (service: ServiceType = 'backend'): string => {
  const port = env.PORT || 8000;

  switch (service) {
    case 'backend':
      return isDevelopment ? `http://localhost:${port}` : 'https://cryptotally.up.railway.app';

    case 'frontend':
      return isDevelopment ? 'http://localhost:5173' : 'https://app.cryptotally.xyz';

    case 'landing':
      return isDevelopment ? 'http://localhost:3000' : 'https://www.cryptotally.xyz';

    default:
      return isDevelopment ? `http://localhost:${port}` : 'https://cryptotally.up.railway.app';
  }
};

export const getCorsOrigin = (): string[] => {
  const origins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:8000'];

  if (!isDevelopment) {
    origins.push('https://app.cryptotally.xyz', 'https://www.cryptotally.xyz');
  }

  return origins;
};
