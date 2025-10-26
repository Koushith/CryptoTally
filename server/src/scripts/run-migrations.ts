import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const isDevelopment = process.env.NODE_ENV === 'development';
const DATABASE_URL = isDevelopment
  ? process.env.DATABASE_URL
  : process.env.PROD_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: isDevelopment ? false : { rejectUnauthorized: false }
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('🔄 Starting migrations...');
    console.log(`📍 Environment: ${isDevelopment ? 'development' : 'production'}`);

    // Create migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Get already executed migrations
    const result = await client.query(
      'SELECT name FROM schema_migrations ORDER BY id'
    );
    const executedMigrations = new Set(result.rows.map(row => row.name));

    // Read migration files
    const migrationsDir = path.join(process.cwd(), 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📁 Found ${files.length} migration files`);

    let executed = 0;
    for (const file of files) {
      if (executedMigrations.has(file)) {
        console.log(`⏭️  Skipping ${file} (already executed)`);
        continue;
      }

      console.log(`▶️  Running ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (name) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`✅ Completed ${file}`);
        executed++;
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Failed to run ${file}:`, error);
        throw error;
      }
    }

    if (executed === 0) {
      console.log('✨ All migrations up to date!');
    } else {
      console.log(`\n🎉 Successfully executed ${executed} new migration(s)`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
