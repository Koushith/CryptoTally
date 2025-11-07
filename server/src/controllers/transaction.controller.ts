/**
 * Transaction Controller
 *
 * Handles HTTP requests for transaction operations
 */

import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { pool } from '../config/database';

/**
 * Get all transactions for the current workspace
 */
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.query.workspaceId ? parseInt(req.query.workspaceId as string) : null;

    if (!workspaceId) {
      return res.status(400).json({
        error: 'workspaceId query parameter is required',
      });
    }

    const transactions = await TransactionService.getTransactionsByWorkspace(workspaceId);

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error('[TransactionController] Error fetching transactions:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get a single transaction by ID
 */
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transactionId = parseInt(id);

    if (isNaN(transactionId)) {
      return res.status(400).json({
        error: 'Invalid transaction ID',
      });
    }

    const transaction = await TransactionService.getTransactionById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        error: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error('[TransactionController] Error fetching transaction:', error);
    res.status(500).json({
      error: 'Failed to fetch transaction',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Sync transactions for a specific wallet
 */
export const syncWalletTransactions = async (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const workspaceId = req.body.workspaceId ? parseInt(req.body.workspaceId) : null;

    if (!workspaceId) {
      return res.status(400).json({
        error: 'workspaceId is required in request body',
      });
    }

    // Verify wallet belongs to workspace
    const walletResult = await pool.query(
      `
      SELECT w.id, w.address, wc.chain_name, wc.chain_id
      FROM wallets w
      LEFT JOIN wallet_chains wc ON w.id = wc.wallet_id
      WHERE w.id = $1 AND w.workspace_id = $2 AND wc.has_activity = true
      `,
      [walletId, workspaceId]
    );

    if (walletResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Wallet not found or does not belong to this workspace',
      });
    }

    const wallet = walletResult.rows[0];
    const chains = walletResult.rows.map((row: any) => ({
      chainName: row.chain_name,
      chainId: row.chain_id,
    }));

    // Sync transactions in the background
    TransactionService.syncWalletTransactions(parseInt(walletId), wallet.address, chains)
      .then(() => {
        console.log(`[TransactionController] Successfully synced transactions for wallet ${walletId}`);
      })
      .catch((error) => {
        console.error(`[TransactionController] Error syncing transactions for wallet ${walletId}:`, error);
      });

    res.json({
      success: true,
      message: 'Transaction sync started',
      wallet: {
        id: wallet.id,
        address: wallet.address,
        chains: chains.length,
      },
    });
  } catch (error) {
    console.error('[TransactionController] Error starting transaction sync:', error);
    res.status(500).json({
      error: 'Failed to start transaction sync',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Sync transactions for all wallets in workspace
 */
export const syncAllTransactions = async (req: Request, res: Response) => {
  try {
    console.log('[TransactionController] ========================================');
    console.log('[TransactionController] Sync request received');
    console.log('[TransactionController] Request body:', req.body);

    const workspaceId = req.body.workspaceId ? parseInt(req.body.workspaceId) : null;

    if (!workspaceId) {
      console.log('[TransactionController] ❌ No workspaceId provided');
      return res.status(400).json({
        error: 'workspaceId is required in request body',
      });
    }

    console.log('[TransactionController] Workspace ID:', workspaceId);

    // Get all wallets in workspace
    console.log('[TransactionController] Fetching wallets...');
    const walletsResult = await pool.query(
      `
      SELECT DISTINCT w.id, w.address
      FROM wallets w
      JOIN wallet_chains wc ON w.id = wc.wallet_id
      WHERE w.workspace_id = $1 AND wc.has_activity = true
      `,
      [workspaceId]
    );

    console.log(`[TransactionController] Found ${walletsResult.rows.length} wallets with activity`);

    if (walletsResult.rows.length === 0) {
      console.log('[TransactionController] ❌ No active wallets found');
      return res.status(400).json({
        error: 'No active wallets found in workspace',
      });
    }

    // Sync transactions for each wallet
    for (const wallet of walletsResult.rows) {
      console.log(`[TransactionController] Processing wallet ${wallet.id} (${wallet.address})`);

      const chainsResult = await pool.query(
        `
        SELECT chain_name, chain_id
        FROM wallet_chains
        WHERE wallet_id = $1 AND has_activity = true
        `,
        [wallet.id]
      );

      const chains = chainsResult.rows.map((row: any) => ({
        chainName: row.chain_name,
        chainId: row.chain_id,
      }));

      console.log(`[TransactionController] Wallet ${wallet.id} has ${chains.length} active chains:`, chains.map(c => c.chainName));
      console.log(`[TransactionController] Starting background sync for wallet ${wallet.id}...`);

      // Sync in background
      TransactionService.syncWalletTransactions(wallet.id, wallet.address, chains).catch((error) => {
        console.error(`[TransactionController] ❌ Error syncing wallet ${wallet.id}:`, error);
      });
    }

    console.log('[TransactionController] ✅ All sync jobs started');
    console.log('[TransactionController] ========================================');

    res.json({
      success: true,
      message: 'Transaction sync started for all wallets',
      walletsCount: walletsResult.rows.length,
    });
  } catch (error) {
    console.error('[TransactionController] ❌ Error starting transaction sync:', error);
    res.status(500).json({
      error: 'Failed to start transaction sync',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
