import { Request, Response } from 'express';
import { env } from '../config/env';
import { sendDeploymentNotification } from '../services/telegram.service';

/**
 * Webhook Controller
 * Handles external webhook events from various services
 */

// Railway Webhook Payload Types
interface RailwayWebhookPayload {
  type: string;
  status: string;
  project: { id: string; name: string };
  environment: { id: string; name: string };
  service: { id: string; name: string };
  deployment: {
    id: string;
    status: string;
    url?: string;
    createdAt: string;
    meta?: {
      repo?: string;
      branch?: string;
      commitMessage?: string;
      commitAuthor?: string;
    };
  };
  error?: { message: string };
}

/**
 * Handle Railway deployment webhook
 * Endpoint: POST /api/webhooks/railway/deployments
 */
export async function handleRailwayWebhook(req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body as RailwayWebhookPayload;

    console.log('📨 Railway deployment webhook:', {
      type: payload.type,
      status: payload.deployment?.status,
      project: payload.project?.name,
      service: payload.service?.name,
      environment: payload.environment?.name,
    });

    // Only handle deployment events
    if (payload.type !== 'DEPLOY') {
      console.log('ℹ️  Ignoring non-deployment event:', payload.type);
      res.status(200).json({ message: 'Event ignored (not a deployment)' });
      return;
    }

    // Map Railway deployment status to notification status
    const statusMap: Record<string, 'started' | 'completed' | 'failed' | null> = {
      building: 'started',
      initializing: 'started',
      success: 'completed',
      completed: 'completed',
      failed: 'failed',
      crashed: 'failed',
    };

    const deploymentStatus = payload.deployment?.status?.toLowerCase();
    const notificationStatus = statusMap[deploymentStatus];

    if (!notificationStatus) {
      console.log('ℹ️  Unknown deployment status:', deploymentStatus);
      res.status(200).json({ message: 'Webhook received (unknown status)' });
      return;
    }

    // Send Telegram notification
    await sendDeploymentNotification(notificationStatus, {
      projectName: payload.project?.name,
      serviceName: payload.service?.name,
      environmentName: payload.environment?.name,
      commitMessage: payload.deployment?.meta?.commitMessage,
      deploymentUrl: payload.deployment?.url,
      error: payload.error?.message,
    });

    console.log(`✅ Deployment notification sent: ${notificationStatus}`);
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('❌ Error processing Railway webhook:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Test Railway deployment webhook (development only)
 * Endpoint: POST /api/webhooks/railway/deployments/test
 */
export async function testRailwayWebhook(req: Request, res: Response): Promise<void> {
  if (env.NODE_ENV === 'production') {
    res.status(403).json({ error: 'Forbidden', message: 'Test endpoint not available in production' });
    return;
  }

  try {
    const statusMap: Record<string, 'started' | 'completed' | 'failed'> = {
      building: 'started',
      failed: 'failed',
      completed: 'completed',
    };

    const status = req.body.status || 'completed';
    const notificationStatus = statusMap[status] || 'completed';

    await sendDeploymentNotification(notificationStatus, {
      projectName: 'CryptoTally Server (Test)',
      serviceName: 'server',
      environmentName: 'production',
      commitMessage: req.body.commitMessage || 'Test deployment notification',
      deploymentUrl: 'https://cryptotally-test.railway.app',
      error: req.body.error,
    });

    res.status(200).json({
      message: 'Test notification sent successfully',
      status: notificationStatus,
    });
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
