import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { env, isDevelopment, isProduction } from './config/env';
import routes from './routes';
import { getBaseUrl } from './utils/config.util';
import { generalLimiter } from './middleware/rateLimiter.middleware';
import { sendServerNotification } from './services/telegram.service';

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
 * Rate limiting middleware
 * Applied to all routes for baseline protection
 */
app.use('/api', generalLimiter);

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

  const apiUrl = getBaseUrl('backend');
  console.log('');
  console.log('🔗 Server URLs:');
  console.log(`   └─ API: ${apiUrl}/api`);
  console.log(`   └─ Health: ${apiUrl}/api/health`);
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

  // Send startup notification to Telegram (production only)
  if (isProduction) {
    sendServerNotification('startup').catch(err => {
      console.error('Failed to send startup notification:', err);
    });
  }
});

/**
 * Graceful shutdown handlers
 */
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Send shutdown notification
  await sendServerNotification('shutdown').catch(err => {
    console.error('Failed to send shutdown notification:', err);
  });

  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

/**
 * Uncaught exception handler
 */
process.on('uncaughtException', async (error: Error) => {
  console.error('💥 Uncaught Exception:', error);

  await sendServerNotification('crash', error.message).catch(err => {
    console.error('Failed to send crash notification:', err);
  });

  process.exit(1);
});

/**
 * Unhandled promise rejection handler
 */
process.on('unhandledRejection', async (reason: any) => {
  console.error('💥 Unhandled Rejection:', reason);

  const errorMessage = reason instanceof Error ? reason.message : String(reason);

  await sendServerNotification('crash', `Unhandled Promise Rejection: ${errorMessage}`).catch(err => {
    console.error('Failed to send crash notification:', err);
  });

  process.exit(1);
});

export default app;
