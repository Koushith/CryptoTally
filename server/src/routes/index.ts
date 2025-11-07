import { Router } from 'express';
import healthRoutes from './health.routes';
import feedbackRoutes from './feedback.routes';
import waitlistRoutes from './waitlist.routes';
import webhookRoutes from './webhook.routes';
import authRoutes from './auth.routes';
import passkeyRoutes from './passkey.routes';
import workspaceRoutes from './workspace.routes';
import walletRoutes from './wallet.routes';
import transactionRoutes from './transaction.routes';

const router = Router();

/**
 * Mount all routes
 */
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/passkey', passkeyRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/wallets', walletRoutes);
router.use('/transactions', transactionRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/waitlist', waitlistRoutes);
router.use('/webhooks', webhookRoutes);

export default router;
