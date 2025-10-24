# Firebase Security Guide

## 🔐 Protecting Your Service Account Key

Your Firebase service account key (`serviceAccountKey.json`) contains **highly sensitive credentials** that give **full admin access** to your Firebase project. Treat it like a password.

## ❌ NEVER DO THIS

1. **Never commit service account keys to Git**
   ```bash
   # BAD - DO NOT DO THIS
   git add serviceAccountKey.json
   git commit -m "Add Firebase config"
   ```

2. **Never expose keys in client-side code**
   - Service account keys are **only for server-side code**
   - Client-side code uses Firebase Client SDK with different credentials

3. **Never share keys in plain text**
   - Don't send via email, Slack, Discord, etc.
   - Don't paste in public forums or GitHub issues

4. **Never hardcode keys in code**
   ```typescript
   // BAD - DO NOT DO THIS
   const serviceAccount = {
     projectId: "my-project",
     privateKey: "-----BEGIN PRIVATE KEY-----\n...",
   };
   ```

## ✅ PROPER SECURITY MEASURES

### 1. Local Development (Current Setup)

**We use a file-based approach:**
```
server/
├── serviceAccountKey.json  ← Service account key (gitignored)
├── .env                    ← Contains path to key (gitignored)
└── src/config/firebase.ts  ← Reads key from file
```

**Security checklist:**
- ✅ `serviceAccountKey.json` is in `.gitignore`
- ✅ `.env` is in `.gitignore`
- ✅ Only `.env.example` is committed (no secrets)

### 2. Production Deployment

**Option A: Environment Variables (Recommended for Vercel, Render, Railway)**

Instead of uploading the JSON file, use environment variables:

```bash
# In your hosting platform's dashboard, set these:
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=cryptotally-5bdd8
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@cryptotally-5bdd8.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=...
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=...
```

Then update `src/config/firebase.ts`:
```typescript
// For production with env variables
if (process.env.FIREBASE_PRIVATE_KEY) {
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };

  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}
```

**Option B: Secret Managers (Recommended for AWS, GCP, Azure)**

Use cloud provider secret managers:
- AWS: AWS Secrets Manager
- GCP: Google Secret Manager
- Azure: Azure Key Vault

**Option C: Google Application Default Credentials (GCP Only)**

If deploying to Google Cloud (App Engine, Cloud Run, Cloud Functions):
```typescript
// Automatically uses GCP's default credentials
firebaseAdmin = admin.initializeApp();
```

### 3. Team Collaboration

**How to share keys with team members securely:**

1. **Use a password manager** (recommended)
   - 1Password, Bitwarden, LastPass
   - Share via secure vault

2. **Use secret management tools**
   - Doppler, Infisical, Vault by HashiCorp

3. **Download directly from Firebase Console**
   - Each developer downloads their own copy
   - Never share via email/Slack

**Instructions for team:**
```bash
# 1. Clone the repo
git clone <repo-url>
cd server

# 2. Copy .env.example to .env
cp .env.example .env

# 3. Download service account key from Firebase Console
# Go to: Firebase Console > Project Settings > Service Accounts
# Click "Generate new private key"
# Save as: serviceAccountKey.json

# 4. Update .env if needed
# FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
# FIREBASE_PROJECT_ID=cryptotally-5bdd8

# 5. Install dependencies and run
npm install
npm run dev
```

### 4. Key Rotation

If a service account key is compromised:

1. **Delete the compromised key immediately**
   - Firebase Console > Project Settings > Service Accounts
   - Find the key by `private_key_id`
   - Click "Delete"

2. **Generate a new key**
   - Click "Generate new private key"
   - Download and replace `serviceAccountKey.json`

3. **Update production secrets**
   - Update environment variables on hosting platform
   - Restart all services

4. **Audit access logs**
   - Check Firebase Console for suspicious activity
   - Review authentication logs

## 📋 Security Checklist

Before deploying to production:

- [ ] Service account key is NOT in git history
- [ ] `.gitignore` includes `serviceAccountKey.json` and `*.json` patterns
- [ ] Production uses environment variables or secret manager
- [ ] Service account has minimal required permissions (not Owner role)
- [ ] Key rotation schedule is documented
- [ ] Team knows how to securely access keys
- [ ] Monitoring/alerts are set up for suspicious activity

## 🔍 Verify Your Setup

```bash
# Check that sensitive files are gitignored
git status

# Should NOT see:
# - serviceAccountKey.json
# - .env

# If you see them, they're not properly ignored!
```

```bash
# Check git history for leaked keys
git log --all --full-history -- "*.json"
git log --all --full-history -- ".env"

# If you find leaked keys, follow the "If You Leaked a Key" section
```

## 🚨 If You Accidentally Leaked a Key

**If you committed a service account key to git:**

1. **Delete the key immediately from Firebase Console**
2. **Rotate all keys**
3. **Clean git history:**
   ```bash
   # Use BFG Repo Cleaner or git-filter-repo
   git filter-repo --invert-paths --path serviceAccountKey.json
   ```
4. **Force push** (coordinate with team first!)
   ```bash
   git push --force --all
   ```
5. **Audit Firebase logs** for unauthorized access
6. **Consider the repo compromised** - may need new Firebase project

## 📚 Additional Resources

- [Firebase Security Best Practices](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments)
- [Service Account Security](https://cloud.google.com/iam/docs/best-practices-service-accounts)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Last Updated:** 2025-10-25
**Review Schedule:** Every 3 months or after any security incident
