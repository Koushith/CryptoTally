/**
 * Transaction Service
 *
 * Handles transaction fetching, storage, and retrieval
 * Syncs transactions from blockchain and stores them in the database
 */

import { pool } from '../config/database';
import { BlockchainService } from './blockchain.service';

export interface Transaction {
  id: number;
  walletId: number;
  chainName: string;
  chainId: number;
  hash: string;
  blockNumber: string;
  timestamp: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export class TransactionService {
  /**
   * Sync transactions for a wallet from all chains
   */
  static async syncWalletTransactions(
    walletId: number,
    address: string,
    chains: Array<{ chainName: string; chainId: number }>
  ): Promise<void> {
    console.log(`[TransactionService] Syncing transactions for wallet ${walletId}`);

    for (const chain of chains) {
      try {
        await this.syncChainTransactions(walletId, address, chain.chainName, chain.chainId);
      } catch (error) {
        console.error(`[TransactionService] Error syncing ${chain.chainName} for wallet ${walletId}:`, error);
        // Continue with other chains even if one fails
      }
    }

    console.log(`[TransactionService] Sync complete for wallet ${walletId}`);
  }

  /**
   * Sync transactions for a wallet from a specific chain
   */
  static async syncChainTransactions(
    walletId: number,
    address: string,
    chainName: string,
    chainId: number
  ): Promise<void> {
    console.log(`[TransactionService] ========================================`);
    console.log(`[TransactionService] Syncing ${chainName} transactions`);
    console.log(`[TransactionService] Wallet ID: ${walletId}`);
    console.log(`[TransactionService] Address: ${address}`);
    console.log(`[TransactionService] Chain ID: ${chainId}`);
    console.log(`[TransactionService] ========================================`);

    try {
      // Fetch transactions from blockchain
      console.log(`[TransactionService] Calling BlockchainService.getTransactions...`);
      const result = await BlockchainService.getTransactions(address, chainName, {
        maxCount: 1000, // Fetch up to 1000 transactions
      });

      console.log(`[TransactionService] Blockchain response:`, {
        hasTransfers: !!result.transfers,
        transfersLength: result.transfers?.length || 0,
        hasPageKey: !!result.pageKey,
      });

      if (!result.transfers || result.transfers.length === 0) {
        console.log(`[TransactionService] ⚠️ No transactions found on ${chainName}`);
        return;
      }

      console.log(`[TransactionService] ✅ Processing ${result.transfers.length} transactions from ${chainName}`);
      console.log(`[TransactionService] First transaction sample:`, {
        hash: result.transfers[0].hash,
        from: result.transfers[0].from,
        to: result.transfers[0].to,
        blockNum: result.transfers[0].blockNum,
        category: result.transfers[0].category,
      });

      // Process and store each transaction
      let successCount = 0;
      let errorCount = 0;

      for (const transfer of result.transfers) {
        try {
          // Get block timestamp
          const blockNum = transfer.blockNum;
          console.log(`[TransactionService] Processing tx ${transfer.hash} (block ${blockNum})...`);

          const blockDetails = await this.getBlockTimestamp(blockNum, chainName);
          console.log(`[TransactionService] Block timestamp fetched:`, blockDetails?.timestamp);

          // Calculate value in USD (mock for now - integrate with price API later)
          const valueUsd = transfer.value ? transfer.value * 2500 : null; // Mock price

          // Determine transaction type (in/out) based on wallet address
          const transactionType = transfer.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in';

          console.log(`[TransactionService] Inserting into database...`);
          console.log(`[TransactionService] Data:`, {
            walletId,
            chainName,
            chainId,
            hash: transfer.hash,
            blockNumber: parseInt(blockNum, 16),
            from: transfer.from,
            to: transfer.to,
            value: transfer.value,
            asset: transfer.asset,
            category: transfer.category,
            type: transactionType,
          });

          // Insert or update transaction
          const insertResult = await pool.query(
            `
            INSERT INTO transactions (
              wallet_id, chain_name, chain_id, hash, block_number, timestamp,
              from_address, to_address, value, value_usd, asset, category, type,
              raw_contract_address, raw_contract_decimals, raw_contract_value,
              metadata
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            ON CONFLICT (wallet_id, hash, chain_id, (COALESCE(asset, '')), category)
            DO UPDATE SET
              timestamp = EXCLUDED.timestamp,
              value = EXCLUDED.value,
              value_usd = EXCLUDED.value_usd,
              type = EXCLUDED.type,
              updated_at = NOW()
            RETURNING id
            `,
            [
              walletId,
              chainName,
              chainId,
              transfer.hash,
              parseInt(blockNum, 16),
              blockDetails?.timestamp || new Date(),
              transfer.from,
              transfer.to,
              transfer.value?.toString() || null,
              valueUsd,
              transfer.asset,
              transfer.category,
              transactionType, // 'in' or 'out' based on wallet address
              transfer.rawContract?.address || null,
              transfer.rawContract?.decimal ? parseInt(transfer.rawContract.decimal) : null,
              transfer.rawContract?.value || null,
              JSON.stringify(transfer),
            ]
          );

          console.log(`[TransactionService] ✅ Successfully inserted/updated transaction ${transfer.hash} (DB ID: ${insertResult.rows[0]?.id})`);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`[TransactionService] ❌ Error processing transaction ${transfer.hash}:`, error);
          if (error instanceof Error) {
            console.error(`[TransactionService] Error message: ${error.message}`);
            console.error(`[TransactionService] Error stack: ${error.stack}`);
          }
          // Continue with other transactions
        }
      }

      console.log(`[TransactionService] ========================================`);
      console.log(`[TransactionService] Sync summary for ${chainName}:`);
      console.log(`[TransactionService] - Total transactions: ${result.transfers.length}`);
      console.log(`[TransactionService] - Successfully saved: ${successCount}`);
      console.log(`[TransactionService] - Errors: ${errorCount}`);
      console.log(`[TransactionService] ========================================`);

      console.log(`[TransactionService] Successfully synced ${result.transfers.length} transactions from ${chainName}`);
    } catch (error) {
      console.error(`[TransactionService] Error syncing ${chainName} transactions:`, error);
      throw error;
    }
  }

  /**
   * Get block timestamp from chain
   */
  private static async getBlockTimestamp(blockNum: string, chainName: string): Promise<{ timestamp: Date } | null> {
    try {
      const chain = BlockchainService.getChainConfig(chainName);
      if (!chain) {
        return null;
      }

      const response = await fetch(chain.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: [blockNum, false],
          id: 1,
        }),
      });

      const data = (await response.json()) as {
        result?: { timestamp: string };
      };

      if (!data.result?.timestamp) {
        return null;
      }

      const timestamp = new Date(parseInt(data.result.timestamp, 16) * 1000);
      return { timestamp };
    } catch (error) {
      console.error(`[TransactionService] Error getting block timestamp:`, error);
      return null;
    }
  }

  /**
   * Get all transactions for a workspace
   */
  static async getTransactionsByWorkspace(workspaceId: number): Promise<Transaction[]> {
    console.log(`[TransactionService] Fetching transactions for workspace ${workspaceId}`);

    const result = await pool.query(
      `
      SELECT
        t.id, t.wallet_id, t.chain_name, t.chain_id, t.hash, t.block_number,
        t.timestamp, t.from_address, t.to_address, t.value, t.value_usd,
        t.asset, t.category, t.type, t.raw_contract_address,
        t.raw_contract_decimals, t.raw_contract_value, t.gas_used,
        t.gas_price, t.tx_fee, t.tx_fee_usd, t.metadata, t.created_at, t.updated_at
      FROM transactions t
      JOIN wallets w ON t.wallet_id = w.id
      WHERE w.workspace_id = $1
      ORDER BY t.timestamp DESC
      LIMIT 1000
      `,
      [workspaceId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      walletId: row.wallet_id,
      chainName: row.chain_name,
      chainId: row.chain_id,
      hash: row.hash,
      blockNumber: row.block_number,
      timestamp: row.timestamp,
      fromAddress: row.from_address,
      toAddress: row.to_address,
      value: row.value,
      valueUsd: row.value_usd ? parseFloat(row.value_usd) : null,
      asset: row.asset,
      category: row.category,
      type: row.type,
      rawContractAddress: row.raw_contract_address,
      rawContractDecimals: row.raw_contract_decimals,
      rawContractValue: row.raw_contract_value,
      gasUsed: row.gas_used,
      gasPrice: row.gas_price,
      txFee: row.tx_fee,
      txFeeUsd: row.tx_fee_usd ? parseFloat(row.tx_fee_usd) : null,
      metadata: row.metadata,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  /**
   * Get transaction by ID
   */
  static async getTransactionById(id: number): Promise<Transaction | null> {
    const result = await pool.query(
      `
      SELECT
        t.id, t.wallet_id, t.chain_name, t.chain_id, t.hash, t.block_number,
        t.timestamp, t.from_address, t.to_address, t.value, t.value_usd,
        t.asset, t.category, t.type, t.raw_contract_address,
        t.raw_contract_decimals, t.raw_contract_value, t.gas_used,
        t.gas_price, t.tx_fee, t.tx_fee_usd, t.metadata, t.created_at, t.updated_at
      FROM transactions t
      WHERE t.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      walletId: row.wallet_id,
      chainName: row.chain_name,
      chainId: row.chain_id,
      hash: row.hash,
      blockNumber: row.block_number,
      timestamp: row.timestamp,
      fromAddress: row.from_address,
      toAddress: row.to_address,
      value: row.value,
      valueUsd: row.value_usd ? parseFloat(row.value_usd) : null,
      asset: row.asset,
      category: row.category,
      type: row.type,
      rawContractAddress: row.raw_contract_address,
      rawContractDecimals: row.raw_contract_decimals,
      rawContractValue: row.raw_contract_value,
      gasUsed: row.gas_used,
      gasPrice: row.gas_price,
      txFee: row.tx_fee,
      txFeeUsd: row.tx_fee_usd ? parseFloat(row.tx_fee_usd) : null,
      metadata: row.metadata,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
