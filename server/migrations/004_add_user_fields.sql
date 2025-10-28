-- Add firebase_uid and other auth fields to users table

-- Add firebase_uid column (if not exists)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128) UNIQUE,
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'email' NOT NULL,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

-- Make firebase_uid NOT NULL after data migration (if needed)
-- Users created before this migration will need firebase_uid populated
