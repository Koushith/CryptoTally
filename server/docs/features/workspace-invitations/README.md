# Workspace Invitations Feature

> Magic link invitations for workspace collaboration - Send secure invitations to users who may not have accounts yet

## 📚 Documentation Index

This feature is comprehensively documented across multiple files:

### Core Documentation

| Document | Description |
|----------|-------------|
| [SPEC.md](./SPEC.md) | Complete feature specification, architecture, and requirements |
| [USER_FLOW.md](./USER_FLOW.md) | User journeys, flowcharts, decision trees, and sequence diagrams |
| [API.md](./API.md) | Detailed API endpoint documentation with examples |
| [SECURITY.md](./SECURITY.md) | Security architecture, threat model, and vulnerability analysis |

### Frontend Documentation

Located at: `/client/docs/features/workspace-invitations/`

- **SPEC.md**: Client-side architecture and component specifications
- Complete UI/UX documentation
- React component details
- State management patterns

## 🎯 Quick Start

### For Users

**Sending an Invitation:**
1. Navigate to Workspace page
2. Click "Invite Member"
3. Enter email and select role
4. Click "Send Invitation"
5. User receives email with magic link

**Accepting an Invitation:**
1. Click link in email
2. View invitation details
3. Sign in or create account
4. Click "Accept Invitation"
5. Automatically join workspace

### For Developers

**Setting up Email (Optional):**

```bash
# In /server/.env.local
RESEND_API_KEY=re_your_key_here
FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:3000
```

**Without Email Setup:**
- Invitations still work!
- Links are logged to console
- Perfect for development

**Running the servers:**

```bash
# Server
cd server
npm run dev

# Client
cd client
npm run dev
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTEM OVERVIEW                           │
└─────────────────────────────────────────────────────────────┘

  Admin                    Invitee
    │                        │
    │  1. Send invitation    │
    ├───────────────────────►│
    │                        │
    │                        │  2. Click email link
    │                        ├─────────────────►
    │                        │
    │                        │  3. View details
    │                        ├─────────────────►
    │                        │
    │                        │  4. Accept invitation
    │                        ├─────────────────►
    │                        │
    │  5. See new member     │  6. Join workspace
    │◄───────────────────────┤◄─────────────────
```

### Key Components

**Backend:**
- `WorkspaceController` - API endpoints
- `EmailService` - Email sending via Resend
- `TokenUtil` - Secure token generation
- `workspace_invitations` table - Database

**Frontend:**
- `WorkspacePage` - Main workspace management
- `AcceptInvitePage` - Invitation acceptance
- `WorkspaceService` - API client

## 🔐 Security Features

### 1. **Cryptographically Secure Tokens**
- 256 bits of entropy (2^256 possible values)
- URL-safe encoding
- Impossible to guess or brute force

### 2. **Email Verification**
- Invitation only works for intended email
- Prevents invitation theft
- Acts as second authentication factor

### 3. **One-Time Use**
- Status tracking prevents replay attacks
- Cannot reuse accepted invitations
- Atomic database operations

### 4. **Expiration**
- 7-day default expiration
- Auto-expire on access
- Limits exposure window

### 5. **Access Control**
- Only admins can send/revoke invitations
- Role-based permissions
- Workspace membership validation

## 📊 Database Schema

```sql
CREATE TABLE workspace_invitations (
  id                SERIAL PRIMARY KEY,
  workspace_id      INTEGER NOT NULL REFERENCES workspaces(id),
  email             TEXT NOT NULL,
  role              VARCHAR(20) NOT NULL DEFAULT 'viewer',
  token             TEXT NOT NULL UNIQUE,
  status            VARCHAR(20) NOT NULL DEFAULT 'pending',
  expires_at        TIMESTAMP NOT NULL,
  invited_by        INTEGER NOT NULL REFERENCES users(id),
  accepted_at       TIMESTAMP,
  created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Critical indexes
CREATE INDEX idx_workspace_invitations_token ON workspace_invitations(token);
CREATE UNIQUE INDEX idx_workspace_invitations_unique_pending
  ON workspace_invitations(workspace_id, email, status)
  WHERE status = 'pending';
```

## 🔄 State Machine

```
         ┌──────────┐
         │ PENDING  │  ← Initial state
         └────┬─────┘
              │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
┌─────────┬─────────┬─────────┐
│ACCEPTED │EXPIRED  │ REVOKED │  ← Terminal states
└─────────┴─────────┴─────────┘
```

**Transitions:**
- `PENDING → ACCEPTED`: User accepts
- `PENDING → EXPIRED`: 7 days pass
- `PENDING → REVOKED`: Admin cancels
- Terminal states cannot transition

## 🚦 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/workspace/:id/members` | ✅ Admin | Send invitation |
| GET | `/api/workspace/invite/:token` | 🌐 Public | Get invitation details |
| POST | `/api/workspace/invite/:token/accept` | ✅ User | Accept invitation |
| GET | `/api/workspace/:id/invitations` | ✅ Member | List invitations |
| DELETE | `/api/workspace/:id/invitations/:invId` | ✅ Admin | Revoke invitation |

**Legend:** ✅ = Requires Auth, 🌐 = Public

## 📧 Email Configuration

### Using Resend (Recommended)

1. **Create Resend account**: https://resend.com
2. **Get API key**: Dashboard → API Keys
3. **Add domain** (optional but recommended):
   - Dashboard → Domains → Add Domain
   - Verify DNS records (SPF, DKIM, DMARC)
4. **Configure environment**:
   ```bash
   RESEND_API_KEY=re_your_key_here
   FROM_EMAIL=noreply@yourdomain.com
   ```

### Development Mode (No Email Service)

If `RESEND_API_KEY` is not configured:
- System automatically falls back to console logging
- Invitation links printed to server console
- Full functionality preserved
- Perfect for local development

**Example console output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 WORKSPACE INVITATION EMAIL (Console Mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: newuser@example.com
Subject: John Doe invited you to join My Organization

Click the link below to accept:
http://localhost:3000/invite/abc123def456...

This invitation will expire in 7 days.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎨 UI Components

### 1. Invite Member Dialog

Beautiful modal for sending invitations:
- Email input with validation
- Role selector with descriptions
- Icon indicators for each role
- Clear permission explanations

### 2. Invitations List

Comprehensive invitation tracking:
- Color-coded status badges
- Detailed invitation info
- Quick actions (revoke)
- Auto-refresh

### 3. Accept Invitation Page

Professional invitation acceptance:
- Branded header with gradient
- Clear workspace information
- Role permissions breakdown
- Smart auth handling

## 🔍 Edge Cases Handled

### ✅ Covered Scenarios

| Scenario | Behavior |
|----------|----------|
| Expired token | Auto-mark expired, show friendly error |
| Email mismatch | Verify email, block with clear message |
| Already accepted | Prevent duplicate, show info message |
| Already a member | Skip duplicate membership, mark accepted |
| Duplicate invitation | Block with helpful error |
| Revoked invitation | Block access, explain status |
| Invalid token | Return 404, no information leak |
| Email service failure | Fall back to console, continue |
| Concurrent accepts | Atomic operations prevent duplicates |
| Token enumeration | 256-bit entropy makes it impossible |

## 📈 Metrics & Monitoring (Future)

### Key Metrics

1. **Invitation Funnel**
   - Sent → Viewed → Accepted
   - Conversion rate
   - Time to acceptance

2. **Status Distribution**
   - Pending count
   - Acceptance rate
   - Expiration rate
   - Revocation rate

3. **Email Delivery**
   - Send success rate
   - Bounce rate
   - Click-through rate

## 🧪 Testing

### Manual Testing Checklist

**Happy Path:**
- [ ] Admin sends invitation
- [ ] Email received (or console logged)
- [ ] User clicks link
- [ ] Invitation details displayed
- [ ] User signs in/up
- [ ] Invitation accepted
- [ ] User appears in workspace

**Error Scenarios:**
- [ ] Expired token shows error
- [ ] Wrong email shows error
- [ ] Duplicate invitation blocked
- [ ] Non-admin cannot send
- [ ] Revoked invitation blocked

### Automated Tests (Future)

```typescript
describe('Workspace Invitations', () => {
  it('should send invitation with valid token');
  it('should prevent duplicate invitations');
  it('should verify email on acceptance');
  it('should expire old invitations');
  it('should enforce one-time use');
  it('should require admin for sending');
  it('should allow revocation by admin');
});
```

## 🐛 Troubleshooting

### Issue: Email not received

**Solutions:**
1. Check spam/junk folder
2. Verify `RESEND_API_KEY` is set
3. Check `FROM_EMAIL` is valid
4. View server console for logged link
5. Verify domain in Resend dashboard
6. Check email service status

### Issue: "Invitation expired" error

**Solutions:**
1. Request new invitation from admin
2. Admin can revoke old and send new
3. Check system time is synchronized

### Issue: "Email mismatch" error

**Solutions:**
1. Sign in with correct email address
2. Contact admin to resend to current email
3. Check invitation was sent to correct address

### Issue: Cannot send invitations

**Solutions:**
1. Verify you are admin of workspace
2. Check network connection
3. Verify workspace exists
4. Check for duplicate pending invitation

## 🚀 Future Enhancements

### Phase 2
- [ ] Bulk invitations (CSV upload)
- [ ] Custom expiration periods
- [ ] Resend invitation functionality
- [ ] Invitation templates
- [ ] Multi-language support

### Phase 3
- [ ] Team invitation links
- [ ] Invitation analytics dashboard
- [ ] Webhooks for invitation events
- [ ] Rate limiting
- [ ] Advanced audit logging

## 📞 Support

### For Users
- Questions about invitations → Contact workspace admin
- Technical issues → Check troubleshooting section
- Security concerns → Review SECURITY.md

### For Developers
- API questions → See API.md
- Implementation help → See SPEC.md
- Security questions → See SECURITY.md
- Bug reports → Create GitHub issue

## 🔗 Related Features

- **Workspace Management** - `/docs/features/workspaces/`
- **Team Members** - `/docs/features/team-members/`
- **Authentication** - `/docs/architecture/AUTH.md`
- **Email Service** - `/docs/services/email/`

## 📝 Changelog

### v1.0.0 (2025-01-28)
- ✨ Initial release
- 🔐 Magic link invitations
- 📧 Email integration via Resend
- 🎨 Beautiful UI components
- 📊 Invitation tracking
- 🛡️ Comprehensive security

---

**Last Updated:** 2025-01-28
**Maintained By:** CryptoTally Team
**Status:** ✅ Production Ready
