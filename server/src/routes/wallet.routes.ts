import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { getWalletBalances } from '../controllers/wallet-balance.controller';
import { authMiddleware } from '../middleware/auth.middleware';

/**
 * Wallet Routes
 *
 * All routes require authentication
 */
const router = Router();

// All wallet routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/wallets
 * @desc    Add a new wallet and scan across all chains
 * @access  Private
 */
router.post('/', WalletController.addWallet);

/**
 * @route   GET /api/wallets
 * @desc    Get all wallets for a workspace
 * @query   workspaceId - Required
 * @access  Private
 */
router.get('/', WalletController.getWallets);

/**
 * @route   GET /api/wallets/:walletId
 * @desc    Get a single wallet by ID
 * @query   workspaceId - Required
 * @access  Private
 */
router.get('/:walletId', WalletController.getWalletById);

/**
 * @route   POST /api/wallets/:walletId/resync
 * @desc    Resync a wallet's data from blockchain
 * @access  Private
 */
router.post('/:walletId/resync', WalletController.resyncWallet);

/**
 * @route   DELETE /api/wallets/:walletId
 * @desc    Delete a wallet
 * @access  Private
 */
router.delete('/:walletId', WalletController.deleteWallet);

/**
 * @route   PATCH /api/wallets/:walletId
 * @desc    Update wallet label
 * @access  Private
 */
router.patch('/:walletId', WalletController.updateWalletLabel);

/**
 * @route   GET /api/wallets/:walletId/balances
 * @desc    Get wallet balances including ERC20 tokens
 * @query   workspaceId - Required
 * @access  Private
 */
router.get('/:walletId/balances', getWalletBalances);

export default router;
