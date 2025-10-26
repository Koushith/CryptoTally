import { isProduction } from '../config/env';
import { sendServerNotification } from '../services/telegram.service';

/**
 * Server Lifecycle Handlers
 * Manages server startup, shutdown, and crash notifications
 */

/**
 * Send startup notification (production only)
 */
export async function notifyServerStartup(): Promise<void> {
  if (!isProduction) return;

  sendServerNotification('startup').catch(err => {
    console.error('Failed to send startup notification:', err);
  });
}

/**
 * Graceful shutdown handler
 */
async function handleShutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  if (isProduction) {
    await sendServerNotification('shutdown').catch(err => {
      console.error('Failed to send shutdown notification:', err);
    });
  }

  process.exit(0);
}

/**
 * Uncaught exception handler
 */
async function handleUncaughtException(error: Error): Promise<void> {
  console.error('💥 Uncaught Exception:', error);

  if (isProduction) {
    await sendServerNotification('crash', error.message).catch(err => {
      console.error('Failed to send crash notification:', err);
    });
  }

  process.exit(1);
}

/**
 * Unhandled promise rejection handler
 */
async function handleUnhandledRejection(reason: any): Promise<void> {
  console.error('💥 Unhandled Rejection:', reason);

  const errorMessage = reason instanceof Error ? reason.message : String(reason);

  if (isProduction) {
    await sendServerNotification('crash', `Unhandled Promise Rejection: ${errorMessage}`).catch(err => {
      console.error('Failed to send crash notification:', err);
    });
  }

  process.exit(1);
}

/**
 * Register all process event handlers
 */
export function registerProcessHandlers(): void {
  // Graceful shutdown
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));

  // Error handlers
  process.on('uncaughtException', handleUncaughtException);
  process.on('unhandledRejection', handleUnhandledRejection);
}
