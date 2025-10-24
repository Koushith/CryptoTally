import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env, isDevelopment } from './config/env';
import { getCorsOrigin } from './utils/config.util';
import routes from './routes';

const app = express();

/**
 * Middleware
 */
app.use(helmet());
app.use(cors({
  origin: getCorsOrigin(),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Request logging middleware (development only)
 */
if (isDevelopment) {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

/**
 * Routes
 */
app.use('/api', routes);

/**
 * Root route
 */
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'CryptoTally API',
    version: '1.0.0',
    status: 'running',
  });
});

/**
 * 404 handler
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
});

/**
 * Error handler
 */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'An unexpected error occurred',
  });
});

/**
 * Start server
 */
app.listen(env.PORT, async () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 API: http://localhost:${env.PORT}/api`);
  console.log(`💚 Health check: http://localhost:${env.PORT}/api/health`);

  // Check PostgreSQL connection
  try {
    const { pool } = await import('./config/database');
    await pool.query('SELECT NOW()');
    console.log(`🐘 PostgreSQL connected at localhost:5432`);
  } catch (error) {
    console.error(`❌ PostgreSQL connection failed:`, error instanceof Error ? error.message : 'Unknown error');
    console.log(`💡 Make sure PostgreSQL is running: brew services start postgresql@18`);
  }
});

export default app;
