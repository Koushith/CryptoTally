import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { WalletService } from '../services/wallet.service';
import { db } from '../config/database';
import { users, workspaceMembers } from '../db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Wallet Controller
 *
 * Handles wallet management API endpoints
 */
export class WalletController {
  /**
   * Add a new wallet and scan across all chains
   * POST /api/wallets
   */
  static async addWallet(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { workspaceId, address, label } = req.body;

      // Validate required fields
      if (!workspaceId || !address) {
        return res.status(400).json({
          success: false,
          error: 'workspaceId and address are required',
        });
      }

      // Verify user has access to workspace
      const hasAccess = await WalletController.verifyWorkspaceAccess(req.user.uid, workspaceId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to this workspace',
        });
      }

      // Add wallet and scan chains
      const result = await WalletService.addWallet(workspaceId, address, label);

      return res.status(201).json({
        success: true,
        message: 'Wallet added successfully',
        data: result,
      });
    } catch (error: any) {
      console.error('[WalletController] Error adding wallet:', error);

      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to add wallet',
      });
    }
  }

  /**
   * Get all wallets for a workspace
   * GET /api/wallets?workspaceId=123
   */
  static async getWallets(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const workspaceId = parseInt(req.query.workspaceId as string);

      if (!workspaceId || isNaN(workspaceId)) {
        return res.status(400).json({
          success: false,
          error: 'Valid workspaceId is required',
        });
      }

      // Verify user has access to workspace
      const hasAccess = await WalletController.verifyWorkspaceAccess(req.user.uid, workspaceId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to this workspace',
        });
      }

      // Get wallets
      const wallets = await WalletService.getWalletsForWorkspace(workspaceId);

      return res.status(200).json({
        success: true,
        data: wallets,
      });
    } catch (error: any) {
      console.error('[WalletController] Error getting wallets:', error);

      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to get wallets',
      });
    }
  }

  /**
   * Get a single wallet by ID
   * GET /api/wallets/:walletId?workspaceId=123
   */
  static async getWalletById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const walletId = parseInt(req.params.walletId);
      const workspaceId = parseInt(req.query.workspaceId as string);

      if (!walletId || isNaN(walletId) || !workspaceId || isNaN(workspaceId)) {
        return res.status(400).json({
          success: false,
          error: 'Valid walletId and workspaceId are required',
        });
      }

      // Verify user has access to workspace
      const hasAccess = await WalletController.verifyWorkspaceAccess(req.user.uid, workspaceId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to this workspace',
        });
      }

      // Get wallet
      const wallet = await WalletService.getWalletById(walletId, workspaceId);

      return res.status(200).json({
        success: true,
        data: wallet,
      });
    } catch (error: any) {
      console.error('[WalletController] Error getting wallet:', error);

      if (error.message === 'Wallet not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to get wallet',
      });
    }
  }

  /**
   * Resync a wallet's data from blockchain
   * POST /api/wallets/:walletId/resync
   */
  static async resyncWallet(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const walletId = parseInt(req.params.walletId);
      const { workspaceId } = req.body;

      if (!walletId || isNaN(walletId) || !workspaceId) {
        return res.status(400).json({
          success: false,
          error: 'Valid walletId and workspaceId are required',
        });
      }

      // Verify user has access to workspace
      const hasAccess = await WalletController.verifyWorkspaceAccess(req.user.uid, workspaceId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to this workspace',
        });
      }

      // Resync wallet
      const result = await WalletService.resyncWallet(walletId, workspaceId);

      return res.status(200).json({
        success: true,
        message: 'Wallet resynced successfully',
        data: result,
      });
    } catch (error: any) {
      console.error('[WalletController] Error resyncing wallet:', error);

      if (error.message === 'Wallet not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to resync wallet',
      });
    }
  }

  /**
   * Delete a wallet
   * DELETE /api/wallets/:walletId
   */
  static async deleteWallet(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const walletId = parseInt(req.params.walletId);
      const { workspaceId } = req.body;

      if (!walletId || isNaN(walletId) || !workspaceId) {
        return res.status(400).json({
          success: false,
          error: 'Valid walletId and workspaceId are required',
        });
      }

      // Verify user has access to workspace
      const hasAccess = await WalletController.verifyWorkspaceAccess(req.user.uid, workspaceId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to this workspace',
        });
      }

      // Delete wallet
      await WalletService.deleteWallet(walletId, workspaceId);

      return res.status(200).json({
        success: true,
        message: 'Wallet deleted successfully',
      });
    } catch (error: any) {
      console.error('[WalletController] Error deleting wallet:', error);

      if (error.message === 'Wallet not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete wallet',
      });
    }
  }

  /**
   * Update wallet label
   * PATCH /api/wallets/:walletId
   */
  static async updateWalletLabel(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const walletId = parseInt(req.params.walletId);
      const { workspaceId, label } = req.body;

      if (!walletId || isNaN(walletId) || !workspaceId || !label) {
        return res.status(400).json({
          success: false,
          error: 'Valid walletId, workspaceId, and label are required',
        });
      }

      // Verify user has access to workspace
      const hasAccess = await WalletController.verifyWorkspaceAccess(req.user.uid, workspaceId);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to this workspace',
        });
      }

      // Update wallet label
      const wallet = await WalletService.updateWalletLabel(walletId, workspaceId, label);

      return res.status(200).json({
        success: true,
        message: 'Wallet label updated successfully',
        data: wallet,
      });
    } catch (error: any) {
      console.error('[WalletController] Error updating wallet label:', error);

      if (error.message === 'Wallet not found') {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to update wallet label',
      });
    }
  }

  /**
   * Helper: Verify user has access to workspace
   */
  private static async verifyWorkspaceAccess(firebaseUid: string, workspaceId: number): Promise<boolean> {
    // Get user
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid)).limit(1);

    if (!user) {
      return false;
    }

    // Check if user is a member of the workspace
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(and(eq(workspaceMembers.userId, user.id), eq(workspaceMembers.workspaceId, workspaceId)))
      .limit(1);

    return !!membership;
  }
}
