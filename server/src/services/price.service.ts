/**
 * Price Service
 *
 * Fetches token prices from CoinGecko API
 */

export class PriceService {
  private static readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';
  private static priceCache: Map<string, { price: number; timestamp: number }> = new Map();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Token contract address to CoinGecko ID mapping
   */
  private static readonly TOKEN_ID_MAP: Record<string, string> = {
    // Ethereum mainnet
    '0xc944e90c64b2c07662a292be6244bdf05cda44a7': 'the-graph', // GRT
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd-coin', // USDC
    '0xdac17f958d2ee523a2206206994597c13d831ec7': 'tether', // USDT
    '0x6b175474e89094c44da98b954eedeac495271d0f': 'dai', // DAI
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'wrapped-bitcoin', // WBTC
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'weth', // WETH
    '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'matic-network', // MATIC (Ethereum)
  };

  /**
   * Get current price for a token by contract address
   */
  static async getTokenPrice(contractAddress: string): Promise<number | null> {
    const normalizedAddress = contractAddress.toLowerCase();

    // Check cache first
    const cached = this.priceCache.get(normalizedAddress);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.price;
    }

    // Get CoinGecko ID
    const coinGeckoId = this.TOKEN_ID_MAP[normalizedAddress];
    if (!coinGeckoId) {
      console.log(`[PriceService] No CoinGecko ID mapping for ${contractAddress}`);
      return null;
    }

    try {
      const response = await fetch(
        `${this.COINGECKO_API}/simple/price?ids=${coinGeckoId}&vs_currencies=usd`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error(`[PriceService] CoinGecko API error: ${response.status}`);
        return null;
      }

      const data = (await response.json()) as Record<string, { usd?: number }>;
      const price = data[coinGeckoId]?.usd;

      if (price) {
        // Cache the price
        this.priceCache.set(normalizedAddress, {
          price,
          timestamp: Date.now(),
        });
        return price;
      }

      return null;
    } catch (error) {
      console.error(`[PriceService] Error fetching price for ${coinGeckoId}:`, error);
      return null;
    }
  }

  /**
   * Get prices for multiple tokens
   */
  static async getTokenPrices(contractAddresses: string[]): Promise<Map<string, number>> {
    const prices = new Map<string, number>();

    await Promise.all(
      contractAddresses.map(async (address) => {
        const price = await this.getTokenPrice(address);
        if (price !== null) {
          prices.set(address.toLowerCase(), price);
        }
      })
    );

    return prices;
  }

  /**
   * Calculate USD value for a token balance
   */
  static async calculateTokenValueUsd(
    contractAddress: string,
    balance: string,
    decimals: number
  ): Promise<number | null> {
    const price = await this.getTokenPrice(contractAddress);
    if (price === null) {
      return null;
    }

    const balanceFloat = parseFloat(balance);
    if (isNaN(balanceFloat)) {
      return null;
    }

    return balanceFloat * price;
  }
}
