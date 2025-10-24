import { Router } from 'express';
import { healthCheck, ping } from '../controllers/health.controller';

const router = Router();

/**
 * Health check routes
 */
router.get('/', healthCheck);
router.get('/ping', ping);

export default router;
