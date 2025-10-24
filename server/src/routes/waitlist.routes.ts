import { Router } from 'express';
import { joinWaitlist, getAllWaitlist } from '../controllers/waitlist.controller';

const router = Router();

/**
 * Waitlist routes
 */
router.post('/', joinWaitlist);
router.get('/', getAllWaitlist); // For admin use later

export default router;
