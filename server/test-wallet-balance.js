const TOKEN = process.env.TOKEN || 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjU0NTEzMjA5OWFkNmJmNjEzODJiNmI0Y2RlOWEyZGZlZDhjYjMwZjAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiS291c2hpdGggQi5SIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tKZmNmUVQyYjA5akE3aU02STdVckNnS2UtelRVcHRfR2p5Y25FQ0xQRW5ad0UwcDF1U1E9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY3J5cHRvdGFsbHktNWJkZDgiLCJhdWQiOiJjcnlwdG90YWxseS01YmRkOCIsImF1dGhfdGltZSI6MTc2MjUxOTM1NiwidXNlcl9pZCI6IlVJcGJpMVdxQmJoV25Gam1vYmhORDlJSXppdTIiLCJzdWIiOiJVSXBiaTFXcUJiaFduRmptb2JoTkQ5SUl6aXUyIiwiaWF0IjoxNzYyNTI4NTU5LCJleHAiOjE3NjI1MzIxNTksImVtYWlsIjoia291c2hpdGg5N0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNTk4Mjg0OTUyMTkyNjA1Mzc3MSJdLCJlbWFpbCI6WyJrb3VzaGl0aDk3QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.MRavnwNxs_RGxwVhcYyLknOPJn0bFTGansbcjdTHeH-YFRiq2Jb3AL1xGJcp-ykRyjttIvHIrJs3WwJxDCP6fFJQ3nDWtGc6JWNpCgf5QJISds0GotW8y3kweEkQuuER8kWCuQczZ_0ZSSCehdwd3h3nTFVXCGecaq1GzGAg0LIdK17KMxnPtW0V2GFRw15pjfiZ4jQlaYK-WxloPkeYt1g0xYxCCHgxWGzk3Wr8ltToSACC7BKnyPumtfEFY2k2Kp1xpCYGvQ0TpdzwJSgfueTCR0s6lwA28WUrmbSKKwDJPr0y1tqWURlDU9sAYg2WOwkJFUkwtTdoYP1mKzG1hg';

async function testWalletBalance() {
  try {
    const response = await fetch('http://localhost:8000/api/wallets/1/balances?workspaceId=1', {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    const data = await response.json();

    if (!data.success) {
      console.error('❌ API Error:', data.error);
      return;
    }

    console.log('✅ Wallet Balance Results:');
    console.log('   Wallet Address:', data.wallet.address);
    console.log('');
    console.log('📊 Summary:');
    console.log('   Total Native USD:', '$' + data.summary.totalNativeUsd);
    console.log('   Chains with Tokens:', data.summary.chainsWithTokens);
    console.log('   Total Token Types:', data.summary.totalTokenTypes);
    console.log('');

    data.balances.forEach(chain => {
      console.log(`🔗 ${chain.chainName}:`);
      console.log(`   Native Balance: ${chain.nativeBalance} (~$${chain.nativeBalanceUsd})`);

      if (chain.tokens.length > 0) {
        console.log(`   ERC20 Tokens:`);
        chain.tokens.forEach(token => {
          console.log(`     • ${token.symbol || 'Unknown'}: ${token.balance?.toFixed(4) || 0}`);
          if (token.name) {
            console.log(`       ${token.name}`);
          }
        });
      } else {
        console.log(`   No ERC20 tokens`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWalletBalance();
