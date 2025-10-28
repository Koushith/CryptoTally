-- Migration: Add workspace invitations table
-- Description: Allows inviting users via magic link even if they don't have an account yet

CREATE TABLE IF NOT EXISTS "workspace_invitations" (
  "id" serial PRIMARY KEY NOT NULL,
  "workspace_id" integer NOT NULL,
  "email" text NOT NULL,
  "role" varchar(20) NOT NULL DEFAULT 'viewer',
  "token" text NOT NULL UNIQUE,
  "invited_by" integer NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "expires_at" timestamp NOT NULL,
  "accepted_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "workspace_invitations_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
  CONSTRAINT "workspace_invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create index for faster lookups by token
CREATE INDEX IF NOT EXISTS "idx_workspace_invitations_token" ON "workspace_invitations" ("token");

-- Create index for faster lookups by email and status
CREATE INDEX IF NOT EXISTS "idx_workspace_invitations_email_status" ON "workspace_invitations" ("email", "status");

-- Create index for faster lookups by workspace_id
CREATE INDEX IF NOT EXISTS "idx_workspace_invitations_workspace_id" ON "workspace_invitations" ("workspace_id");

-- Add constraint to ensure role is valid
ALTER TABLE "workspace_invitations"
  ADD CONSTRAINT "workspace_invitations_role_check"
  CHECK ("role" IN ('admin', 'editor', 'viewer'));

-- Add constraint to ensure status is valid
ALTER TABLE "workspace_invitations"
  ADD CONSTRAINT "workspace_invitations_status_check"
  CHECK ("status" IN ('pending', 'accepted', 'expired', 'revoked'));

-- Create a composite unique index to prevent duplicate pending invitations
CREATE UNIQUE INDEX IF NOT EXISTS "idx_workspace_invitations_unique_pending"
  ON "workspace_invitations" ("workspace_id", "email", "status")
  WHERE "status" = 'pending';
