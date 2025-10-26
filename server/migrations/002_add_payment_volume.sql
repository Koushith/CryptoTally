-- Add payment_volume column to waitlist table
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS payment_volume VARCHAR(50);

-- Add comment for documentation
COMMENT ON COLUMN waitlist.payment_volume IS 'Monthly crypto payment volume: <10k, 10k-100k, or >100k';
