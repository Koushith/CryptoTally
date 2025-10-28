# Passkey Deployment Checklist

Quick reference for deploying passkey authentication to production.

## Pre-Deployment Checklist

- [ ] Database tables created (`passkeys`, `passkeys_challenges`)
- [ ] Environment variables configured
- [ ] HTTPS enabled on frontend domain
- [ ] Firebase Admin SDK configured

## Railway Deployment Steps

### 1. Configure Environment Variables

In Railway dashboard, add these variables:

```bash
# Required for Passkeys
RP_ID=app.cryptotally.xyz
FRONTEND_URL=https://app.cryptotally.xyz

# General Configuration
NODE_ENV=production
PROD_DATABASE_URL=postgresql://postgres:password@host:port/database
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account
FIREBASE_PROJECT_ID=your-project-id
```

### 2. Run Database Migrations

**Option A: Run locally (recommended)**
```bash
# From server directory
NODE_ENV=production npm run migrate
```

**Option B: Via Railway CLI**
```bash
railway run npm run migrate
```

### 3. Deploy Server

```bash
git push origin main
# Railway will auto-deploy
```

### 4. Verify Deployment

Check server logs for WebAuthn configuration:
```
🔐 WebAuthn Configuration: {
  rpName: 'CryptoTally',
  rpID: 'app.cryptotally.xyz',
  origin: 'https://app.cryptotally.xyz',
  environment: 'production'
}
```

### 5. Test Passkey Flow

1. Visit `https://app.cryptotally.xyz`
2. Sign in with Google/Email
3. Go to Settings → Security
4. Click "Add Passkey"
5. Enter device name (e.g., "MacBook Pro")
6. Complete biometric verification
7. Verify passkey appears in list

### 6. Test Sign In with Passkey

1. Sign out
2. Return to login page
3. Click "Sign in with Passkey" button
4. Complete biometric verification
5. Should be signed in successfully

## Common Production Issues

### Issue: "Passkey not found"

**Cause:** Database tables don't exist
**Fix:** Run migrations (see step 2)

### Issue: "Origin mismatch"

**Cause:** `FRONTEND_URL` doesn't match actual frontend URL
**Fix:** Check environment variable and update to match exactly

### Issue: "No pending registration/authentication"

**Cause:** Challenge expired or not found
**Fix:**
1. Check database connection
2. Verify `passkeys_challenges` table exists
3. Try registration again (challenges expire after 5 minutes)

### Issue: Passkey button doesn't appear

**Cause:** Browser doesn't support passkeys or no HTTPS
**Fix:**
1. Verify HTTPS is enabled
2. Use supported browser (Chrome 109+, Safari 16+, Edge 109+)
3. Test on device with biometric support

## Environment Variable Reference

| Variable | Example | Description |
|----------|---------|-------------|
| `RP_ID` | `app.cryptotally.xyz` | Domain for passkey binding (no protocol) |
| `FRONTEND_URL` | `https://app.cryptotally.xyz` | Full frontend URL with protocol |
| `NODE_ENV` | `production` | Environment mode |
| `PROD_DATABASE_URL` | `postgresql://...` | Production database connection string |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | `base64_string` | Firebase Admin SDK credentials |
| `FIREBASE_PROJECT_ID` | `cryptotally-5bdd8` | Firebase project ID |

## Domain Configuration Examples

### Subdomain App (Recommended for separate landing/app)
```bash
RP_ID=app.cryptotally.xyz
FRONTEND_URL=https://app.cryptotally.xyz
```
✅ Passkeys work on: `app.cryptotally.xyz`
❌ Passkeys don't work on: `cryptotally.xyz`, `www.cryptotally.xyz`

### Root Domain
```bash
RP_ID=cryptotally.xyz
FRONTEND_URL=https://cryptotally.xyz
```
✅ Passkeys work on: All subdomains (`app.`, `www.`, etc.)

### Development (Local)
```bash
RP_ID=localhost
FRONTEND_URL=http://localhost:5173
```
✅ No HTTPS required for localhost

## Client Configuration

Ensure client has correct API URL:

**File:** `client/src/services/passkey.service.ts`
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

**Vercel/Netlify Environment Variables:**
```bash
VITE_API_URL=https://api.cryptotally.xyz
```

## Security Notes

1. **HTTPS Required** - WebAuthn only works over HTTPS (except localhost)
2. **Domain Binding** - Passkeys are locked to the exact `RP_ID` domain
3. **No Private Keys** - Private keys never leave the user's device
4. **Phishing Protection** - Fake sites cannot use your passkeys
5. **Challenge Expiry** - Challenges expire after 5 minutes

## Monitoring

Check these metrics:
- Passkey registration success rate
- Authentication success rate
- Challenge expiration rate
- Browser support detection rate

Log important events:
```typescript
// Registration
analytics.logEvent('passkey_registration_success');
analytics.logEvent('passkey_registration_failed', { error });

// Authentication
analytics.logEvent('passkey_signin_success');
analytics.logEvent('passkey_signin_failed', { error });
```

## Rollback Plan

If passkeys cause issues:

1. **Disable passkey UI** (users can still use Google/Email)
   ```typescript
   // In Auth.tsx
   const passkeyEnabled = false; // Quick kill switch
   ```

2. **Fix and redeploy**
3. **Passkeys in database remain intact** - users can resume using them after fix

## Related Documentation

- [README.md](./README.md) - Complete passkey guide
- [API.md](./API.md) - API endpoint documentation
- [Client README](../../../../client/docs/features/auth/passkey/README.md) - Frontend guide

## Support

If issues persist:
1. Check server logs for detailed errors
2. Review WebAuthn configuration output
3. Verify database tables exist
4. Test in multiple browsers
5. Check HTTPS certificate validity
