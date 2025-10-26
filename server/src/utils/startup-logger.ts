import { env } from '../config/env';
import { getBaseUrl } from './config.util';

/**
 * Startup Logger
 * Pretty-prints server startup information
 */

/**
 * Print server startup banner and configuration
 */
export async function logServerStartup(): Promise<void> {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         🚀 CryptoTally Server Started                 ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Environment
  console.log('📋 Environment Configuration:');
  console.log(`   └─ Mode: ${env.NODE_ENV}`);
  console.log(`   └─ Port: ${env.PORT}`);

  // URLs
  const apiUrl = getBaseUrl('backend');
  console.log('');
  console.log('🔗 Server URLs:');
  console.log(`   └─ API: ${apiUrl}/api`);
  console.log(`   └─ Health: ${apiUrl}/api/health`);
  console.log('');

  // Database connection
  await checkDatabaseConnection();

  console.log('\n' + '─'.repeat(56) + '\n');
  console.log('✨ Server is ready to handle requests!\n');
}

/**
 * Check and log PostgreSQL connection status
 */
async function checkDatabaseConnection(): Promise<void> {
  try {
    const { pool } = await import('../config/database');
    await pool.query('SELECT NOW()');
    const dbUrl = env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'Unknown';

    console.log('🐘 PostgreSQL:');
    console.log('   └─ Status: ✅ Connected');
    console.log(`   └─ URL: ${dbUrl}`);
  } catch (error) {
    console.log('🐘 PostgreSQL:');
    console.log('   └─ Status: ❌ Connection failed');
    console.log(`   └─ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.log('   └─ Tip: brew services start postgresql@18');
  }
}
