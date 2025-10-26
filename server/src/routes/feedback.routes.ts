import { Router } from 'express';
import { submitFeedback, getAllFeedback } from '../controllers/feedback.controller';
import { feedbackLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

/**
 * Feedback routes
 */
router.post('/', feedbackLimiter, submitFeedback);
router.get('/', getAllFeedback); // For admin use later

export default router;
