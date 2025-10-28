# Workspace Invitations - API Documentation

## Overview

This document provides detailed API specifications for all workspace invitation endpoints.

## Base URL

```
http://localhost:8000/api (development)
https://api.cryptotally.xyz/api (production)
```

## Authentication

Most endpoints require Bearer token authentication:

```
Authorization: Bearer {firebase_id_token}
```

Public endpoints (marked with 🌐) do not require authentication.

---

## Endpoints

### 1. Send Workspace Invitation

Sends a magic link invitation to a user via email.

**Endpoint:** `POST /api/workspace/:workspaceId/members`

**Authentication:** Required (Admin only)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| workspaceId | integer | ID of the workspace |

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "role": "string (required, enum: 'admin' | 'editor' | 'viewer')"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "email": "teammate@example.com",
    "role": "viewer",
    "expiresAt": "2025-02-04T10:30:00.000Z"
  }
}
```

**Error Responses:**

**400 - Validation Error**
```json
{
  "success": false,
  "error": "Invalid email address"
}
```

**400 - Duplicate Invitation**
```json
{
  "success": false,
  "error": "An invitation has already been sent to this email"
}
```

**401 - Unauthorized**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**403 - Not Admin**
```json
{
  "success": false,
  "error": "Only admins can invite members"
}
```

**404 - Workspace Not Found**
```json
{
  "success": false,
  "error": "Workspace not found"
}
```

**500 - Server Error**
```json
{
  "success": false,
  "error": "Failed to send invitation"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/workspace/1/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newmember@example.com",
    "role": "editor"
  }'
```

**Business Logic:**
1. Verify user is authenticated
2. Check user is admin of workspace
3. Validate email format
4. Normalize email (lowercase, trim)
5. Check for existing pending invitation
6. Generate secure token (256-bit)
7. Calculate expiration (7 days)
8. Create invitation record
9. Send email via Resend (or log to console)
10. Return success response

---

### 2. Get Invitation Details 🌐

Retrieves invitation details by token. Public endpoint - no authentication required.

**Endpoint:** `GET /api/workspace/invite/:token`

**Authentication:** None (Public)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| token | string | Invitation token from magic link |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "email": "invitee@example.com",
    "role": "viewer",
    "workspace": {
      "id": 1,
      "name": "My Organization",
      "type": "organization"
    },
    "inviter": {
      "name": "John Doe"
    },
    "expiresAt": "2025-02-04T10:30:00.000Z"
  }
}
```

**Error Responses:**

**400 - Already Accepted**
```json
{
  "success": false,
  "error": "This invitation has already been accepted"
}
```

**400 - Expired**
```json
{
  "success": false,
  "error": "This invitation has expired"
}
```

**400 - Revoked**
```json
{
  "success": false,
  "error": "This invitation has been revoked"
}
```

**404 - Not Found**
```json
{
  "success": false,
  "error": "Invitation not found"
}
```

**500 - Server Error**
```json
{
  "success": false,
  "error": "Failed to get invitation details"
}
```

**Example Request:**
```bash
curl http://localhost:8000/api/workspace/invite/abc123def456
```

**Business Logic:**
1. Find invitation by token
2. Check if already accepted → error
3. Check if revoked → error
4. Check if expired → mark as expired, error
5. Fetch workspace details
6. Fetch inviter details
7. Return invitation data

**Auto-Expiration:**
- If `expiresAt` < `NOW`, automatically update status to 'expired'
- This prevents expired invitations from being accepted

---

### 3. Accept Invitation

Accepts a workspace invitation and adds user to workspace.

**Endpoint:** `POST /api/workspace/invite/:token/accept`

**Authentication:** Required

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| token | string | Invitation token |

**Request Body:** None

**Success Response (200):**
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

**Success Response - Already Member (200):**
```json
{
  "success": true,
  "message": "You are already a member of this workspace",
  "data": {
    "workspaceId": 1
  }
}
```

**Error Responses:**

**400 - Token Required**
```json
{
  "success": false,
  "error": "Token is required"
}
```

**400 - Already Accepted**
```json
{
  "success": false,
  "error": "This invitation has already been accepted"
}
```

**400 - Revoked**
```json
{
  "success": false,
  "error": "This invitation has been revoked"
}
```

**400 - Expired**
```json
{
  "success": false,
  "error": "This invitation has expired"
}
```

**401 - Unauthorized**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**403 - Email Mismatch**
```json
{
  "success": false,
  "error": "This invitation was sent to a different email address"
}
```

**404 - Not Found**
```json
{
  "success": false,
  "error": "Invitation not found"
}
```

**500 - Server Error**
```json
{
  "success": false,
  "error": "Failed to accept invitation"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/workspace/invite/abc123def456/accept \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Business Logic:**
1. Verify user is authenticated
2. Find invitation by token
3. Verify email matches (invitation.email === user.email)
4. Check status (must be 'pending')
5. Check expiration
6. Check if already member → skip duplicate, mark accepted
7. Create workspace membership record
8. Mark invitation as accepted
9. Set acceptedAt timestamp
10. Return success with workspace ID

**Security Notes:**
- Email verification prevents invitation theft
- One-time use enforced by status change
- Already-member check prevents duplicate memberships

---

### 4. List Workspace Invitations

Gets all invitations for a workspace (any status).

**Endpoint:** `GET /api/workspace/:workspaceId/invitations`

**Authentication:** Required (Workspace member)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| workspaceId | integer | ID of the workspace |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user1@example.com",
      "role": "viewer",
      "status": "pending",
      "expiresAt": "2025-02-04T10:30:00.000Z",
      "acceptedAt": null,
      "createdAt": "2025-01-28T10:30:00.000Z",
      "invitedBy": {
        "name": "John Doe"
      }
    },
    {
      "id": 2,
      "email": "user2@example.com",
      "role": "editor",
      "status": "accepted",
      "expiresAt": "2025-02-04T11:00:00.000Z",
      "acceptedAt": "2025-01-29T14:20:00.000Z",
      "createdAt": "2025-01-28T11:00:00.000Z",
      "invitedBy": {
        "name": "Jane Smith"
      }
    },
    {
      "id": 3,
      "email": "user3@example.com",
      "role": "admin",
      "status": "expired",
      "expiresAt": "2025-01-20T10:00:00.000Z",
      "acceptedAt": null,
      "createdAt": "2025-01-13T10:00:00.000Z",
      "invitedBy": {
        "name": "John Doe"
      }
    }
  ]
}
```

**Error Responses:**

**401 - Unauthorized**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**403 - Not Member**
```json
{
  "success": false,
  "error": "You do not have access to this workspace"
}
```

**404 - User Not Found**
```json
{
  "success": false,
  "error": "User not found"
}
```

**500 - Server Error**
```json
{
  "success": false,
  "error": "Failed to fetch invitations"
}
```

**Example Request:**
```bash
curl http://localhost:8000/api/workspace/1/invitations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Business Logic:**
1. Verify user is authenticated
2. Verify user is member of workspace
3. Fetch all invitations for workspace (ordered by createdAt)
4. Join with users table for inviter name
5. Auto-expire any pending invitations past expiresAt
6. Return invitation list

**Query Optimization:**
- Uses `idx_workspace_invitations_workspace_id` index
- LEFT JOIN on users table for inviter details
- Auto-expiration happens in-line (updates database)

---

### 5. Revoke Invitation

Revokes a pending invitation.

**Endpoint:** `DELETE /api/workspace/:workspaceId/invitations/:invitationId`

**Authentication:** Required (Admin only)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| workspaceId | integer | ID of the workspace |
| invitationId | integer | ID of the invitation |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Invitation revoked successfully"
}
```

**Error Responses:**

**400 - Invalid Status**
```json
{
  "success": false,
  "error": "Cannot revoke accepted invitation"
}
```

**401 - Unauthorized**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**403 - Not Admin**
```json
{
  "success": false,
  "error": "Only admins can revoke invitations"
}
```

**403 - Wrong Workspace**
```json
{
  "success": false,
  "error": "Invitation does not belong to this workspace"
}
```

**404 - Not Found**
```json
{
  "success": false,
  "error": "Invitation not found"
}
```

**500 - Server Error**
```json
{
  "success": false,
  "error": "Failed to revoke invitation"
}
```

**Example Request:**
```bash
curl -X DELETE http://localhost:8000/api/workspace/1/invitations/5 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Business Logic:**
1. Verify user is authenticated
2. Verify user is admin of workspace
3. Find invitation by ID
4. Verify invitation belongs to workspace
5. Check status is 'pending' (can't revoke accepted/expired/revoked)
6. Update status to 'revoked'
7. Return success

**Status Restrictions:**
- Can only revoke 'pending' invitations
- Cannot revoke 'accepted', 'expired', or 'revoked' invitations

---

## Error Codes Summary

| HTTP Code | Meaning | Common Causes |
|-----------|---------|---------------|
| 200 | OK | Successful operation |
| 201 | Created | Invitation sent successfully |
| 400 | Bad Request | Validation error, duplicate, expired, etc. |
| 401 | Unauthorized | Missing or invalid auth token |
| 403 | Forbidden | Not admin, email mismatch, etc. |
| 404 | Not Found | Invitation, user, or workspace not found |
| 500 | Server Error | Database error, unexpected failure |

## Rate Limiting

**Current:** Not implemented

**Future:**
- 10 invitations per workspace per hour
- 100 invitation acceptances per user per day
- 1000 invitation list views per workspace per day

## Webhook Events (Future)

```json
{
  "event": "invitation.sent",
  "data": {
    "workspaceId": 1,
    "email": "user@example.com",
    "role": "viewer",
    "invitedBy": "admin@example.com"
  }
}

{
  "event": "invitation.accepted",
  "data": {
    "workspaceId": 1,
    "userId": 42,
    "email": "user@example.com",
    "role": "viewer"
  }
}

{
  "event": "invitation.expired",
  "data": {
    "workspaceId": 1,
    "email": "user@example.com",
    "expiresAt": "2025-02-04T10:30:00Z"
  }
}

{
  "event": "invitation.revoked",
  "data": {
    "workspaceId": 1,
    "email": "user@example.com",
    "revokedBy": "admin@example.com"
  }
}
```

## Database Queries

### Create Invitation

```sql
INSERT INTO workspace_invitations (
  workspace_id,
  email,
  role,
  token,
  invited_by,
  expires_at,
  status,
  created_at,
  updated_at
) VALUES (
  $1, $2, $3, $4, $5, $6, 'pending', NOW(), NOW()
)
RETURNING *;
```

### Find by Token

```sql
SELECT * FROM workspace_invitations
WHERE token = $1
LIMIT 1;
```

### List by Workspace

```sql
SELECT
  wi.*,
  u.name as inviter_name,
  u.email as inviter_email
FROM workspace_invitations wi
LEFT JOIN users u ON wi.invited_by = u.id
WHERE wi.workspace_id = $1
ORDER BY wi.created_at DESC;
```

### Accept Invitation

```sql
-- 1. Create membership
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role,
  invited_by,
  invited_at,
  joined_at,
  is_active
) VALUES ($1, $2, $3, $4, $5, NOW(), true);

-- 2. Mark invitation as accepted
UPDATE workspace_invitations
SET status = 'accepted', accepted_at = NOW()
WHERE id = $1;
```

### Revoke Invitation

```sql
UPDATE workspace_invitations
SET status = 'revoked'
WHERE id = $1 AND workspace_id = $2 AND status = 'pending';
```

## Security Headers

All responses include:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## CORS Configuration

```typescript
{
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## Testing

### Postman Collection

Available at: `/server/docs/postman/workspace-invitations.json`

### Example Test Scenarios

1. **Happy Path**
   - Send invitation → Get details → Accept → Verify membership

2. **Expired Token**
   - Send invitation → Wait 7 days → Try to accept → Verify error

3. **Email Mismatch**
   - Send to user A → Login as user B → Try accept → Verify error

4. **Duplicate Prevention**
   - Send invitation → Try send again → Verify error

5. **Revocation**
   - Send invitation → Revoke → Try to accept → Verify error

## References

- Controller: `/server/src/controllers/workspace.controller.ts`
- Routes: `/server/src/routes/workspace.routes.ts`
- Database Schema: `/server/src/db/schema/workspace-invitations.ts`
- Email Service: `/server/src/services/email.service.ts`
- Token Utils: `/server/src/utils/token.util.ts`
