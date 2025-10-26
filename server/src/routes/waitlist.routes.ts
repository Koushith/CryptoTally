import { Router } from 'express';
import { joinWaitlist, getAllWaitlist } from '../controllers/waitlist.controller';
import { waitlistLimiter } from '../middleware/rateLimiter.middleware';
import { honeypotCheck, blockDisposableEmails } from '../middleware/honeypot.middleware';

const router = Router();

/**
 * Waitlist routes
 */
router.post(
  '/',
  waitlistLimiter,
  honeypotCheck('website'),
  blockDisposableEmails,
  joinWaitlist
);
router.get('/', getAllWaitlist); // For admin use later

export default router;
