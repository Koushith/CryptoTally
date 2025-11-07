/**
 * Wallet Service
 *
 * Handles wallet management operations including:
 * - Adding wallets and scanning chains
 * - Fetching wallet data with chain information
 * - Syncing wallet data from blockchain
 *
 * TODO: Implement automatic wallet syncing
 * - Add cron job or background worker to resync wallets periodically
 * - Suggested interval: every 6 hours or configurable per user
 * - Update lastSyncedAt timestamp after each sync
 * - Track sync failures and retry with exponential backoff
 * - Send notifications for significant balance changes
 * - Consider implementing queue system (Bull/BullMQ) for better scalability
 */

import { db } from '../config/database';
import { wallets, walletChains, NewWallet, NewWalletChain } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { BlockchainService } from './blockchain.service';

export class WalletService {
  /**
   * Add a new wallet and scan it across all chains
   */
  static async addWallet(workspaceId: number, addressOrENS: string, label?: string) {
    console.log(`[WalletService] Adding wallet ${addressOrENS} to workspace ${workspaceId}`);

    try {
      let address = addressOrENS;

      // Check if it's an ENS name
      if (BlockchainService.isValidENS(addressOrENS)) {
        console.log(`[WalletService] Resolving ENS name: ${addressOrENS}`);
        const resolved = await BlockchainService.resolveENS(addressOrENS);

        if (!resolved) {
          throw new Error(`Unable to resolve ENS name: ${addressOrENS}`);
        }

        address = resolved;
        console.log(`[WalletService] ENS resolved to: ${address}`);

        // Use ENS name as label if no label provided
        if (!label) {
          label = addressOrENS;
        }
      }

      // Validate address format
      if (!BlockchainService.isValidAddress(address)) {
        throw new Error('Invalid Ethereum address format');
      }

      // Check if wallet already exists in this workspace
      console.log(`[WalletService] Checking for existing wallet...`);
      const existingWallet = await db
        .select()
        .from(wallets)
        .where(and(eq(wallets.workspaceId, workspaceId), eq(wallets.address, address)))
        .limit(1);

      if (existingWallet.length > 0) {
        throw new Error('Wallet already exists in this workspace');
      }

      // Scan wallet across all chains
      console.log(`[WalletService] Scanning wallet across chains...`);
      const scanResults = await BlockchainService.scanWalletAcrossChains(address);
      console.log(`[WalletService] Scan complete. Results:`, scanResults.map(r => ({ chain: r.chain, hasActivity: r.hasActivity, txCount: r.transactionCount })));

    // Create wallet record
    const [newWallet] = await db
      .insert(wallets)
      .values({
        workspaceId,
        address,
        label,
        lastSyncedAt: new Date(),
      })
      .returning();

    console.log(`[WalletService] Wallet created with ID: ${newWallet.id}`);

    // Create wallet_chains records for chains with activity
    const chainRecords: NewWalletChain[] = scanResults
      .filter((result) => result.hasActivity)
      .map((result) => ({
        walletId: newWallet.id,
        chainName: result.chain,
        chainId: result.chainId,
        hasActivity: true,
        transactionCount: result.transactionCount,
        balance: result.balance,
        balanceUsd: result.balanceUsd.toString(),
        lastActivityAt: result.lastActivity?.timestamp,
        lastActivityDescription: result.lastActivity?.description,
        lastSyncedAt: new Date(),
        syncStatus: 'synced',
      }));

    if (chainRecords.length > 0) {
      await db.insert(walletChains).values(chainRecords);
      console.log(`[WalletService] Created ${chainRecords.length} chain records`);
    }

      // Return wallet with chain data
      return {
        wallet: newWallet,
        chains: chainRecords,
        scanResults, // Include all scan results (active and inactive chains)
      };
    } catch (error: any) {
      console.error(`[WalletService] Error in addWallet:`, error);
      console.error(`[WalletService] Error stack:`, error.stack);
      throw error;
    }
  }

  /**
   * Get all wallets for a workspace with their chain data
   */
  static async getWalletsForWorkspace(workspaceId: number) {
    console.log(`[WalletService] Fetching wallets for workspace ${workspaceId}`);

    const workspaceWallets = await db
      .select()
      .from(wallets)
      .where(and(eq(wallets.workspaceId, workspaceId), eq(wallets.isActive, true)));

    // Fetch chain data for each wallet
    const walletsWithChains = await Promise.all(
      workspaceWallets.map(async (wallet) => {
        const chains = await db
          .select()
          .from(walletChains)
          .where(eq(walletChains.walletId, wallet.id));

        // Calculate total balance across all chains
        const totalBalanceUsd = chains.reduce((sum, chain) => {
          return sum + parseFloat(chain.balanceUsd || '0');
        }, 0);

        // Calculate total transactions
        const totalTransactions = chains.reduce((sum, chain) => {
          return sum + (chain.transactionCount || 0);
        }, 0);

        return {
          ...wallet,
          chains,
          totalBalanceUsd: totalBalanceUsd.toFixed(2),
          totalTransactions,
        };
      })
    );

    return walletsWithChains;
  }

  /**
   * Get a single wallet by ID with chain data
   */
  static async getWalletById(walletId: number, workspaceId: number) {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(and(eq(wallets.id, walletId), eq(wallets.workspaceId, workspaceId)))
      .limit(1);

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const chains = await db.select().from(walletChains).where(eq(walletChains.walletId, walletId));

    return {
      ...wallet,
      chains,
    };
  }

  /**
   * Resync a wallet's data from blockchain
   */
  static async resyncWallet(walletId: number, workspaceId: number) {
    console.log(`[WalletService] Resyncing wallet ${walletId}`);

    // Get wallet
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(and(eq(wallets.id, walletId), eq(wallets.workspaceId, workspaceId)))
      .limit(1);

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Scan wallet across all chains
    const scanResults = await BlockchainService.scanWalletAcrossChains(wallet.address);

    // Delete existing chain records
    await db.delete(walletChains).where(eq(walletChains.walletId, walletId));

    // Create new chain records for chains with activity
    const chainRecords: NewWalletChain[] = scanResults
      .filter((result) => result.hasActivity)
      .map((result) => ({
        walletId: wallet.id,
        chainName: result.chain,
        chainId: result.chainId,
        hasActivity: true,
        transactionCount: result.transactionCount,
        balance: result.balance,
        balanceUsd: result.balanceUsd.toString(),
        lastActivityAt: result.lastActivity?.timestamp,
        lastActivityDescription: result.lastActivity?.description,
        lastSyncedAt: new Date(),
        syncStatus: 'synced',
      }));

    if (chainRecords.length > 0) {
      await db.insert(walletChains).values(chainRecords);
    }

    // Update wallet lastSyncedAt
    await db.update(wallets).set({ lastSyncedAt: new Date() }).where(eq(wallets.id, walletId));

    console.log(`[WalletService] Wallet ${walletId} resynced successfully`);

    return {
      wallet,
      chains: chainRecords,
    };
  }

  /**
   * Delete a wallet
   */
  static async deleteWallet(walletId: number, workspaceId: number) {
    console.log(`[WalletService] Deleting wallet ${walletId}`);

    const result = await db
      .delete(wallets)
      .where(and(eq(wallets.id, walletId), eq(wallets.workspaceId, workspaceId)))
      .returning();

    if (result.length === 0) {
      throw new Error('Wallet not found');
    }

    // Chain records are deleted automatically via CASCADE

    console.log(`[WalletService] Wallet ${walletId} deleted successfully`);

    return { success: true };
  }

  /**
   * Update wallet label
   */
  static async updateWalletLabel(walletId: number, workspaceId: number, label: string) {
    const [updatedWallet] = await db
      .update(wallets)
      .set({ label, updatedAt: new Date() })
      .where(and(eq(wallets.id, walletId), eq(wallets.workspaceId, workspaceId)))
      .returning();

    if (!updatedWallet) {
      throw new Error('Wallet not found');
    }

    return updatedWallet;
  }
}
