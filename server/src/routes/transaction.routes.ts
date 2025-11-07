/**
 * Transaction Routes
 *
 * API endpoints for transaction operations
 */

import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getTransactions,
  getTransactionById,
  syncWalletTransactions,
  syncAllTransactions,
} from '../controllers/transaction.controller';

const router = Router();

/**
 * All routes require authentication
 */
router.use(authMiddleware);

/**
 * GET /api/transactions
 * Get all transactions for the current workspace
 */
router.get('/', getTransactions);

/**
 * GET /api/transactions/:id
 * Get a single transaction by ID
 */
router.get('/:id', getTransactionById);

/**
 * POST /api/transactions/sync
 * Sync transactions for all wallets in workspace
 */
router.post('/sync', syncAllTransactions);

/**
 * POST /api/transactions/sync/:walletId
 * Sync transactions for a specific wallet
 */
router.post('/sync/:walletId', syncWalletTransactions);

export default router;
