# Workspace Invitations - User Flows

## Overview

This document details all user journeys for the workspace invitation feature, including flowcharts, sequence diagrams, and edge case handling.

## Primary User Flows

### Flow 1: Invite New User (Happy Path)

```
┌──────────────────────────────────────────────────────────────────┐
│                    INVITE NEW USER FLOW                           │
└──────────────────────────────────────────────────────────────────┘

Actor: Admin                Actor: Invitee

   │                           │
   │ 1. Navigate to            │
   │    Workspace page         │
   ├──────────────────────────►│
   │                           │
   │ 2. Click "Invite          │
   │    Member"                │
   ├──────────────────────────►│
   │                           │
   │ 3. Enter email &          │
   │    select role            │
   ├──────────────────────────►│
   │                           │
   │ 4. Click "Send"           │
   ├──────────────────────────►│
   │                           │
   │                           │ 5. Receive email
   │                           ├─────────────►
   │                           │
   │                           │ 6. Click link
   │                           ├─────────────►
   │                           │
   │                           │ 7. View invitation
   │                           │    details page
   │                           ├─────────────►
   │                           │
   │                           │ 8. Click "Accept
   │                           │    Invitation"
   │                           ├─────────────►
   │                           │
   │                           │ 9. Redirect to auth
   │                           │    (if not logged in)
   │                           ├─────────────►
   │                           │
   │                           │ 10. Sign up/Login
   │                           ├─────────────►
   │                           │
   │                           │ 11. Auto-accept &
   │                           │     join workspace
   │                           ├─────────────►
   │                           │
   │                           │ 12. Redirect to
   │                           │     workspace
   │                           ├─────────────►
   │                           │
   │ 13. See new member        │
   │     in team list          │
   │◄──────────────────────────┤
   │                           │
```

### Flow 2: Existing User Accepts Invitation

```
┌──────────────────────────────────────────────────────────────────┐
│            EXISTING USER ACCEPTS INVITATION                       │
└──────────────────────────────────────────────────────────────────┘

  ┌─────────┐                ┌─────────┐               ┌──────────┐
  │ Invitee │                │ Client  │               │  Server  │
  └────┬────┘                └────┬────┘               └────┬─────┘
       │                          │                         │
       │ 1. Click email link      │                         │
       ├─────────────────────────►│                         │
       │                          │                         │
       │                          │ 2. GET /invite/:token   │
       │                          ├────────────────────────►│
       │                          │                         │
       │                          │ 3. Invitation details   │
       │                          │◄────────────────────────┤
       │                          │                         │
       │ 4. View invitation page  │                         │
       │◄─────────────────────────┤                         │
       │                          │                         │
       │ 5. Already logged in     │                         │
       │    (has auth token)      │                         │
       │                          │                         │
       │ 6. Click "Accept"        │                         │
       ├─────────────────────────►│                         │
       │                          │                         │
       │                          │ 7. POST /invite/:token/ │
       │                          │    accept (with Bearer) │
       │                          ├────────────────────────►│
       │                          │                         │
       │                          │                         │ 8. Verify email
       │                          │                         │    matches
       │                          │                         │
       │                          │                         │ 9. Create
       │                          │                         │    membership
       │                          │                         │
       │                          │                         │ 10. Mark accepted
       │                          │                         │
       │                          │ 11. Success             │
       │                          │◄────────────────────────┤
       │                          │                         │
       │ 12. Show success toast   │                         │
       │◄─────────────────────────┤                         │
       │                          │                         │
       │ 13. Redirect to workspace│                         │
       │◄─────────────────────────┤                         │
       │                          │                         │
```

### Flow 3: New User Creates Account via Invitation

```
┌──────────────────────────────────────────────────────────────────┐
│         NEW USER CREATES ACCOUNT VIA INVITATION                   │
└──────────────────────────────────────────────────────────────────┘

  ┌─────────┐          ┌─────────┐       ┌──────────┐    ┌─────────┐
  │ Invitee │          │ Client  │       │  Server  │    │Firebase │
  └────┬────┘          └────┬────┘       └────┬─────┘    └────┬────┘
       │                    │                  │               │
       │ 1. Click link      │                  │               │
       ├───────────────────►│                  │               │
       │                    │                  │               │
       │                    │ 2. GET /invite/  │               │
       │                    │    :token        │               │
       │                    ├─────────────────►│               │
       │                    │                  │               │
       │                    │ 3. Details       │               │
       │                    │◄─────────────────┤               │
       │                    │                  │               │
       │ 4. View invite     │                  │               │
       │◄───────────────────┤                  │               │
       │                    │                  │               │
       │ 5. Not logged in   │                  │               │
       │                    │                  │               │
       │ 6. Click "Accept"  │                  │               │
       ├───────────────────►│                  │               │
       │                    │                  │               │
       │ 7. Redirect to     │                  │               │
       │    /auth?invite=   │                  │               │
       │    {token}         │                  │               │
       │◄───────────────────┤                  │               │
       │                    │                  │               │
       │ 8. Fill sign-up    │                  │               │
       │    form            │                  │               │
       ├───────────────────►│                  │               │
       │                    │                  │               │
       │                    │ 9. Create account│               │
       │                    ├─────────────────────────────────►│
       │                    │                  │               │
       │                    │ 10. User created │               │
       │                    │◄─────────────────────────────────┤
       │                    │                  │               │
       │                    │ 11. POST /users  │               │
       │                    │     (create DB)  │               │
       │                    ├─────────────────►│               │
       │                    │                  │               │
       │                    │ 12. User in DB   │               │
       │                    │◄─────────────────┤               │
       │                    │                  │               │
       │                    │ 13. POST /invite/│               │
       │                    │     :token/accept│               │
       │                    ├─────────────────►│               │
       │                    │                  │               │
       │                    │ 14. Join workspace              │
       │                    │◄─────────────────┤               │
       │                    │                  │               │
       │ 15. Success!       │                  │               │
       │◄───────────────────┤                  │               │
       │                    │                  │               │
```

## Admin Flows

### Flow 4: View Pending Invitations

```
┌──────────────────────────────────────────────────────────────────┐
│               VIEW PENDING INVITATIONS                            │
└──────────────────────────────────────────────────────────────────┘

  ┌───────┐                 ┌─────────┐               ┌──────────┐
  │ Admin │                 │ Client  │               │  Server  │
  └───┬───┘                 └────┬────┘               └────┬─────┘
      │                          │                         │
      │ 1. Navigate to workspace │                         │
      ├─────────────────────────►│                         │
      │                          │                         │
      │                          │ 2. GET /workspace       │
      │                          ├────────────────────────►│
      │                          │                         │
      │                          │ 3. Workspace details    │
      │                          │◄────────────────────────┤
      │                          │                         │
      │                          │ 4. GET /workspace/:id/  │
      │                          │    invitations          │
      │                          ├────────────────────────►│
      │                          │                         │
      │                          │                         │ 5. Auto-expire
      │                          │                         │    old ones
      │                          │                         │
      │                          │ 6. Invitation list      │
      │                          │◄────────────────────────┤
      │                          │                         │
      │ 7. See invitations UI    │                         │
      │    with status badges    │                         │
      │◄─────────────────────────┤                         │
      │                          │                         │
      │    - Pending (yellow)    │                         │
      │    - Accepted (green)    │                         │
      │    - Expired (red)       │                         │
      │    - Revoked (gray)      │                         │
      │                          │                         │
```

### Flow 5: Revoke Invitation

```
┌──────────────────────────────────────────────────────────────────┐
│                     REVOKE INVITATION                             │
└──────────────────────────────────────────────────────────────────┘

  ┌───────┐                 ┌─────────┐               ┌──────────┐
  │ Admin │                 │ Client  │               │  Server  │
  └───┬───┘                 └────┬────┘               └────┬─────┘
      │                          │                         │
      │ 1. View invitations      │                         │
      ├─────────────────────────►│                         │
      │                          │                         │
      │ 2. Click revoke button   │                         │
      │    (X icon) on pending   │                         │
      │    invitation            │                         │
      ├─────────────────────────►│                         │
      │                          │                         │
      │                          │ 3. DELETE /workspace/   │
      │                          │    :id/invitations/:id  │
      │                          ├────────────────────────►│
      │                          │                         │
      │                          │                         │ 4. Verify admin
      │                          │                         │
      │                          │                         │ 5. Check status
      │                          │                         │    is pending
      │                          │                         │
      │                          │                         │ 6. Update to
      │                          │                         │    'revoked'
      │                          │                         │
      │                          │ 7. Success              │
      │                          │◄────────────────────────┤
      │                          │                         │
      │ 8. Show success toast    │                         │
      │◄─────────────────────────┤                         │
      │                          │                         │
      │ 9. Refresh invitation    │                         │
      │    list (status updated) │                         │
      │◄─────────────────────────┤                         │
      │                          │                         │
```

## Edge Case Flows

### Flow 6: Expired Token

```
┌──────────────────────────────────────────────────────────────────┐
│                    EXPIRED TOKEN FLOW                             │
└──────────────────────────────────────────────────────────────────┘

  ┌─────────┐                ┌─────────┐               ┌──────────┐
  │ Invitee │                │ Client  │               │  Server  │
  └────┬────┘                └────┬────┘               └────┬─────┘
       │                          │                         │
       │ 1. Click old link        │                         │
       │    (8+ days old)         │                         │
       ├─────────────────────────►│                         │
       │                          │                         │
       │                          │ 2. GET /invite/:token   │
       │                          ├────────────────────────►│
       │                          │                         │
       │                          │                         │ 3. Find invitation
       │                          │                         │
       │                          │                         │ 4. Check expiry:
       │                          │                         │    NOW > expiresAt
       │                          │                         │
       │                          │                         │ 5. Update status
       │                          │                         │    to 'expired'
       │                          │                         │
       │                          │ 6. 400 Bad Request      │
       │                          │    "Invitation expired" │
       │                          │◄────────────────────────┤
       │                          │                         │
       │ 7. Show error message    │                         │
       │    with helpful text     │                         │
       │◄─────────────────────────┤                         │
       │                          │                         │
       │    "This invitation has expired.                   │
       │     Please contact the workspace owner             │
       │     for a new invitation."                         │
       │                          │                         │
```

### Flow 7: Email Mismatch

```
┌──────────────────────────────────────────────────────────────────┐
│                   EMAIL MISMATCH FLOW                             │
└──────────────────────────────────────────────────────────────────┘

  ┌─────────┐                ┌─────────┐               ┌──────────┐
  │ User A  │                │ Client  │               │  Server  │
  └────┬────┘                └────┬────┘               └────┬─────┘
       │                          │                         │
       │ Invitation sent to:      │                         │
       │ userB@example.com        │                         │
       │                          │                         │
       │ User A logged in as:     │                         │
       │ userA@example.com        │                         │
       │                          │                         │
       │ 1. Click invitation link │                         │
       ├─────────────────────────►│                         │
       │                          │                         │
       │                          │ 2. GET /invite/:token   │
       │                          ├────────────────────────►│
       │                          │                         │
       │                          │ 3. Details (shows       │
       │                          │    userB@example.com)   │
       │                          │◄────────────────────────┤
       │                          │                         │
       │ 4. See invitation for    │                         │
       │    different email       │                         │
       │◄─────────────────────────┤                         │
       │                          │                         │
       │ 5. Click "Accept"        │                         │
       ├─────────────────────────►│                         │
       │                          │                         │
       │                          │ 6. POST /invite/:token/ │
       │                          │    accept               │
       │                          │    (Bearer for User A)  │
       │                          ├────────────────────────►│
       │                          │                         │
       │                          │                         │ 7. Check:
       │                          │                         │    invitation.email
       │                          │                         │    != user.email
       │                          │                         │
       │                          │ 8. 403 Forbidden        │
       │                          │    "Email mismatch"     │
       │                          │◄────────────────────────┤
       │                          │                         │
       │ 9. Show error            │                         │
       │◄─────────────────────────┤                         │
       │                          │                         │
       │    "This invitation was sent to                    │
       │     userB@example.com. Please log in               │
       │     with that account."                            │
       │                          │                         │
```

### Flow 8: Duplicate Invitation Prevention

```
┌──────────────────────────────────────────────────────────────────┐
│            DUPLICATE INVITATION PREVENTION                        │
└──────────────────────────────────────────────────────────────────┘

  ┌───────┐                 ┌─────────┐               ┌──────────┐
  │ Admin │                 │ Client  │               │  Server  │
  └───┬───┘                 └────┬────┘               └────┬─────┘
      │                          │                         │
      │ 1. Try to invite email   │                         │
      │    that already has      │                         │
      │    pending invitation    │                         │
      ├─────────────────────────►│                         │
      │                          │                         │
      │                          │ 2. POST /workspace/:id/ │
      │                          │    members              │
      │                          ├────────────────────────►│
      │                          │                         │
      │                          │                         │ 3. Check for
      │                          │                         │    existing:
      │                          │                         │    - workspace_id
      │                          │                         │    - email
      │                          │                         │    - status=pending
      │                          │                         │
      │                          │                         │ 4. Found existing!
      │                          │                         │
      │                          │ 5. 400 Bad Request      │
      │                          │    "Already invited"    │
      │                          │◄────────────────────────┤
      │                          │                         │
      │ 6. Show error toast      │                         │
      │◄─────────────────────────┤                         │
      │                          │                         │
      │    "An invitation has already been                 │
      │     sent to this email. You can revoke             │
      │     the existing invitation and send               │
      │     a new one."                                    │
      │                          │                         │
```

### Flow 9: Already a Member

```
┌──────────────────────────────────────────────────────────────────┐
│                  ALREADY A MEMBER FLOW                            │
└──────────────────────────────────────────────────────────────────┘

  ┌─────────┐                ┌─────────┐               ┌──────────┐
  │ Invitee │                │ Client  │               │  Server  │
  └────┬────┘                └────┬────┘               └────┬─────┘
       │                          │                         │
       │ User is already member   │                         │
       │ of workspace but clicks  │                         │
       │ old invitation link      │                         │
       │                          │                         │
       │ 1. Click link            │                         │
       ├─────────────────────────►│                         │
       │                          │                         │
       │                          │ 2. POST /invite/:token/ │
       │                          │    accept               │
       │                          ├────────────────────────►│
       │                          │                         │
       │                          │                         │ 3. Verify email
       │                          │                         │
       │                          │                         │ 4. Check existing
       │                          │                         │    membership
       │                          │                         │
       │                          │                         │ 5. Already member!
       │                          │                         │
       │                          │                         │ 6. Mark invitation
       │                          │                         │    as accepted
       │                          │                         │
       │                          │ 7. 200 OK               │
       │                          │    "Already a member"   │
       │                          │◄────────────────────────┤
       │                          │                         │
      │ 8. Show info message     │                         │
       │◄─────────────────────────┤                         │
       │                          │                         │
       │    "You are already a member of                    │
       │     this workspace."                               │
       │                          │                         │
       │ 9. Redirect to workspace │                         │
       │◄─────────────────────────┤                         │
       │                          │                         │
```

## Decision Trees

### Email Service Decision Tree

```
                    Send Invitation
                          │
                          ▼
                   RESEND_API_KEY
                     configured?
                     ┌────┴────┐
                     │         │
                    YES       NO
                     │         │
                     ▼         ▼
           Try send via    Log to
              Resend       console
                     │         │
                     ▼         │
              Success?         │
              ┌──┴──┐          │
              │     │          │
             YES   NO          │
              │     │          │
              │     └──────────┤
              │                │
              ▼                ▼
         Log success     Fallback to
         Return OK       console log
                              │
                              ▼
                         Return OK
```

### Invitation Acceptance Decision Tree

```
                   User Clicks Link
                          │
                          ▼
                   Token exists?
                   ┌──────┴──────┐
                   │             │
                  YES           NO
                   │             │
                   │             ▼
                   │        404 Error
                   │
                   ▼
              Status check
           ┌───────┼────────┐
           │       │        │
       Accepted  Revoked  Expired
           │       │        │
           ▼       ▼        ▼
       400 Error 400 Error 400 Error
        "Already" "Revoked" "Expired"

                   │
                   ▼ (Status = Pending)
              Check expiry
              ┌─────┴─────┐
              │           │
          Expired     Valid
              │           │
              ▼           │
         Mark expired     │
         400 Error        │
                          ▼
                   User logged in?
                   ┌──────┴──────┐
                   │             │
                  YES           NO
                   │             │
                   │             ▼
                   │      Redirect to
                   │      /auth?invite=
                   │      {token}
                   │
                   ▼
             Email matches?
             ┌──────┴──────┐
             │             │
            YES           NO
             │             │
             │             ▼
             │       403 Error
             │       "Email mismatch"
             │
             ▼
       Already member?
       ┌──────┴──────┐
       │             │
      YES           NO
       │             │
       │             ▼
       │        Create
       │        membership
       │             │
       └─────────────┤
                     │
                     ▼
              Mark accepted
              Update acceptedAt
                     │
                     ▼
               200 Success
               Redirect to
               workspace
```

## State Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              INVITATION STATE MACHINE                        │
└─────────────────────────────────────────────────────────────┘

                         [CREATED]
                             │
                             │ Admin sends
                             │ invitation
                             ▼
                       ┌──────────┐
                       │ PENDING  │◄──────┐
                       └────┬─────┘       │
                            │             │
              ┌─────────────┼─────────────┼────────┐
              │             │             │        │
              │ User        │ Token       │ Admin  │
              │ accepts     │ expires     │ revokes│
              │             │             │        │
              ▼             ▼             ▼        │
        ┌──────────┐  ┌──────────┐  ┌──────────┐ │
        │ ACCEPTED │  │ EXPIRED  │  │ REVOKED  │ │
        └──────────┘  └──────────┘  └──────────┘ │
        (terminal)     (terminal)    (terminal)  │
                                                  │
                                                  │
        Note: Cannot transition from             │
        terminal states. Must create new ────────┘
        invitation.
```

## Timeline Visualization

### Typical Invitation Lifecycle

```
Day 0                    Day 1                Day 7
  │                        │                    │
  ├─ CREATED               │                    │
  │  (Admin sends)         │                    │
  │                        │                    │
  ├─ EMAIL SENT            │                    │
  │  (Resend API)          │                    │
  │                        │                    │
  │                        ├─ VIEWED            │
  │                        │  (User clicks)     │
  │                        │                    │
  │                        ├─ ACCEPTED          │
  │                        │  (User joins)      │
  │                        │                    │
  │                        │                    ├─ AUTO-EXPIRE
  │                        │                    │  (if not accepted)
  ▼                        ▼                    ▼
```

### Admin Revocation Timeline

```
Day 0                Day 1                   Day 3
  │                    │                       │
  ├─ CREATED           │                       │
  │                    │                       │
  ├─ EMAIL SENT        │                       │
  │                    │                       │
  │                    ├─ VIEWED               │
  │                    │  (User clicks)        │
  │                    │                       │
  │                    │  ⏸️ User waits        │
  │                    │                       │
  │                    │                       ├─ REVOKED
  │                    │                       │  (Admin cancels)
  │                    │                       │
  │                    │                       │  ❌ Link now invalid
  ▼                    ▼                       ▼
```

## Error Flow Matrix

| Error Scenario | HTTP Code | Error Message | User Action |
|----------------|-----------|---------------|-------------|
| Token not found | 404 | "Invitation not found" | Contact admin for new invitation |
| Token expired | 400 | "This invitation has expired" | Request new invitation from admin |
| Already accepted | 400 | "This invitation has already been accepted" | Log in to access workspace |
| Revoked | 400 | "This invitation has been revoked" | Contact admin for explanation |
| Email mismatch | 403 | "This invitation was sent to a different email address" | Log in with correct email or contact admin |
| Duplicate invite | 400 | "An invitation has already been sent to this email" | Wait for email or ask admin to resend |
| Not admin | 403 | "Only admins can send invitations" | Request admin to send invitation |
| Already member | 200 | "You are already a member of this workspace" | Access workspace directly |
| Email service failure | 500 (internal) | Console logs only | Check server logs for invitation link |

## Performance Considerations

### Database Query Optimization

```sql
-- Efficient invitation lookup (uses index)
SELECT * FROM workspace_invitations
WHERE token = 'xyz123'
LIMIT 1;

-- Index: idx_workspace_invitations_token

-- Efficient pending check (uses partial index)
SELECT * FROM workspace_invitations
WHERE workspace_id = 1
  AND email = 'user@example.com'
  AND status = 'pending'
LIMIT 1;

-- Unique Index: idx_workspace_invitations_unique_pending
```

### Caching Strategy (Future)

- Cache invitation details for 5 minutes
- Cache workspace member lists for 1 minute
- Invalidate cache on invitation status change
- Use Redis for distributed caching

## References

- Feature Specification: `./SPEC.md`
- API Documentation: `./API.md`
- Security Documentation: `./SECURITY.md`
- Client-side flows: `/client/docs/features/workspace-invitations/`
