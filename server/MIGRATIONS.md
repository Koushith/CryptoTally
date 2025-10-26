# Database Migrations Guide

## How It Works

The migration system tracks which SQL files have been executed using a `schema_migrations` table. Each migration runs only once.

## Migration Files

All SQL migrations go in the `migrations/` folder with numbered names:
- `001_init.sql` - Initial schema
- `002_add_payment_volume.sql` - Add payment volume column
- `003_your_next_migration.sql` - etc.

## Local Development

### Run migrations locally:
```bash
npm run migrate
```

This runs against your local DATABASE_URL from `.env.local`

## Production

### Option 1: Manual (Current)
Run migrations manually using Railway CLI or psql:
```bash
npm run migrate:prod
```

### Option 2: Automatic on Deploy (Recommended)

Add this to your Railway service:
1. Go to your Railway service settings
2. Add a "Build Command":
   ```
   npm install && npm run build
   ```
3. Add a "Start Command":
   ```
   npm run migrate:prod && npm start
   ```

This will automatically run migrations before starting the server on every deploy.

## Creating New Migrations

1. Create a new SQL file in `migrations/` folder:
   ```bash
   # Example: 003_add_new_table.sql
   ```

2. Write your SQL:
   ```sql
   CREATE TABLE IF NOT EXISTS new_table (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL
   );
   ```

3. Run locally to test:
   ```bash
   npm run migrate
   ```

4. Commit and push:
   ```bash
   git add migrations/003_add_new_table.sql
   git commit -m "Add new_table migration"
   git push
   ```

5. On Railway (if using automatic):
   - Migration runs automatically on deploy

   OR manually:
   ```bash
   npm run migrate:prod
   ```

## Tracking Table

The system automatically creates a `schema_migrations` table:
```sql
CREATE TABLE schema_migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

This tracks which migrations have been executed to prevent running them twice.

## Safety Features

- ✅ **Transactional**: Each migration runs in a transaction (rolls back on error)
- ✅ **Idempotent**: Migrations run only once (tracked in schema_migrations)
- ✅ **Ordered**: Migrations run in alphabetical order (001, 002, 003...)
- ✅ **Environment-aware**: Uses correct DATABASE_URL for dev/prod

## Common Commands

```bash
# Run migrations locally
npm run migrate

# Run migrations on production
npm run migrate:prod

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Troubleshooting

### "Migration already executed"
This is normal - it means the migration was already run. The system tracks this.

### "DATABASE_URL not found"
Make sure your `.env.local` (dev) or environment variables (prod) have DATABASE_URL set.

### Force re-run a migration
Delete the entry from `schema_migrations` table:
```sql
DELETE FROM schema_migrations WHERE name = '003_your_migration.sql';
```
Then run `npm run migrate` again.
