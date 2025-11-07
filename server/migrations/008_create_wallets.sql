-- Create wallets table
CREATE TABLE "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"workspace_id" integer NOT NULL,
	"address" varchar(255) NOT NULL,
	"label" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_synced_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create wallet_chains table
CREATE TABLE "wallet_chains" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_id" integer NOT NULL,
	"chain_name" varchar(100) NOT NULL,
	"chain_id" integer NOT NULL,
	"has_activity" boolean DEFAULT false NOT NULL,
	"transaction_count" integer DEFAULT 0 NOT NULL,
	"balance" varchar(255),
	"balance_usd" numeric(20, 2),
	"last_activity_at" timestamp,
	"last_activity_description" varchar(500),
	"last_synced_at" timestamp,
	"sync_status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_workspace_id_workspaces_id_fk"
  FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "wallet_chains" ADD CONSTRAINT "wallet_chains_wallet_id_wallets_id_fk"
  FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;
