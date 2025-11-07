const address = '0x9ccca0a968a9bc5916e0de43ea2d68321655ae67';

async function checkTokenBalance() {
  try {
    // Check Ethereum token balances
    const response = await fetch('https://eth-mainnet.g.alchemy.com/v2/taSfcL3OXsU98SVyoIwLi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [address],
        id: 1
      })
    });

    const data = await response.json();

    if (data.result) {
      const tokensWithBalance = data.result.tokenBalances.filter(t => {
        const balance = parseInt(t.tokenBalance, 16);
        return balance > 0;
      });

      console.log('📊 Tokens with balance on Ethereum:', tokensWithBalance.length);
      console.log('');

      // Get token metadata for tokens with balance
      for (const token of tokensWithBalance.slice(0, 10)) {
        const balance = parseInt(token.tokenBalance, 16);

        // Get token metadata
        const metaResponse = await fetch('https://eth-mainnet.g.alchemy.com/v2/taSfcL3OXsU98SVyoIwLi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'alchemy_getTokenMetadata',
            params: [token.contractAddress],
            id: 1
          })
        });

        const metaData = await metaResponse.json();

        if (metaData.result) {
          const decimals = metaData.result.decimals || 18;
          const symbol = metaData.result.symbol || 'UNKNOWN';
          const name = metaData.result.name || 'Unknown Token';
          const readableBalance = balance / Math.pow(10, decimals);

          console.log(`✅ ${symbol} (${name})`);
          console.log(`   Address: ${token.contractAddress}`);
          console.log(`   Balance: ${readableBalance.toFixed(6)}`);
          console.log('');
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTokenBalance();
