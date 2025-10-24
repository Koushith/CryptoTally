import { Router } from 'express';
import healthRoutes from './health.routes';
import feedbackRoutes from './feedback.routes';
import waitlistRoutes from './waitlist.routes';

const router = Router();

/**
 * Mount all routes
 */
router.use('/health', healthRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/waitlist', waitlistRoutes);

export default router;
