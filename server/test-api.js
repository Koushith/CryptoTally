const TOKEN = process.env.TOKEN || 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjU0NTEzMjA5OWFkNmJmNjEzODJiNmI0Y2RlOWEyZGZlZDhjYjMwZjAiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiS291c2hpdGggQi5SIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tKZmNmUVQyYjA5akE3aU02STdVckNnS2UtelRVcHRfR2p5Y25FQ0xQRW5ad0UwcDF1U1E9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY3J5cHRvdGFsbHktNWJkZDgiLCJhdWQiOiJjcnlwdG90YWxseS01YmRkOCIsImF1dGhfdGltZSI6MTc2MjUxOTM1NiwidXNlcl9pZCI6IlVJcGJpMVdxQmJoV25Gam1vYmhORDlJSXppdTIiLCJzdWIiOiJVSXBiaTFXcUJiaFduRmptb2JoTkQ5SUl6aXUyIiwiaWF0IjoxNzYyNTI4NTU5LCJleHAiOjE3NjI1MzIxNTksImVtYWlsIjoia291c2hpdGg5N0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNTk4Mjg0OTUyMTkyNjA1Mzc3MSJdLCJlbWFpbCI6WyJrb3VzaGl0aDk3QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.MRavnwNxs_RGxwVhcYyLknOPJn0bFTGansbcjdTHeH-YFRiq2Jb3AL1xGJcp-ykRyjttIvHIrJs3WwJxDCP6fFJQ3nDWtGc6JWNpCgf5QJISds0GotW8y3kweEkQuuER8kWCuQczZ_0ZSSCehdwd3h3nTFVXCGecaq1GzGAg0LIdK17KMxnPtW0V2GFRw15pjfiZ4jQlaYK-WxloPkeYt1g0xYxCCHgxWGzk3Wr8ltToSACC7BKnyPumtfEFY2k2Kp1xpCYGvQ0TpdzwJSgfueTCR0s6lwA28WUrmbSKKwDJPr0y1tqWURlDU9sAYg2WOwkJFUkwtTdoYP1mKzG1hg';

async function testAPI() {
  try {
    const response = await fetch('http://localhost:8000/api/transactions?workspaceId=1', {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    const data = await response.json();

    console.log('✅ API Test Results:');
    console.log('   Success:', data.success);
    console.log('   Transactions found:', data.transactions?.length || 0);

    if (data.transactions && data.transactions.length > 0) {
      console.log('\n📊 Transaction Summary:');
      const byChain = {};
      data.transactions.forEach(tx => {
        byChain[tx.chainName] = (byChain[tx.chainName] || 0) + 1;
      });
      Object.entries(byChain).forEach(([chain, count]) => {
        console.log(`   ${chain}: ${count} transactions`);
      });

      console.log('\n💰 Sample Transaction:');
      const sample = data.transactions[0];
      console.log('   Hash:', sample.hash);
      console.log('   Chain:', sample.chainName);
      console.log('   Asset:', sample.asset);
      console.log('   Value:', sample.value);
      console.log('   Type:', sample.type);
      console.log('   From:', sample.fromAddress.slice(0, 10) + '...');
      console.log('   To:', sample.toAddress?.slice(0, 10) + '...' || 'null');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
