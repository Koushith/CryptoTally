import { Router } from 'express';
import healthRoutes from './health.routes';
import feedbackRoutes from './feedback.routes';
import waitlistRoutes from './waitlist.routes';
import webhookRoutes from './webhook.routes';

const router = Router();

/**
 * Mount all routes
 */
router.use('/health', healthRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/waitlist', waitlistRoutes);
router.use('/webhooks', webhookRoutes);

export default router;
