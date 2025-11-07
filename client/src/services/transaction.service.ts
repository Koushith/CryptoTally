/**
 * Transaction Service
 *
 * Handles transaction-related API calls
 */

import { AuthService } from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Transaction {
  id: number;
  walletId: number;
  chainName: string;
  chainId: number;
  hash: string;
  blockNumber: string;
  timestamp: string;
  fromAddress: string;
  toAddress: string | null;
  value: string | null;
  valueUsd: number | null;
  asset: string | null;
  category: string;
  type: string | null;
  rawContractAddress: string | null;
  rawContractDecimals: number | null;
  rawContractValue: string | null;
  gasUsed: string | null;
  gasPrice: string | null;
  txFee: string | null;
  txFeeUsd: number | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export class TransactionService {
  /**
   * Get all transactions for the current workspace
   */
  static async getTransactions(workspaceId: number): Promise<Transaction[]> {
    const token = await AuthService.getIdToken();

    const response = await fetch(`${API_URL}/api/transactions?workspaceId=${workspaceId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch transactions');
    }

    const data = await response.json();
    return data.transactions;
  }

  /**
   * Get a single transaction by ID
   */
  static async getTransactionById(id: number): Promise<Transaction> {
    const token = await AuthService.getIdToken();

    const response = await fetch(`${API_URL}/api/transactions/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch transaction');
    }

    const data = await response.json();
    return data.transaction;
  }

  /**
   * Sync transactions for all wallets in workspace
   */
  static async syncAllTransactions(workspaceId: number): Promise<{ success: boolean; message: string; walletsCount: number }> {
    const token = await AuthService.getIdToken();

    const response = await fetch(`${API_URL}/api/transactions/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ workspaceId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to sync transactions');
    }

    return response.json();
  }

  /**
   * Sync transactions for a specific wallet
   */
  static async syncWalletTransactions(walletId: number, workspaceId: number): Promise<{
    success: boolean;
    message: string;
    wallet: { id: number; address: string; chains: number };
  }> {
    const token = await AuthService.getIdToken();

    const response = await fetch(`${API_URL}/api/transactions/sync/${walletId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ workspaceId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to sync wallet transactions');
    }

    return response.json();
  }
}
