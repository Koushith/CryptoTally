# Deploying to Railway - Firebase Setup Guide

## 🚂 Firebase Service Account Configuration for Railway

Railway doesn't allow you to upload files directly, so you need to provide the Firebase service account key as an environment variable.

## Step-by-Step Guide

### 1. Encode Your Service Account Key

On your local machine, run this command in the server directory:

```bash
cat serviceAccountKey.json | base64
```

This will output a long base64-encoded string. Copy this entire string.

**Example output:**
```
ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAi...
```

### 2. Add Environment Variable to Railway

1. Go to your Railway project dashboard
2. Click on your service (server)
3. Go to the **Variables** tab
4. Add a new variable:
   - **Key:** `FIREBASE_SERVICE_ACCOUNT_BASE64`
   - **Value:** (paste the base64 string from step 1)

5. Add these additional variables:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=your_railway_postgres_url
   FIREBASE_PROJECT_ID=cryptotally-5bdd8
   ```

### 3. Deploy

Railway will automatically redeploy with the new environment variables. Your Firebase Admin SDK will now work in production!

## Environment Variables Checklist

Make sure you have ALL of these variables set in Railway:

```bash
# Required
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
FIREBASE_SERVICE_ACCOUNT_BASE64=ewogICJ0eXBlIjog...
FIREBASE_PROJECT_ID=cryptotally-5bdd8

# Optional (if needed)
PROD_API_URL=https://your-railway-app.railway.app
PROD_FRONTEND_URL=https://app.cryptotally.xyz
PROD_WEB_URL=https://www.cryptotally.xyz
```

## How It Works

The Firebase config (`src/config/firebase.ts`) automatically detects which environment it's running in:

- **Local Development:** Reads from `serviceAccountKey.json` file
- **Production (Railway):** Decodes and uses `FIREBASE_SERVICE_ACCOUNT_BASE64` env variable

```typescript
// The code handles both cases automatically:
if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  // Production: Use base64 env variable
  const decodedKey = Buffer.from(base64Key, 'base64').toString('utf8');
  serviceAccount = JSON.parse(decodedKey);
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  // Local: Use JSON file
  serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}
```

## Verification

After deployment, check the Railway logs. You should see:

```
🔑 Loading Firebase service account from base64 environment variable...
✅ Firebase service account loaded from environment variable
✅ Firebase Admin SDK initialized successfully
```

If you see errors, check that:
1. The base64 string is complete (no truncation)
2. There are no extra spaces or newlines
3. The environment variable name is exactly `FIREBASE_SERVICE_ACCOUNT_BASE64`

## Security Notes

✅ **Safe to use environment variables in Railway** - They're encrypted and not exposed in logs

✅ **Each deployment environment should have its own service account key** - Consider generating separate keys for staging/production

⚠️ **Never commit the base64 string to git** - Only set it in Railway's dashboard

## Alternative: JSON Fields as Separate Variables

If you prefer not to use base64 encoding, you can also set each field separately:

```bash
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=cryptotally-5bdd8
FIREBASE_PRIVATE_KEY_ID=9c8cd5b078ca36a674f8925f9c53b979bf483618
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@cryptotally-5bdd8.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=117099817712954578024
# ... etc
```

Then update `src/config/firebase.ts` to construct the service account object from these variables. However, **the base64 method is simpler and less error-prone**.

## Troubleshooting

### Error: "Firebase configuration not found"
- Make sure `FIREBASE_SERVICE_ACCOUNT_BASE64` is set in Railway variables
- Check for typos in the variable name

### Error: "Unexpected token" or "Invalid JSON"
- The base64 string may be truncated
- Re-encode and paste again, ensuring the entire string is copied

### Error: "Invalid private key"
- The service account key may be corrupted during encoding
- Try downloading a new service account key from Firebase Console
- Re-encode and add to Railway

### Firebase Admin SDK fails to initialize
- Check Railway logs for specific error messages
- Verify `FIREBASE_PROJECT_ID` matches your Firebase project
- Ensure the service account has not been deleted from Firebase Console

## Quick Copy-Paste Commands

```bash
# 1. Generate base64 string (run in server directory)
cat serviceAccountKey.json | base64 | pbcopy

# 2. The base64 string is now in your clipboard
# Go to Railway > Variables > Add Variable
# Key: FIREBASE_SERVICE_ACCOUNT_BASE64
# Value: Paste from clipboard

# 3. Add other required variables
# FIREBASE_PROJECT_ID=cryptotally-5bdd8
# DATABASE_URL=postgresql://...
# NODE_ENV=production
```

## Contact

If you run into issues, check:
1. [Firebase Admin Setup Docs](https://firebase.google.com/docs/admin/setup)
2. [Railway Environment Variables Docs](https://docs.railway.app/develop/variables)
3. [FIREBASE_SECURITY.md](./FIREBASE_SECURITY.md) in this repo

---

**Last Updated:** 2025-10-25
**Railway Documentation Version:** 1.0.0
