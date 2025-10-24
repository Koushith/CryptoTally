# 🚀 Firebase Deployment Quick Reference

## Local Development

```bash
# 1. Download serviceAccountKey.json from Firebase Console
# 2. Place in server root directory
# 3. Add to .env:
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
FIREBASE_PROJECT_ID=cryptotally-5bdd8

# 4. Start server
npm run dev
```

✅ File is gitignored automatically
✅ Works immediately

---

## Production (Railway)

### One-Time Setup

```bash
# In your server directory, run:
cat serviceAccountKey.json | base64

# Copy the output
```

### Railway Dashboard

1. Go to your project → **Variables** tab
2. Add these variables:

```
FIREBASE_SERVICE_ACCOUNT_BASE64 = <paste base64 string here>
FIREBASE_PROJECT_ID = cryptotally-5bdd8
DATABASE_URL = <your Railway postgres URL>
NODE_ENV = production
PORT = 3001
```

3. Save and deploy!

---

## How to Get Base64 String

### macOS/Linux
```bash
cat serviceAccountKey.json | base64
```

### Windows (PowerShell)
```powershell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("serviceAccountKey.json"))
```

### Windows (Git Bash)
```bash
cat serviceAccountKey.json | base64
```

---

## Quick Verification

### Check Local Setup
```bash
# Should see both files:
ls -la serviceAccountKey.json .env

# Should NOT be tracked by git:
git status | grep serviceAccountKey  # No output = good!
```

### Check Railway Setup
```bash
# In Railway logs, you should see:
🔑 Loading Firebase service account from base64 environment variable...
✅ Firebase service account loaded from environment variable
✅ Firebase Admin SDK initialized successfully
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "File not found" locally | Download from Firebase Console, save as `serviceAccountKey.json` |
| "Firebase configuration not found" on Railway | Add `FIREBASE_SERVICE_ACCOUNT_BASE64` to Railway variables |
| "Invalid JSON" error | Re-encode: `cat serviceAccountKey.json \| base64` |
| Changes not working | Restart Railway service or redeploy |

---

## Full Documentation

- [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) - Complete Railway deployment guide
- [FIREBASE_SECURITY.md](./FIREBASE_SECURITY.md) - Security best practices
- [README.md](./README.md) - General setup instructions

---

**Quick Help:**
Local not working? → Check `serviceAccountKey.json` exists
Railway not working? → Check `FIREBASE_SERVICE_ACCOUNT_BASE64` variable is set

