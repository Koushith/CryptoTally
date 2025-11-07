/**
 * Wallet Balance Service
 *
 * Handles fetching wallet balances including ERC20 tokens
 */

import { AuthService } from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface TokenBalance {
  contractAddress: string;
  symbol?: string;
  name?: string;
  balance?: string;
  decimals?: number;
  priceUsd?: number | null;
  valueUsd?: number | null;
}

export interface ChainBalance {
  chainName: string;
  chainId: number;
  nativeBalance: string;
  nativeBalanceUsd: string;
  tokens: TokenBalance[];
}

export interface WalletBalance {
  wallet: {
    id: number;
    address: string;
  };
  balances: ChainBalance[];
  summary: {
    totalNativeUsd: string;
    totalTokensUsd: string;
    totalUsd: string;
    chainsWithTokens: number;
    totalTokenTypes: number;
  };
}

export class WalletBalanceService {
  /**
   * Get wallet balances including ERC20 tokens
   */
  static async getWalletBalances(walletId: number, workspaceId: number): Promise<WalletBalance> {
    const token = await AuthService.getIdToken();

    const response = await fetch(`${API_URL}/api/wallets/${walletId}/balances?workspaceId=${workspaceId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch wallet balances');
    }

    const data = await response.json();
    return data;
  }
}
