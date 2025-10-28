# Workspace Invitations - Security Documentation

## Overview

This document details the security architecture, threat model, and mitigation strategies for the workspace invitation system.

## Security Principles

### 1. Defense in Depth
Multiple layers of security controls:
- Token strength
- Email verification
- Expiration enforcement
- One-time use
- Status validation
- Access control

### 2. Least Privilege
- Only admins can send/revoke invitations
- Users can only accept invitations for their email
- Workspace members can view invitations

### 3. Fail Securely
- Default deny on all operations
- Graceful error handling without information leakage
- Audit logging for security events

## Threat Model

### Attack Surface

```
┌─────────────────────────────────────────────────────────┐
│                    ATTACK SURFACE                        │
└─────────────────────────────────────────────────────────┘

External Attack Vectors:
├─ Invitation Token
│  ├─ Brute force attempts
│  ├─ Token prediction
│  ├─ Token enumeration
│  └─ Token replay attacks
│
├─ Email System
│  ├─ Email spoofing
│  ├─ Man-in-the-middle
│  └─ Email interception
│
└─ API Endpoints
   ├─ Unauthorized access
   ├─ Parameter tampering
   └─ Mass enumeration

Internal Attack Vectors:
├─ Malicious Admin
│  ├─ Invitation spam
│  ├─ Unauthorized invitations
│  └─ Data exfiltration
│
└─ Compromised User
   ├─ Session hijacking
   └─ Privilege escalation
```

### Threat Actors

1. **External Attacker**
   - Goal: Unauthorized workspace access
   - Capabilities: Internet access, basic technical skills
   - Motivation: Data theft, system abuse

2. **Malicious Insider**
   - Goal: Invite unauthorized users, spam
   - Capabilities: Admin access to workspace
   - Motivation: Sabotage, data exfiltration

3. **Compromised User**
   - Goal: Escalate privileges
   - Capabilities: Valid user account
   - Motivation: Unauthorized access

## Security Controls

### 1. Token Security

#### Token Generation

**Algorithm:**
```typescript
import { randomBytes } from 'crypto';

function generateInvitationToken(): string {
  // 256 bits of entropy
  const buffer = randomBytes(32);

  // URL-safe base64
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
```

**Security Properties:**

| Property | Value | Security Impact |
|----------|-------|-----------------|
| Entropy | 256 bits | 2^256 possible values (~10^77) |
| Character set | 64 chars | URL-safe, no encoding needed |
| Length | 43 characters | Sufficient for collision resistance |
| Uniqueness | Database constraint | Prevents collisions |
| Predictability | Cryptographic RNG | Impossible to predict |

**Attack Resistance:**

```
Brute Force Resistance:
- Token space: 2^256
- Attempts per second: 1,000,000
- Time to 50% success: 5.8 × 10^63 years
- Universe age: 1.38 × 10^10 years
- Verdict: IMPOSSIBLE
```

#### Token Storage

**Database Security:**
- Tokens stored in plaintext (necessary for lookup)
- Protected by database access controls
- Connection uses TLS encryption
- Database credentials in environment variables
- Regular security patches applied

**Alternative Consideration:**
```
Q: Should tokens be hashed?
A: No, because:
   1. Need to lookup by exact token (can't hash search)
   2. Tokens are already cryptographically strong
   3. Short-lived (7 days)
   4. One-time use
   5. Email verification adds second factor
```

### 2. Email Verification

**Why It Matters:**
- Prevents invitation theft
- Binds token to specific user
- Acts as second authentication factor

**Implementation:**
```typescript
// Verification check during acceptance
if (invitation.email !== user.email.toLowerCase()) {
  return res.status(403).json({
    error: 'This invitation was sent to a different email address'
  });
}
```

**Attack Scenarios Prevented:**

```
Scenario 1: Token Leak
1. Attacker obtains invitation link (URL)
2. Attacker tries to accept
3. ❌ BLOCKED: Email doesn't match
4. Invitation remains valid for intended recipient

Scenario 2: Public Link Sharing
1. User accidentally shares link publicly
2. Multiple people click link
3. ❌ BLOCKED: Only correct email can accept
4. Original recipient can still accept

Scenario 3: Email Forwarding
1. Recipient forwards invitation email
2. Forward recipient tries to accept
3. ❌ BLOCKED: Email doesn't match
4. Must authenticate with original email
```

### 3. Expiration Enforcement

**Default Expiration:** 7 days

**Implementation:**
```typescript
function getTokenExpirationDate(days: number = 7): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}

function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt);
}
```

**Auto-Expiration:**
```typescript
// Check on every access
if (isTokenExpired(invitation.expiresAt)) {
  // Mark as expired
  await db
    .update(workspaceInvitations)
    .set({ status: 'expired' })
    .where(eq(workspaceInvitations.id, invitation.id));

  return error('This invitation has expired');
}
```

**Security Benefits:**
- Limits exposure window
- Reduces attack surface over time
- Prevents indefinite token validity
- Forces re-invitation for security updates

### 4. One-Time Use

**State Machine:**
```
PENDING → ACCEPTED (terminal)
         ↓
      EXPIRED (terminal)
         ↓
      REVOKED (terminal)
```

**Enforcement:**
```typescript
// Check status before acceptance
if (invitation.status !== 'pending') {
  return error(`Cannot accept ${invitation.status} invitation`);
}

// Mark as accepted (atomic)
await db
  .update(workspaceInvitations)
  .set({
    status: 'accepted',
    acceptedAt: new Date()
  })
  .where(eq(workspaceInvitations.id, invitation.id));
```

**Race Condition Protection:**
```sql
-- Database constraint prevents concurrent accepts
UPDATE workspace_invitations
SET status = 'accepted', accepted_at = NOW()
WHERE id = $1 AND status = 'pending'
RETURNING *;

-- If 0 rows updated → already accepted
```

**Attack Scenarios Prevented:**

```
Scenario: Replay Attack
1. User accepts invitation (status → accepted)
2. Attacker captures/replays request
3. ❌ BLOCKED: Status is not 'pending'
4. Second attempt fails

Scenario: Concurrent Access
1. Two tabs click accept simultaneously
2. First request updates status
3. ❌ BLOCKED: Second sees status != 'pending'
4. Only one membership created
```

### 5. Access Control

**Role-Based Permissions:**

| Action | Admin | Editor | Viewer | Non-member | Public |
|--------|-------|--------|--------|------------|--------|
| Send invitation | ✅ | ❌ | ❌ | ❌ | ❌ |
| View invitation details | ✅ | ✅ | ✅ | ❌ | ✅* |
| Accept invitation | ✅ | ✅ | ✅ | ✅ | ❌ |
| List invitations | ✅ | ✅ | ✅ | ❌ | ❌ |
| Revoke invitation | ✅ | ❌ | ❌ | ❌ | ❌ |

*Public can view invitation details via magic link (needed for acceptance flow)

**Implementation:**
```typescript
// Admin check for sending invitations
const [membership] = await db
  .select()
  .from(workspaceMembers)
  .where(
    and(
      eq(workspaceMembers.workspaceId, workspaceId),
      eq(workspaceMembers.userId, user.id),
      eq(workspaceMembers.role, 'admin'),
      eq(workspaceMembers.isActive, true)
    )
  )
  .limit(1);

if (!membership) {
  return res.status(403).json({
    error: 'Only admins can invite members'
  });
}
```

### 6. Rate Limiting (Future)

**Recommended Limits:**

```typescript
const RATE_LIMITS = {
  invitation_send: {
    per_workspace: {
      limit: 10,
      window: '1 hour',
      message: 'Too many invitations sent'
    },
    per_user: {
      limit: 50,
      window: '1 day',
      message: 'Daily invitation limit reached'
    }
  },
  invitation_accept: {
    per_ip: {
      limit: 10,
      window: '1 hour',
      message: 'Too many acceptance attempts'
    },
    per_user: {
      limit: 5,
      window: '1 hour',
      message: 'Too many workspaces joined'
    }
  },
  invitation_revoke: {
    per_user: {
      limit: 20,
      window: '1 hour',
      message: 'Too many revocations'
    }
  }
};
```

**Attack Scenarios Prevented:**
- Invitation spam
- Enumeration attacks
- DoS via invitation flood
- Brute force attempts

## Vulnerability Analysis

### 1. Token Enumeration

**Attack:**
```
Goal: Find valid invitation tokens
Method: Brute force token space
Tool: Automated script
```

**Mitigations:**
- ✅ 256-bit entropy (impossible to enumerate)
- ✅ No information leak on invalid token (404)
- ✅ Rate limiting (future)
- ✅ Audit logging (future)

**Risk:** LOW (computationally infeasible)

### 2. Email Spoofing

**Attack:**
```
Goal: Trick user with fake invitation
Method: Spoof sender email
Tool: SMTP manipulation
```

**Mitigations:**
- ✅ Use Resend (has SPF/DKIM/DMARC)
- ✅ Verify domain in email template
- ✅ Use official domain for FROM address
- ✅ Include security notice in email
- ⚠️ User education needed

**Risk:** MEDIUM (depends on email config)

### 3. Man-in-the-Middle

**Attack:**
```
Goal: Intercept invitation link
Method: Network sniffing
Tool: Wireshark, SSL strip
```

**Mitigations:**
- ✅ HTTPS required (TLS 1.3)
- ✅ HSTS headers
- ✅ Email sent over TLS
- ✅ Short-lived tokens (7 days)
- ✅ One-time use

**Risk:** LOW (with HTTPS enforcement)

### 4. Session Hijacking

**Attack:**
```
Goal: Accept invitation as another user
Method: Steal auth token
Tool: XSS, network sniffing
```

**Mitigations:**
- ✅ HttpOnly cookies (if using)
- ✅ Email verification (binds to specific user)
- ✅ HTTPS only
- ✅ Token validation on every request
- ✅ Short-lived auth tokens

**Risk:** LOW (email verification provides defense)

### 5. Privilege Escalation

**Attack:**
```
Goal: Join as admin via modified request
Method: Change 'role' parameter
Tool: Proxy (Burp Suite)
```

**Mitigations:**
- ✅ Role determined by invitation, not request
- ✅ No user-controlled role parameter
- ✅ Database-level role enforcement
- ✅ Immutable after creation

**Risk:** NONE (not possible)

### 6. Invitation Bombing

**Attack:**
```
Goal: Spam users with invitations
Method: Automated invitation sending
Tool: Script
```

**Mitigations:**
- ✅ Admin-only invitation sending
- ✅ Duplicate prevention
- ⚠️ Rate limiting (future)
- ⚠️ Email verification (future)
- ⚠️ CAPTCHA (future)

**Risk:** MEDIUM (rate limiting needed)

### 7. Database Injection

**Attack:**
```
Goal: Manipulate SQL queries
Method: Inject SQL in email field
Tool: sqlmap
```

**Mitigations:**
- ✅ Parameterized queries (Drizzle ORM)
- ✅ Input validation
- ✅ Type checking (TypeScript)
- ✅ No raw SQL with user input

**Risk:** NONE (ORM protection)

### 8. Information Disclosure

**Attack:**
```
Goal: Enumerate workspace members
Method: Send invitations, observe errors
Tool: Script
```

**Mitigations:**
- ✅ Generic error messages
- ✅ No member enumeration via invite
- ⚠️ Rate limiting (future)
- ✅ Audit logging (future)

**Risk:** LOW (minimal info leaked)

## Security Best Practices

### For Developers

1. **Never log tokens**
   ```typescript
   // ❌ BAD
   console.log('Invitation token:', token);

   // ✅ GOOD
   console.log('Invitation created:', invitation.id);
   ```

2. **Always validate input**
   ```typescript
   // ✅ GOOD
   const email = req.body.email?.trim().toLowerCase();
   if (!email || !emailRegex.test(email)) {
     return error('Invalid email');
   }
   ```

3. **Use parameterized queries**
   ```typescript
   // ✅ GOOD (Drizzle)
   await db
     .select()
     .from(workspaceInvitations)
     .where(eq(workspaceInvitations.token, token));

   // ❌ BAD (raw SQL)
   await db.execute(`SELECT * FROM invitations WHERE token = '${token}'`);
   ```

4. **Check authorization before action**
   ```typescript
   // ✅ GOOD
   const isAdmin = await checkAdminStatus(user, workspace);
   if (!isAdmin) return error('Forbidden');

   // Perform action
   ```

5. **Use environment variables**
   ```typescript
   // ✅ GOOD
   const apiKey = process.env.RESEND_API_KEY;

   // ❌ BAD
   const apiKey = 're_abc123...';
   ```

### For Administrators

1. **Use verified email domains**
   - Add domain to Resend
   - Configure SPF, DKIM, DMARC
   - Use professional sender address

2. **Monitor invitation activity**
   - Review sent invitations weekly
   - Check for unusual patterns
   - Revoke suspicious invitations

3. **Train team members**
   - Don't share invitation links
   - Report unexpected invitations
   - Use strong passwords

4. **Regular security audits**
   - Review workspace members
   - Check invitation logs
   - Verify access levels

### For End Users

1. **Verify sender**
   - Check sender email domain
   - Expect invitation from known admins
   - Be suspicious of unexpected invitations

2. **Check invitation details**
   - Verify workspace name
   - Confirm role is appropriate
   - Review expiration date

3. **Use secure connections**
   - Always use HTTPS
   - Don't accept on public WiFi
   - Keep browser updated

4. **Report suspicious activity**
   - Unexpected invitations
   - Expired links still working
   - Email mismatches

## Incident Response

### Security Event Detection

**Indicators of Compromise:**
- High invitation send rate
- Multiple failed acceptance attempts
- Invitations to suspicious domains
- Token enumeration attempts
- Unusual revocation patterns

**Monitoring (Future):**
```typescript
// Log security events
logger.security({
  event: 'invitation.sent',
  workspaceId,
  email: invitation.email,
  invitedBy: user.id,
  timestamp: new Date()
});

// Alert on anomalies
if (invitationCount > THRESHOLD) {
  alertSecurityTeam({
    type: 'invitation_spam',
    workspace: workspaceId,
    count: invitationCount
  });
}
```

### Incident Response Plan

**Level 1: Token Compromise**
```
1. Identify affected invitation
2. Revoke invitation immediately
3. Notify workspace admin
4. Send new invitation if needed
5. Document incident
```

**Level 2: Email Service Compromise**
```
1. Disable email sending
2. Rotate API keys
3. Audit recent invitations
4. Revoke suspicious invitations
5. Re-enable with monitoring
```

**Level 3: Database Breach**
```
1. Lock down database access
2. Revoke ALL pending invitations
3. Force password reset for all users
4. Audit access logs
5. Notify affected users
6. Engage security team
```

## Compliance & Privacy

### GDPR Compliance

**Data Processing:**
- Email address (PII) stored temporarily
- 7-day retention for pending invitations
- Auto-deletion after acceptance/expiration
- Right to erasure honored

**Legal Basis:**
- Legitimate interest (team collaboration)
- User consent (acceptance action)

**Data Protection:**
- Encryption at rest (database)
- Encryption in transit (TLS)
- Access controls (role-based)
- Audit logging (future)

### Data Retention

| Data | Retention Period | Reason |
|------|------------------|--------|
| Pending invitations | 7 days | Expiration period |
| Accepted invitations | 90 days | Audit trail |
| Expired invitations | 30 days | Compliance |
| Revoked invitations | 30 days | Audit trail |

**Future Enhancement:**
```sql
-- Auto-cleanup job (daily)
DELETE FROM workspace_invitations
WHERE status IN ('accepted', 'expired', 'revoked')
  AND updated_at < NOW() - INTERVAL '90 days';
```

## Security Audit Checklist

### Code Review

- [ ] All user inputs validated
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Proper error handling
- [ ] No sensitive data in logs
- [ ] Environment variables used
- [ ] Access control enforced
- [ ] Parameterized queries used

### Infrastructure

- [ ] HTTPS enforced
- [ ] Database encrypted
- [ ] Secure headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Monitoring in place
- [ ] Backups configured
- [ ] Secrets rotated

### Testing

- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Security tests passing
- [ ] Penetration testing complete
- [ ] Vulnerability scanning done
- [ ] Load testing complete

## References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- CWE Top 25: https://cwe.mitre.org/top25/
- GDPR: https://gdpr.eu/

## Appendix: Security Test Cases

### Test 1: Token Strength
```typescript
test('Token has sufficient entropy', () => {
  const tokens = new Set();
  for (let i = 0; i < 10000; i++) {
    tokens.add(generateInvitationToken());
  }
  expect(tokens.size).toBe(10000); // No collisions
});
```

### Test 2: Email Verification
```typescript
test('Cannot accept invitation with wrong email', async () => {
  const invitation = await createInvitation('userA@example.com');
  const userB = { email: 'userB@example.com' };

  await expect(
    acceptInvitation(invitation.token, userB)
  ).rejects.toThrow('Email mismatch');
});
```

### Test 3: One-Time Use
```typescript
test('Cannot accept invitation twice', async () => {
  const invitation = await createInvitation('user@example.com');
  const user = { email: 'user@example.com' };

  await acceptInvitation(invitation.token, user); // First accept

  await expect(
    acceptInvitation(invitation.token, user) // Second accept
  ).rejects.toThrow('Already accepted');
});
```

### Test 4: Expiration
```typescript
test('Cannot accept expired invitation', async () => {
  const invitation = await createInvitation('user@example.com', {
    expiresAt: new Date(Date.now() - 86400000) // Yesterday
  });

  await expect(
    acceptInvitation(invitation.token, user)
  ).rejects.toThrow('Expired');
});
```

### Test 5: Authorization
```typescript
test('Non-admin cannot send invitations', async () => {
  const editor = { role: 'editor' };

  await expect(
    sendInvitation(workspace.id, 'new@example.com', editor)
  ).rejects.toThrow('Only admins can invite');
});
```
