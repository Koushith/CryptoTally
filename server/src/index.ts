import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { env, isDevelopment } from './config/env';
import { generalLimiter } from './middleware/rateLimiter.middleware';
import routes from './routes';
import { registerProcessHandlers, notifyServerStartup } from './utils/server-lifecycle';
import { logServerStartup } from './utils/startup-logger';
import { initializeFirebaseAdmin } from './config/firebase';

// Initialize Firebase Admin SDK
initializeFirebaseAdmin();

const app = express();

// ============================================================================
// Middleware
// ============================================================================

// Security (production only)
if (!isDevelopment) {
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
}

// CORS
app.use(cors({ origin: '*', credentials: true }));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (isDevelopment) {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Rate limiting
app.use('/api', generalLimiter);

// ============================================================================
// Routes
// ============================================================================

app.use('/api', routes);

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'CryptoTally API',
    version: '1.0.0',
    status: 'running',
  });
});

// ============================================================================
// Error Handlers
// ============================================================================

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'An unexpected error occurred',
  });
});

// ============================================================================
// Server Startup
// ============================================================================

app.listen(env.PORT, async () => {
  await logServerStartup();
  await notifyServerStartup();
});

// Register process handlers (shutdown, crash, etc.)
registerProcessHandlers();

export default app;
