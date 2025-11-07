/**
 * Blockchain Service
 *
 * Handles multi-chain wallet scanning and transaction fetching
 * Uses Alchemy API for comprehensive blockchain data across multiple chains
 */

import { env } from '../config/env';

interface ChainConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

export interface ScanResult {
  chain: string;
  chainId: number;
  hasActivity: boolean;
  transactionCount: number;
  balance: string;
  balanceUsd: number;
  lastActivity?: {
    timestamp: Date;
    description: string;
  };
}

export class BlockchainService {
  // Supported EVM chains
  private static readonly CHAINS: ChainConfig[] = [
    {
      name: 'Ethereum',
      chainId: 1,
      rpcUrl: env.ALCHEMY_ETH_URL,
      explorerUrl: 'https://etherscan.io',
    },
    {
      name: 'Polygon',
      chainId: 137,
      rpcUrl: env.ALCHEMY_POLYGON_URL,
      explorerUrl: 'https://polygonscan.com',
    },
    {
      name: 'Arbitrum',
      chainId: 42161,
      rpcUrl: env.ALCHEMY_ARBITRUM_URL,
      explorerUrl: 'https://arbiscan.io',
    },
    {
      name: 'Base',
      chainId: 8453,
      rpcUrl: env.ALCHEMY_BASE_URL,
      explorerUrl: 'https://basescan.org',
    },
    {
      name: 'Optimism',
      chainId: 10,
      rpcUrl: env.ALCHEMY_OPTIMISM_URL,
      explorerUrl: 'https://optimistic.etherscan.io',
    },
    {
      name: 'BNB Chain',
      chainId: 56,
      rpcUrl: env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
      explorerUrl: 'https://bscscan.com',
    },
    {
      name: 'Avalanche',
      chainId: 43114,
      rpcUrl: env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
      explorerUrl: 'https://snowtrace.io',
    },
    {
      name: 'Fantom',
      chainId: 250,
      rpcUrl: env.FANTOM_RPC_URL || 'https://rpc.ftm.tools',
      explorerUrl: 'https://ftmscan.com',
    },
  ];

  /**
   * Scan a wallet address across all supported chains
   * Returns activity data for each chain
   */
  static async scanWalletAcrossChains(address: string): Promise<ScanResult[]> {
    console.log(`[BlockchainService] Scanning wallet ${address} across ${this.CHAINS.length} chains`);

    // Scan all chains in parallel
    const scanPromises = this.CHAINS.map((chain) =>
      this.scanChain(address, chain).catch((error) => {
        console.error(`[BlockchainService] Error scanning ${chain.name}:`, error);
        // Return empty result on error (don't let one chain failure block others)
        return {
          chain: chain.name,
          chainId: chain.chainId,
          hasActivity: false,
          transactionCount: 0,
          balance: '0',
          balanceUsd: 0,
        };
      })
    );

    const results = await Promise.all(scanPromises);

    console.log(
      `[BlockchainService] Scan complete. Found activity on ${
        results.filter((r) => r.hasActivity).length
      }/${this.CHAINS.length} chains`
    );

    return results;
  }

  /**
   * Scan a single chain for wallet activity
   */
  private static async scanChain(address: string, chain: ChainConfig): Promise<ScanResult> {
    try {
      console.log(`[BlockchainService] Scanning ${chain.name} for ${address}`);

      // Get transaction count
      const txCount = await this.getTransactionCount(address, chain);

      // If no transactions, skip further checks
      if (txCount === 0) {
        return {
          chain: chain.name,
          chainId: chain.chainId,
          hasActivity: false,
          transactionCount: 0,
          balance: '0',
          balanceUsd: 0,
        };
      }

      // Get balance
      const balance = await this.getBalance(address, chain);
      const balanceUsd = await this.convertToUsd(balance, chain);

      // Get last transaction
      const lastTx = await this.getLastTransaction(address, chain);

      return {
        chain: chain.name,
        chainId: chain.chainId,
        hasActivity: true,
        transactionCount: txCount,
        balance,
        balanceUsd,
        lastActivity: lastTx
          ? {
              timestamp: lastTx.timestamp,
              description: lastTx.description,
            }
          : undefined,
      };
    } catch (error) {
      console.error(`[BlockchainService] Error in scanChain for ${chain.name}:`, error);
      throw error;
    }
  }

  /**
   * Get transaction count for an address on a chain
   */
  private static async getTransactionCount(address: string, chain: ChainConfig): Promise<number> {
    try {
      const response = await fetch(chain.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionCount',
          params: [address, 'latest'],
          id: 1,
        }),
      });

      const data = (await response.json()) as { result?: string; error?: { message: string } };

      if (data.error) {
        throw new Error(data.error.message);
      }

      // Convert hex to number
      return parseInt(data.result || '0x0', 16);
    } catch (error) {
      console.error(`[BlockchainService] Error getting tx count:`, error);
      return 0;
    }
  }

  /**
   * Get native token balance for an address
   */
  private static async getBalance(address: string, chain: ChainConfig): Promise<string> {
    try {
      const response = await fetch(chain.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1,
        }),
      });

      const data = (await response.json()) as { result?: string; error?: { message: string } };

      if (data.error) {
        throw new Error(data.error.message);
      }

      // Convert hex wei to ether string
      const weiBalance = BigInt(data.result || '0x0');
      const etherBalance = Number(weiBalance) / 1e18;

      return etherBalance.toFixed(6);
    } catch (error) {
      console.error(`[BlockchainService] Error getting balance:`, error);
      return '0';
    }
  }

  /**
   * Convert native token balance to USD
   * TODO: Integrate with CoinGecko or similar price API
   */
  private static async convertToUsd(balance: string, chain: ChainConfig): Promise<number> {
    // Mock prices for now - replace with actual price API
    const mockPrices: Record<string, number> = {
      Ethereum: 2500,
      Polygon: 0.8,
      Arbitrum: 2500, // Uses ETH
      Base: 2500, // Uses ETH
      Optimism: 2500, // Uses ETH
      'BNB Chain': 300,
      Avalanche: 30,
      Fantom: 0.5,
    };

    const price = mockPrices[chain.name] || 0;
    const balanceNum = parseFloat(balance);

    return balanceNum * price;
  }

  /**
   * Get the last transaction for an address
   * Uses Alchemy's enhanced API for chains that support it
   */
  private static async getLastTransaction(
    address: string,
    chain: ChainConfig
  ): Promise<{ timestamp: Date; description: string } | null> {
    try {
      // Only works with Alchemy RPC URLs
      if (!chain.rpcUrl.includes('alchemy.com')) {
        return null;
      }

      const response = await fetch(chain.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [
            {
              fromAddress: address,
              category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
              maxCount: '0x1', // Get only the latest transaction
              order: 'desc',
            },
          ],
          id: 1,
        }),
      });

      const data = (await response.json()) as {
        result?: { transfers: Array<{ blockNum: string; hash: string; category: string; value?: number }> };
      };

      if (!data.result?.transfers || data.result.transfers.length === 0) {
        return null;
      }

      const lastTx = data.result.transfers[0];

      // Get block details for timestamp
      const blockResponse = await fetch(chain.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: [lastTx.blockNum, false],
          id: 1,
        }),
      });

      const blockData = (await blockResponse.json()) as {
        result?: { timestamp: string };
      };

      if (!blockData.result?.timestamp) {
        return null;
      }

      const timestamp = new Date(parseInt(blockData.result.timestamp, 16) * 1000);
      const description = `${lastTx.category} transaction`;

      return { timestamp, description };
    } catch (error) {
      console.error(`[BlockchainService] Error getting last transaction for ${chain.name}:`, error);
      return null;
    }
  }

  /**
   * Fetch all transactions for a wallet address on a specific chain
   * Includes external, internal, ERC20, ERC721, and ERC1155 transfers
   */
  static async getTransactions(
    address: string,
    chainName: string,
    options?: {
      fromBlock?: string;
      toBlock?: string;
      maxCount?: number;
      pageKey?: string;
    }
  ): Promise<{
    transfers: Array<{
      blockNum: string;
      hash: string;
      from: string;
      to: string | null;
      value: number | null;
      asset: string | null;
      category: string;
      rawContract?: {
        address: string | null;
        decimal: string | null;
        value: string | null;
      };
    }>;
    pageKey?: string;
  }> {
    const chain = this.getChainConfig(chainName);
    if (!chain) {
      throw new Error(`Unsupported chain: ${chainName}`);
    }

    // Only works with Alchemy RPC URLs
    if (!chain.rpcUrl.includes('alchemy.com')) {
      console.log(`[BlockchainService] ${chainName} does not support Alchemy API, returning empty results`);
      return { transfers: [] };
    }

    try {
      console.log(`[BlockchainService] Fetching transactions for ${address} on ${chainName}`);

      // Note: We need to fetch both incoming and outgoing transactions
      // Alchemy requires separate calls for fromAddress and toAddress
      // So we'll fetch transactions where this address is either sender OR receiver

      // Internal transactions are only supported for Ethereum and Polygon
      const categories = ['external', 'erc20', 'erc721', 'erc1155'];
      if (chainName === 'Ethereum' || chainName === 'Polygon') {
        categories.push('internal');
      }

      const params: any = {
        fromBlock: options?.fromBlock || '0x0',
        toBlock: options?.toBlock || 'latest',
        category: categories,
        withMetadata: true,
        excludeZeroValue: false,
        maxCount: options?.maxCount ? `0x${options.maxCount.toString(16)}` : '0x3e8', // Convert to hex, default 1000
        order: 'desc',
      };

      // Fetch both outgoing and incoming transactions
      // We'll make two calls and combine the results
      const outgoingParams = { ...params, fromAddress: address };
      const incomingParams = { ...params, toAddress: address };

      if (options?.pageKey) {
        outgoingParams.pageKey = options.pageKey;
      }

      // Fetch outgoing transactions (from this address)
      const outgoingResponse = await fetch(chain.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [outgoingParams],
          id: 1,
        }),
      });

      const outgoingData = (await outgoingResponse.json()) as {
        result?: {
          transfers: Array<any>;
          pageKey?: string;
        };
        error?: { message: string };
      };

      if (outgoingData.error) {
        throw new Error(outgoingData.error.message);
      }

      // Fetch incoming transactions (to this address)
      const incomingResponse = await fetch(chain.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [incomingParams],
          id: 2,
        }),
      });

      const incomingData = (await incomingResponse.json()) as {
        result?: {
          transfers: Array<any>;
          pageKey?: string;
        };
        error?: { message: string };
      };

      if (incomingData.error) {
        throw new Error(incomingData.error.message);
      }

      // Combine both results and remove duplicates based on transaction hash
      const outgoingTransfers = outgoingData.result?.transfers || [];
      const incomingTransfers = incomingData.result?.transfers || [];

      // Use a Map to deduplicate by hash + asset + category
      // This ensures we capture all asset transfers in multi-asset transactions
      // (e.g., ETH + ERC20 token in same transaction)
      const transfersMap = new Map();

      [...outgoingTransfers, ...incomingTransfers].forEach(transfer => {
        // Create unique key: hash + asset + category
        // This allows multiple transfers in the same transaction (e.g., ETH gas + ERC20 transfer)
        const uniqueKey = `${transfer.hash}-${transfer.asset || 'native'}-${transfer.category}`;
        if (!transfersMap.has(uniqueKey)) {
          transfersMap.set(uniqueKey, transfer);
        }
      });

      const allTransfers = Array.from(transfersMap.values());

      // Sort by block number (descending)
      allTransfers.sort((a, b) => {
        const blockA = parseInt(a.blockNum, 16);
        const blockB = parseInt(b.blockNum, 16);
        return blockB - blockA;
      });

      console.log(`[BlockchainService] Found ${allTransfers.length} transactions on ${chainName} (${outgoingTransfers.length} outgoing, ${incomingTransfers.length} incoming)`);

      return {
        transfers: allTransfers,
        pageKey: outgoingData.result?.pageKey,
      };
    } catch (error) {
      console.error(`[BlockchainService] Error fetching transactions for ${chainName}:`, error);
      throw error;
    }
  }

  /**
   * Get transaction details including timestamp
   */
  static async getTransactionDetails(
    hash: string,
    chainName: string
  ): Promise<{
    blockNumber: string;
    timestamp: Date;
    from: string;
    to: string | null;
    value: string;
    gas: string;
    gasPrice: string;
  } | null> {
    const chain = this.getChainConfig(chainName);
    if (!chain) {
      throw new Error(`Unsupported chain: ${chainName}`);
    }

    try {
      // Get transaction receipt
      const txResponse = await fetch(chain.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionByHash',
          params: [hash],
          id: 1,
        }),
      });

      const txData = (await txResponse.json()) as {
        result?: {
          blockNumber: string;
          from: string;
          to: string | null;
          value: string;
          gas: string;
          gasPrice: string;
        };
      };

      if (!txData.result) {
        return null;
      }

      // Get block details for timestamp
      const blockResponse = await fetch(chain.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: [txData.result.blockNumber, false],
          id: 1,
        }),
      });

      const blockData = (await blockResponse.json()) as {
        result?: { timestamp: string };
      };

      if (!blockData.result?.timestamp) {
        return null;
      }

      const timestamp = new Date(parseInt(blockData.result.timestamp, 16) * 1000);

      return {
        blockNumber: txData.result.blockNumber,
        timestamp,
        from: txData.result.from,
        to: txData.result.to,
        value: txData.result.value,
        gas: txData.result.gas,
        gasPrice: txData.result.gasPrice,
      };
    } catch (error) {
      console.error(`[BlockchainService] Error getting transaction details:`, error);
      return null;
    }
  }

  /**
   * Validate Ethereum address format
   */
  static isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Validate ENS name format
   */
  static isValidENS(name: string): boolean {
    return /^[a-z0-9-]+\.eth$/.test(name.toLowerCase());
  }

  /**
   * Resolve ENS name to Ethereum address
   * Uses Ethereum mainnet ENS registry
   */
  static async resolveENS(ensName: string): Promise<string | null> {
    try {
      const ethChain = this.getChainConfig('Ethereum');
      if (!ethChain) {
        throw new Error('Ethereum chain config not found');
      }

      // Normalize ENS name
      const normalized = ensName.toLowerCase();

      // Call eth_call to resolve ENS
      // ENS Public Resolver on Ethereum mainnet
      const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

      // Use Alchemy's enhanced ENS resolution if available
      if (ethChain.rpcUrl.includes('alchemy.com')) {
        const response = await fetch(ethChain.rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'alchemy_resolveEns',
            params: [normalized],
            id: 1,
          }),
        });

        const data = (await response.json()) as {
          result?: string;
          error?: { message: string };
        };

        if (data.error) {
          console.error(`[BlockchainService] ENS resolution error:`, data.error);
          return null;
        }

        return data.result || null;
      }

      // Fallback: standard ENS resolution (more complex, requires namehash)
      console.log(`[BlockchainService] ENS resolution for ${normalized} not supported on non-Alchemy RPC`);
      return null;
    } catch (error) {
      console.error(`[BlockchainService] Error resolving ENS:`, error);
      return null;
    }
  }

  /**
   * Get chain configuration by name
   */
  static getChainConfig(chainName: string): ChainConfig | undefined {
    return this.CHAINS.find((c) => c.name === chainName);
  }

  /**
   * Get all supported chains
   */
  static getSupportedChains(): ChainConfig[] {
    return this.CHAINS;
  }

  /**
   * Get ERC20 token balances for an address
   * Only works with Alchemy chains
   */
  static async getTokenBalances(
    address: string,
    chainName: string
  ): Promise<
    Array<{
      contractAddress: string;
      tokenBalance: string;
      symbol?: string;
      name?: string;
      decimals?: number;
      readableBalance?: number;
    }>
  > {
    const chain = this.getChainConfig(chainName);
    if (!chain || !chain.rpcUrl.includes('alchemy.com')) {
      console.log(`[BlockchainService] ${chainName} does not support Alchemy token balance API`);
      return [];
    }

    try {
      // Get token balances
      const response = await fetch(chain.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getTokenBalances',
          params: [address],
          id: 1,
        }),
      });

      const data = (await response.json()) as {
        result?: {
          tokenBalances: Array<{
            contractAddress: string;
            tokenBalance: string;
            error?: string;
          }>;
        };
      };

      if (!data.result?.tokenBalances) {
        return [];
      }

      // Filter tokens with non-zero balance
      const tokensWithBalance = data.result.tokenBalances.filter((t) => {
        if (t.error) return false;
        const balance = BigInt(t.tokenBalance);
        return balance > 0n;
      });

      // Get metadata for each token
      const tokensWithMetadata = await Promise.all(
        tokensWithBalance.map(async (token) => {
          try {
            const metaResponse = await fetch(chain.rpcUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'alchemy_getTokenMetadata',
                params: [token.contractAddress],
                id: 1,
              }),
            });

            const metaData = (await metaResponse.json()) as {
              result?: {
                symbol?: string;
                name?: string;
                decimals?: number;
              };
            };

            const decimals = metaData.result?.decimals || 18;
            const balance = BigInt(token.tokenBalance);
            const readableBalance = Number(balance) / Math.pow(10, decimals);

            return {
              contractAddress: token.contractAddress,
              tokenBalance: token.tokenBalance,
              symbol: metaData.result?.symbol,
              name: metaData.result?.name,
              decimals,
              readableBalance,
            };
          } catch (error) {
            console.error(`[BlockchainService] Error getting token metadata for ${token.contractAddress}:`, error);
            return {
              contractAddress: token.contractAddress,
              tokenBalance: token.tokenBalance,
            };
          }
        })
      );

      return tokensWithMetadata;
    } catch (error) {
      console.error(`[BlockchainService] Error getting token balances for ${chainName}:`, error);
      return [];
    }
  }
}
