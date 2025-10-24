import { Router } from 'express';
import { submitFeedback, getAllFeedback } from '../controllers/feedback.controller';

const router = Router();

/**
 * Feedback routes
 */
router.post('/', submitFeedback);
router.get('/', getAllFeedback); // For admin use later

export default router;
