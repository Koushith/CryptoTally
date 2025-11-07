-- Migration: Update transactions table unique constraint to support multi-asset transactions
-- Date: 2025-11-07
-- Description: Changes unique constraint from (wallet_id, hash, chain_id) to include asset and category
--              This allows storing multiple asset transfers (ETH + ERC20) in the same transaction

-- Drop the old unique constraint if it exists
ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS transactions_wallet_id_hash_chain_id_key;

-- Create new unique constraint that includes asset and category
-- This allows multiple asset transfers (ETH + ERC20) in the same transaction
CREATE UNIQUE INDEX IF NOT EXISTS transactions_wallet_id_hash_chain_id_asset_category_key
ON transactions (wallet_id, hash, chain_id, COALESCE(asset, ''), category);
