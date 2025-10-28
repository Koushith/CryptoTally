# Workspace Invitations - Feature Specification

## Overview

The Workspace Invitations feature enables workspace administrators to invite new members via secure magic links, even if the invitee doesn't have an account yet. This implements a frictionless onboarding experience where users can receive invitations, create accounts if needed, and automatically join workspaces.

## Problem Statement

**Before this feature:**
- Only existing users could be added to workspaces
- Required manual account creation before invitation
- No way to send invitations to external users
- Poor onboarding experience for new team members

**After this feature:**
- Invite anyone via email, account or not
- Magic link invitations with secure tokens
- Automatic workspace joining after account creation
- Complete invitation lifecycle tracking

## Core Requirements

### Functional Requirements

1. **Invitation Creation**
   - Admins can invite users via email address
   - Support for all role types (admin, editor, viewer)
   - Generate cryptographically secure unique tokens
   - Set expiration (7 days default)
   - Send invitation emails via Resend
   - Fallback to console logging for development

2. **Invitation Acceptance**
   - Public endpoint to view invitation details (no auth required)
   - Validate token security and status
   - Redirect unauthenticated users to sign-up/login
   - Automatic workspace membership creation
   - One-time use enforcement
   - Email verification (invitation only works for intended recipient)

3. **Invitation Management**
   - View all invitations for a workspace
   - Filter by status (pending, accepted, expired, revoked)
   - Revoke pending invitations
   - Auto-expire expired invitations
   - Track invitation metadata (inviter, dates, etc.)

### Non-Functional Requirements

1. **Security**
   - Cryptographically secure tokens (256-bit entropy)
   - URL-safe token encoding
   - One-time use enforcement
   - Email verification
   - Expiration enforcement
   - Protection against brute force attacks

2. **Performance**
   - Fast token generation (<10ms)
   - Efficient database queries with indexes
   - Email sending shouldn't block API responses
   - Batch invitation support (future)

3. **User Experience**
   - Beautiful invitation emails with HTML templates
   - Clear call-to-action buttons
   - Mobile-responsive email design
   - Friendly error messages
   - Status indicators in UI

4. **Reliability**
   - Graceful email service degradation
   - Console logging fallback
   - Proper error handling
   - Transaction safety

## System Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Invitation System                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Workspace  │─────▶│  Invitation  │─────▶│    Email     │
│  Controller  │      │   Service    │      │   Service    │
└──────────────┘      └──────────────┘      └──────────────┘
       │                      │                      │
       │                      │                      │
       ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Database   │      │    Token     │      │   Resend     │
│  (Postgres)  │      │   Generator  │      │     API      │
└──────────────┘      └──────────────┘      └──────────────┘
```

### Database Schema

**Table: `workspace_invitations`**

```sql
CREATE TABLE workspace_invitations (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'viewer',
  token TEXT NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP NOT NULL,
  invited_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_workspace_invitations_token ON workspace_invitations(token);
CREATE INDEX idx_workspace_invitations_email_status ON workspace_invitations(email, status);
CREATE INDEX idx_workspace_invitations_workspace_id ON workspace_invitations(workspace_id);

-- Unique constraint: prevent duplicate pending invitations
CREATE UNIQUE INDEX idx_workspace_invitations_unique_pending
  ON workspace_invitations(workspace_id, email, status)
  WHERE status = 'pending';
```

### State Machine

```
                    ┌──────────┐
                    │  CREATE  │
                    └────┬─────┘
                         │
                         ▼
                   ┌──────────┐
                   │ PENDING  │────────┐
                   └────┬─────┘        │
                        │              │
        ┌───────────────┼──────────────┤
        │               │              │
        ▼               ▼              ▼
  ┌──────────┐   ┌──────────┐   ┌──────────┐
  │ ACCEPTED │   │ EXPIRED  │   │ REVOKED  │
  └──────────┘   └──────────┘   └──────────┘
   (terminal)     (terminal)     (terminal)
```

**Status Transitions:**
- `PENDING → ACCEPTED`: User accepts invitation
- `PENDING → EXPIRED`: Token expires (7 days)
- `PENDING → REVOKED`: Admin cancels invitation
- Terminal states cannot be changed

## Token Generation

### Algorithm

```typescript
function generateInvitationToken(): string {
  // 1. Generate 32 random bytes (256 bits of entropy)
  const buffer = crypto.randomBytes(32);

  // 2. Convert to base64
  let token = buffer.toString('base64');

  // 3. Make URL-safe
  token = token
    .replace(/\+/g, '-')  // Replace + with -
    .replace(/\//g, '_')  // Replace / with _
    .replace(/=/g, '');   // Remove padding

  return token;
}
```

**Security Properties:**
- 256 bits of entropy (2^256 possible values)
- Cryptographically secure random number generator
- URL-safe characters only
- Impossible to guess or brute force
- Unique constraint in database prevents collisions

## Email Templates

### Invitation Email

**Subject:** `{inviterName} invited you to join {workspaceName}`

**Content:**
- Hero section with CryptoTally branding
- Personalized greeting
- Workspace and role information
- Prominent "Accept Invitation" button
- Expiration warning (7 days)
- Fallback link for button failures
- Security note (can safely ignore if unexpected)

**Template Variables:**
- `workspaceName`: Name of the workspace
- `inviterName`: Name of person who sent invitation
- `role`: Role being assigned (admin/editor/viewer)
- `inviteUrl`: Magic link URL
- `expiresInDays`: Number of days until expiration

## API Endpoints

### 1. Send Invitation

```
POST /api/workspace/:workspaceId/members
Authorization: Bearer {token}
```

**Request:**
```json
{
  "email": "teammate@example.com",
  "role": "viewer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "email": "teammate@example.com",
    "role": "viewer",
    "expiresAt": "2025-02-04T10:30:00Z"
  }
}
```

### 2. Get Invitation Details (Public)

```
GET /api/workspace/invite/:token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "email": "teammate@example.com",
    "role": "viewer",
    "workspace": {
      "id": 1,
      "name": "My Organization",
      "type": "organization"
    },
    "inviter": {
      "name": "John Doe"
    },
    "expiresAt": "2025-02-04T10:30:00Z"
  }
}
```

### 3. Accept Invitation

```
POST /api/workspace/invite/:token/accept
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Invitation accepted successfully",
  "data": {
    "workspaceId": 1,
    "role": "viewer"
  }
}
```

### 4. List Invitations

```
GET /api/workspace/:workspaceId/invitations
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "teammate@example.com",
      "role": "viewer",
      "status": "pending",
      "expiresAt": "2025-02-04T10:30:00Z",
      "acceptedAt": null,
      "createdAt": "2025-01-28T10:30:00Z",
      "invitedBy": {
        "name": "John Doe"
      }
    }
  ]
}
```

### 5. Revoke Invitation

```
DELETE /api/workspace/:workspaceId/invitations/:invitationId
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Invitation revoked successfully"
}
```

## Edge Cases & Error Handling

### 1. Duplicate Invitations

**Scenario:** Admin tries to invite email that already has pending invitation

**Behavior:**
- Return 400 Bad Request
- Message: "An invitation has already been sent to this email"
- User can revoke old invitation and send new one

### 2. Expired Token

**Scenario:** User clicks invitation link after 7 days

**Behavior:**
- Auto-update status to 'expired' in database
- Return 400 Bad Request
- Message: "This invitation has expired"
- Suggest contacting workspace owner for new invitation

### 3. Already Accepted

**Scenario:** User tries to use invitation link twice

**Behavior:**
- Return 400 Bad Request
- Message: "This invitation has already been accepted"
- Suggest logging in if already member

### 4. Email Mismatch

**Scenario:** User logs in with different email than invitation was sent to

**Behavior:**
- Return 403 Forbidden
- Message: "This invitation was sent to a different email address"
- Enforce email verification for security

### 5. Already a Member

**Scenario:** Invited user is already member of workspace

**Behavior:**
- Mark invitation as accepted
- Don't create duplicate membership
- Return success with message: "You are already a member of this workspace"

### 6. Revoked Invitation

**Scenario:** User clicks link to revoked invitation

**Behavior:**
- Return 400 Bad Request
- Message: "This invitation has been revoked"
- Cannot be reactivated

### 7. Email Service Failure

**Scenario:** Resend API fails or not configured

**Behavior:**
- Fall back to console logging
- Print invitation link to server console
- Still create invitation in database
- Log error but don't fail API request

### 8. Invalid Token

**Scenario:** User modifies or corrupts invitation URL

**Behavior:**
- Return 404 Not Found
- Message: "Invitation not found"
- No information leak about valid tokens

## Security Considerations

### Token Security

1. **Generation**: Using `crypto.randomBytes()` for cryptographic strength
2. **Entropy**: 256 bits makes guessing impossible (2^256 combinations)
3. **URL Safety**: Base64 encoded with URL-safe characters
4. **Uniqueness**: Database constraint prevents collisions
5. **One-time Use**: Status tracking prevents replay attacks

### Email Verification

- Invitation only works for email it was sent to
- Prevents invitation theft
- User must authenticate with matching email

### Expiration

- Default 7-day expiration
- Auto-expire on access
- Prevents indefinite exposure

### Access Control

- Only admins can send invitations
- Only admins can revoke invitations
- Only workspace members can view invitation list

### Rate Limiting

**Future Enhancement:**
- Limit invitations per workspace per hour
- Prevent invitation spam
- Track and alert on suspicious patterns

## Monitoring & Metrics

### Key Metrics to Track

1. **Invitation Funnel**
   - Invitations sent
   - Invitations viewed
   - Invitations accepted
   - Conversion rate

2. **Status Distribution**
   - Pending count
   - Accepted count
   - Expired count
   - Revoked count

3. **Email Delivery**
   - Emails sent successfully
   - Email failures
   - Bounce rate

4. **Time Metrics**
   - Time to acceptance
   - Average acceptance time
   - Expired before acceptance count

## Future Enhancements

### Phase 2

1. **Bulk Invitations**
   - Upload CSV with multiple emails
   - Batch send invitations
   - Progress tracking

2. **Custom Expiration**
   - Admin-configurable expiration period
   - Different expiration per invitation
   - Extend expiration for pending invitations

3. **Invitation Templates**
   - Custom email templates per workspace
   - Personalized branding
   - Multi-language support

4. **Resend Invitations**
   - Resend to pending invitations
   - Generate new token
   - Track resend count

### Phase 3

1. **Team Invitation Links**
   - Generate single link for multiple users
   - Auto-apply role
   - Usage limits

2. **Invitation Analytics**
   - Dashboard for invitation metrics
   - Acceptance rate trends
   - User journey analytics

3. **Webhooks**
   - Notify external systems on invitation events
   - Integration with Slack, Discord, etc.

## Testing Strategy

### Unit Tests

1. Token generation uniqueness
2. Email validation
3. Status transitions
4. Expiration logic
5. Access control checks

### Integration Tests

1. Complete invitation flow
2. Email sending
3. Database transactions
4. Error scenarios

### E2E Tests

1. Send invitation as admin
2. Receive and click link
3. Create account
4. Accept invitation
5. Verify workspace membership

### Security Tests

1. Token brute force resistance
2. Email verification bypass attempts
3. Status manipulation attempts
4. Expired token handling
5. Duplicate invitation prevention

## Rollout Plan

### Phase 1: MVP (✅ Complete)
- Magic link invitations
- Email sending via Resend
- Invitation acceptance flow
- Basic UI for viewing invitations
- Status tracking (pending, accepted, expired, revoked)

### Phase 2: Enhancements (Next)
- Invitation analytics
- Resend functionality
- Custom expiration periods
- Email templates customization

### Phase 3: Enterprise (Future)
- Bulk invitations
- Team invitation links
- Advanced analytics
- Webhooks
- SSO integration

## References

- Database Schema: `/server/docs/architecture/DATABASE_SCHEMA.md`
- API Documentation: `./API.md`
- User Flow: `./USER_FLOW.md`
- Security: `./SECURITY.md`
- Email Service: `/server/src/services/email.service.ts`
- Token Utilities: `/server/src/utils/token.util.ts`
