-- Create transactions table
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_id" integer NOT NULL,
	"chain_name" varchar(100) NOT NULL,
	"chain_id" integer NOT NULL,
	"hash" varchar(255) NOT NULL,
	"block_number" bigint NOT NULL,
	"timestamp" timestamp NOT NULL,
	"from_address" varchar(255) NOT NULL,
	"to_address" varchar(255),
	"value" varchar(255),
	"value_usd" numeric(20, 2),
	"asset" varchar(100),
	"category" varchar(50) NOT NULL,
	"type" varchar(50),
	"raw_contract_address" varchar(255),
	"raw_contract_decimals" integer,
	"raw_contract_value" varchar(255),
	"gas_used" varchar(255),
	"gas_price" varchar(255),
	"tx_fee" varchar(255),
	"tx_fee_usd" numeric(20, 2),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	UNIQUE("wallet_id", "hash", "chain_id")
);

-- Create indexes for faster queries
CREATE INDEX "idx_transactions_wallet_id" ON "transactions" ("wallet_id");
CREATE INDEX "idx_transactions_chain_name" ON "transactions" ("chain_name");
CREATE INDEX "idx_transactions_timestamp" ON "transactions" ("timestamp" DESC);
CREATE INDEX "idx_transactions_category" ON "transactions" ("category");
CREATE INDEX "idx_transactions_hash" ON "transactions" ("hash");

-- Add foreign key constraints
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_wallets_id_fk"
  FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;
