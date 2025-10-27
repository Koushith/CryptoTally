-- Create passkeys table
CREATE TABLE IF NOT EXISTS "passkeys" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"credential_id" text NOT NULL,
	"public_key" text NOT NULL,
	"counter" integer DEFAULT 0 NOT NULL,
	"device_type" varchar(50),
	"backup_eligible" boolean DEFAULT false,
	"backup_state" boolean DEFAULT false,
	"transports" text,
	"name" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp,
	CONSTRAINT "passkeys_credential_id_unique" UNIQUE("credential_id")
);

-- Create passkeys_challenges table
CREATE TABLE IF NOT EXISTS "passkeys_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge" text NOT NULL,
	"user_id" integer,
	"type" varchar(20) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "passkeys_challenges_challenge_unique" UNIQUE("challenge")
);

-- Add foreign key constraints
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "passkeys_challenges" ADD CONSTRAINT "passkeys_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
