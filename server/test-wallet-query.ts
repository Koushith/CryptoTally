import { db } from './src/config/database';
import { wallets } from './src/db/schema';
import { eq, and } from 'drizzle-orm';

async function testQuery() {
  try {
    console.log('Testing wallet query...');
    
    const result = await db
      .select()
      .from(wallets)
      .where(and(eq(wallets.workspaceId, 2), eq(wallets.address, '0x9ccca0a968a9bc5916e0de43ea2d68321655ae67')))
      .limit(1);
    
    console.log('Query successful!');
    console.log('Result:', result);
    process.exit(0);
  } catch (error) {
    console.error('Query failed:', error);
    process.exit(1);
  }
}

testQuery();
