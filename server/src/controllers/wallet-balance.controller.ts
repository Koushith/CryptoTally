/**
 * Wallet Balance Controller
 *
 * Handles fetching wallet balances including ERC20 tokens
 */

import { Request, Response } from 'express';
import { pool } from '../config/database';
import { BlockchainService } from '../services/blockchain.service';
import { PriceService } from '../services/price.service';

/**
 * Get wallet balances including ERC20 tokens
 */
export const getWalletBalances = async (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const workspaceId = req.query.workspaceId ? parseInt(req.query.workspaceId as string) : null;

    if (!workspaceId) {
      return res.status(400).json({
        error: 'workspaceId query parameter is required',
      });
    }

    // Get wallet and its chains
    const walletResult = await pool.query(
      `
      SELECT w.id, w.address, wc.chain_name, wc.chain_id, wc.balance as native_balance, wc.balance_usd as native_balance_usd
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
    const address = wallet.address;

    // Get token balances for each chain
    const chainBalances = await Promise.all(
      walletResult.rows.map(async (row: any) => {
        const tokens = await BlockchainService.getTokenBalances(address, row.chain_name);

        // Get prices for all tokens
        const tokensWithPrices = await Promise.all(
          tokens.map(async (t) => {
            const priceUsd = await PriceService.getTokenPrice(t.contractAddress);
            const balance = parseFloat(t.readableBalance?.toString() || '0');
            const valueUsd = priceUsd && !isNaN(balance) ? balance * priceUsd : null;

            return {
              contractAddress: t.contractAddress,
              symbol: t.symbol,
              name: t.name,
              balance: t.readableBalance,
              decimals: t.decimals,
              priceUsd: priceUsd,
              valueUsd: valueUsd,
            };
          })
        );

        return {
          chainName: row.chain_name,
          chainId: row.chain_id,
          nativeBalance: row.native_balance,
          nativeBalanceUsd: row.native_balance_usd,
          tokens: tokensWithPrices,
        };
      })
    );

    // Calculate total value including tokens
    const totalNativeUsd = chainBalances.reduce(
      (sum, chain) => sum + parseFloat(chain.nativeBalanceUsd || '0'),
      0
    );

    const totalTokensUsd = chainBalances.reduce(
      (sum, chain) =>
        sum +
        chain.tokens.reduce((tokenSum, token) => tokenSum + (token.valueUsd || 0), 0),
      0
    );

    res.json({
      success: true,
      wallet: {
        id: wallet.id,
        address: wallet.address,
      },
      balances: chainBalances,
      summary: {
        totalNativeUsd: totalNativeUsd.toFixed(2),
        totalTokensUsd: totalTokensUsd.toFixed(2),
        totalUsd: (totalNativeUsd + totalTokensUsd).toFixed(2),
        chainsWithTokens: chainBalances.filter((c) => c.tokens.length > 0).length,
        totalTokenTypes: chainBalances.reduce((sum, c) => sum + c.tokens.length, 0),
      },
    });
  } catch (error) {
    console.error('[WalletBalanceController] Error fetching wallet balances:', error);
    res.status(500).json({
      error: 'Failed to fetch wallet balances',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
