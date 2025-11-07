import { AuthService } from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ChainScanResult {
  chain: string;
  chainId: number;
  hasActivity: boolean;
  transactionCount: number;
  balance: string;
  balanceUsd: number;
  lastActivity?: {
    timestamp: string;
    description: string;
  };
}

export interface WalletChain {
  id: number;
  walletId: number;
  chainName: string;
  chainId: number;
  hasActivity: boolean;
  transactionCount: number;
  balance: string | null;
  balanceUsd: string | null;
  lastActivityAt: string | null;
  lastActivityDescription: string | null;
  lastSyncedAt: string | null;
  syncStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: number;
  workspaceId: number;
  address: string;
  label: string | null;
  isActive: boolean;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
  chains?: WalletChain[];
  totalBalanceUsd?: string;
  totalTransactions?: number;
}

export interface AddWalletResponse {
  success: boolean;
  message: string;
  data: {
    wallet: Wallet;
    chains: WalletChain[];
    scanResults: ChainScanResult[];
  };
}

export interface GetWalletsResponse {
  success: boolean;
  data: Wallet[];
}

export class WalletService {
  /**
   * Scan a wallet address across all chains (without saving)
   * This is useful for previewing before adding
   */
  static async scanWallet(_address: string): Promise<ChainScanResult[]> {
    // For now, we'll call addWallet endpoint which does the scanning
    // In the future, we can add a dedicated /scan endpoint
    throw new Error('Scan-only endpoint not yet implemented. Use addWallet instead.');
  }

  /**
   * Add a new wallet and scan across all chains
   */
  static async addWallet(
    workspaceId: number,
    address: string,
    label?: string
  ): Promise<AddWalletResponse> {
    const token = await AuthService.getIdToken();

    const response = await fetch(`${API_URL}/api/wallets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workspaceId,
        address,
        label,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add wallet');
    }

    return response.json();
  }

  /**
   * Get all wallets for a workspace
   */
  static async getWallets(workspaceId: number): Promise<Wallet[]> {
    const token = await AuthService.getIdToken();

    const response = await fetch(`${API_URL}/api/wallets?workspaceId=${workspaceId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get wallets');
    }

    const data: GetWalletsResponse = await response.json();
    return data.data;
  }

  /**
   * Get a single wallet by ID
   */
  static async getWalletById(walletId: number, workspaceId: number): Promise<Wallet> {
    const token = await AuthService.getIdToken();

    const response = await fetch(
      `${API_URL}/api/wallets/${walletId}?workspaceId=${workspaceId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get wallet');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Resync a wallet's data from blockchain
   */
  static async resyncWallet(walletId: number, workspaceId: number): Promise<Wallet> {
    const token = await AuthService.getIdToken();

    const response = await fetch(`${API_URL}/api/wallets/${walletId}/resync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workspaceId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to resync wallet');
    }

    const data = await response.json();
    return data.data.wallet;
  }

  /**
   * Delete a wallet
   */
  static async deleteWallet(walletId: number, workspaceId: number): Promise<void> {
    const token = await AuthService.getIdToken();

    const response = await fetch(`${API_URL}/api/wallets/${walletId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workspaceId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete wallet');
    }
  }

  /**
   * Update wallet label
   */
  static async updateWalletLabel(
    walletId: number,
    workspaceId: number,
    label: string
  ): Promise<Wallet> {
    const token = await AuthService.getIdToken();

    const response = await fetch(`${API_URL}/api/wallets/${walletId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workspaceId,
        label,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update wallet label');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Format time ago string
   */
  static formatTimeAgo(timestamp: string | null): string {
    if (!timestamp) return 'Never';

    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  }
}
