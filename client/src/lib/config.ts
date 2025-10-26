const isDevelopment = import.meta.env.MODE === 'development';

export type ServiceType = 'backend' | 'frontend' | 'landing';

export const getBaseUrl = (service: ServiceType = 'backend'): string => {
  switch (service) {
    case 'backend':
      return isDevelopment ? 'http://localhost:8000' : 'https://cryptotally.up.railway.app';

    case 'frontend':
      return isDevelopment ? 'http://localhost:5173' : 'https://app.cryptotally.xyz';

    case 'landing':
      return isDevelopment ? 'http://localhost:3000' : 'https://www.cryptotally.xyz';

    default:
      return isDevelopment ? 'http://localhost:5000' : 'https://cryptotally.up.railway.app';
  }
};
