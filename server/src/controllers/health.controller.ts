import { Request, Response } from 'express';
import { pool } from '../config/database';
import { env } from '../config/env';

/**
 * Health check controller
 * GET /api/health
 */
export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Basic health check (without DB check)
 * GET /api/health/ping
 */
export const ping = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    message: 'pong',
    timestamp: new Date().toISOString(),
  });
};
