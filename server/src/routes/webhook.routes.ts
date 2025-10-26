import { Router } from 'express';
import { handleRailwayWebhook, testRailwayWebhook } from '../controllers/webhook.controller';

const router = Router();

/**
 * Webhook Routes
 *
 * Railway Deployment Webhooks:
 *   POST /api/webhooks/railway/deployments - Handle Railway deployment events
 *   POST /api/webhooks/railway/deployments/test - Test endpoint (development only)
 *
 * Future webhooks can be added here:
 *   - /api/webhooks/stripe/*
 *   - /api/webhooks/github/*
 *   - etc.
 */

// Railway deployment webhook
router.post('/railway/deployments', handleRailwayWebhook);

// Test endpoint (development only)
router.post('/railway/deployments/test', testRailwayWebhook);

export default router;
