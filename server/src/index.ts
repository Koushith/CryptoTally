import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { env, isDevelopment } from './config/env';
import routes from './routes';

const app = express();

/**
 * Middleware
 */
// Disable helmet in development for easier testing
if (!isDevelopment) {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
}
app.use(
  cors({
    origin: '*', // Allow all origins
    credentials: true,
  })
);
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
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         🚀 CryptoTally Server Started                 ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Environment information
  console.log('📋 Environment Configuration:');
  console.log(`   └─ Mode: ${env.NODE_ENV}`);
  console.log(`   └─ Port: ${env.PORT}`);

  console.log('');
  console.log('🔗 Server URLs:');
  console.log(`   └─ API: http://localhost:${env.PORT}/api`);
  console.log(`   └─ Health: http://localhost:${env.PORT}/api/health`);
  console.log('');

  // Check PostgreSQL connection
  try {
    const { pool } = await import('./config/database');
    await pool.query('SELECT NOW()');
    const dbUrl = env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'Unknown'; // Mask password
    console.log(`🐘 PostgreSQL:`);
    console.log(`   └─ Status: ✅ Connected`);
    console.log(`   └─ URL: ${dbUrl}`);
  } catch (error) {
    console.log(`🐘 PostgreSQL:`);
    console.log(`   └─ Status: ❌ Connection failed`);
    console.log(`   └─ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.log(`   └─ Tip: brew services start postgresql@18`);
  }

  console.log('\n' + '─'.repeat(56) + '\n');
  console.log('✨ Server is ready to handle requests!\n');
});

export default app;
