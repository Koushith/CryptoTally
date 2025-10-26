# Environment Variables Setup

## 📋 Overview

This project uses a **two-file environment variable strategy** for better security and development workflow:

- **`.env`** - Template file (committed to git) with placeholder values
- **`.env.local`** - Local file (NOT committed) with your real values

## 🎯 Why This Approach?

### ❌ Problems with Single `.env` File:
1. **Security Risk**: Real credentials can accidentally be committed to git
2. **Merge Conflicts**: Every developer's local values cause conflicts
3. **Onboarding Issues**: New developers don't know what variables are needed

### ✅ Benefits of `.env` + `.env.local`:
1. **Security**: Real credentials never committed (`.env.local` is gitignored)
2. **Documentation**: `.env` shows all required variables with placeholders
3. **No Conflicts**: Each developer has their own `.env.local`
4. **Easy Onboarding**: Copy `.env` to `.env.local` and fill in real values

---

## 📂 File Structure

```
/Accounting/
├── client/
│   ├── .env              # ✅ Template (committed to git)
│   ├── .env.local        # 🔒 Your real values (gitignored)
│   └── .gitignore        # Ensures .env.local is not committed
├── server/
│   ├── .env              # ✅ Template (committed to git)
│   ├── .env.local        # 🔒 Your real values (gitignored)
│   └── .gitignore        # Ensures .env.local is not committed
└── ENV_SETUP.md          # This file
```

---

## 🚀 Setup Instructions

### **For First-Time Setup (New Developers)**

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Accounting
   ```

2. **Create `.env.local` files from templates**

   **Client:**
   ```bash
   cd client
   cp .env .env.local
   ```

   **Server:**
   ```bash
   cd server
   cp .env .env.local
   ```

3. **Update `.env.local` with your real values**

   Edit each `.env.local` file and replace placeholder values with real ones:

   **Client** (`client/.env.local`):
   ```bash
   # Get these from Firebase Console > Project Settings > General
   VITE_FIREBASE_API_KEY=your-real-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   # ... etc
   ```

   **Server** (`server/.env.local`):
   ```bash
   # Update with your Firebase project ID
   FIREBASE_PROJECT_ID=your-project-id

   # Update with your database connection string
   DATABASE_URL=postgresql://localhost:5432/cryptotally
   ```

4. **Verify setup**
   ```bash
   # Client
   cd client
   npm run dev

   # Server
   cd server
   npm run dev
   ```

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Always add real credentials to `.env.local`
- ✅ Keep `.env` with placeholder values only
- ✅ Commit `.env` to git (it's safe, only placeholders)
- ✅ Verify `.env.local` is in `.gitignore`

### ❌ DON'T:
- ❌ Never commit `.env.local` to git
- ❌ Never put real credentials in `.env`
- ❌ Never remove `.env.local` from `.gitignore`
- ❌ Never share `.env.local` publicly

---

## 📝 Environment Variables Reference

### **Client** (`client/.env.local`)

```bash
# Firebase Configuration
# Get these from Firebase Console > Project Settings > General > Your apps > Web app config

VITE_FIREBASE_API_KEY=           # Firebase Web API Key
VITE_FIREBASE_AUTH_DOMAIN=       # project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=        # Your Firebase project ID
VITE_FIREBASE_STORAGE_BUCKET=    # project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=  # Messaging sender ID
VITE_FIREBASE_APP_ID=            # Firebase app ID
VITE_FIREBASE_MEASUREMENT_ID=    # Google Analytics measurement ID
```

**Where to find these:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ (Settings) > Project Settings
4. Scroll to "Your apps" section
5. Click on your web app or create one
6. Copy the config values

---

### **Server** (`server/.env.local`)

```bash
# Environment
NODE_ENV=development              # development | production
PORT=5000                        # Server port (default: 5000)

# Database (Local Development)
DATABASE_URL=postgresql://localhost:5432/cryptotally  # Local PostgreSQL connection string

# Production Database (Railway)
# Uncomment when deploying to production
# PROD_DATABASE_URL=postgresql://postgres:password@postgres-production-c45c.up.railway.app:5432/railway

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json  # Path to service account JSON
FIREBASE_PROJECT_ID=your-project-id                     # Firebase project ID

# Production URLs (only needed in production)
PROD_API_URL=https://api.cryptotally.xyz
PROD_FRONTEND_URL=https://app.cryptotally.xyz
PROD_WEB_URL=https://www.cryptotally.xyz
```

**Firebase Service Account Setup:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ > Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save as `serviceAccountKey.json` in `server/` directory
6. **NEVER commit this file to git!**

---

## 🔄 How Environment Loading Works

### **Client (Vite)**

Vite automatically loads environment variables in this order:
1. `.env.local` (highest priority) - your local values
2. `.env` (fallback) - template values

**File**: No configuration needed, Vite handles this automatically.

**Access in code:**
```typescript
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
```

---

### **Server (Node.js + dotenv)**

**File**: `server/src/config/env.ts`

The server now shows clear console feedback about which environment file is loaded!

```typescript
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  // Shows: 🔒 .env.local (local development)
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  // Shows: ⚠️ .env (template - create .env.local for real values)
}
```

**Loading order:**
1. `.env.local` (highest priority) - your local values
2. `.env` (fallback) - template values

**Console Output:**
```bash
╔════════════════════════════════════════════════════════╗
║         🚀 CryptoTally Server Started                 ║
╚════════════════════════════════════════════════════════╝

📋 Environment Configuration:
   └─ Mode: development
   └─ Port: 5000
   └─ Config: 🔒 .env.local (local development)  ✅

🔗 Server URLs:
   └─ API: http://localhost:5000/api
   └─ Health: http://localhost:5000/api/health

🐘 PostgreSQL:
   └─ Status: ✅ Connected
   └─ URL: postgresql://localhost:5432/cryptotally
```

**📖 See [server/docs/ENVIRONMENT_LOADING.md](./server/docs/ENVIRONMENT_LOADING.md) for detailed explanation**
**📖 See [server/STARTUP_LOGS_EXPLAINED.md](./server/STARTUP_LOGS_EXPLAINED.md) for quick reference**

**Access in code:**
```typescript
import { env, envFileLoaded } from './config/env';

console.log(env.PORT); // 5000
console.log(envFileLoaded); // '.env.local' or '.env'
console.log(process.env.FIREBASE_PROJECT_ID);
```

---

## 🐳 Production Deployment

### **Environment Variables in Production**

For production (Railway, Render, Vercel, etc.), you DON'T need `.env` or `.env.local` files.

Instead, set environment variables directly in your hosting platform:

**Railway:**
```bash
# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set FIREBASE_PROJECT_ID=your-project-id
railway variables set FIREBASE_SERVICE_ACCOUNT_BASE64=<base64-encoded-service-account>

# Database URL (Railway PostgreSQL)
# Railway automatically provides DATABASE_URL when you add a PostgreSQL service
# Example: postgresql://postgres:password@postgres-production-c45c.up.railway.app:5432/railway
railway variables set DATABASE_URL=$RAILWAY_DATABASE_URL
```

**Note**: Railway's PostgreSQL addon automatically sets the `DATABASE_URL` variable.
The production database host is: `postgres-production-c45c.up.railway.app:5432`

**Render:**
1. Dashboard > Environment
2. Add each variable manually

**Vercel:**
1. Project Settings > Environment Variables
2. Add each variable for Production/Preview/Development

---

## 🔍 Troubleshooting

### **Problem: Environment variables not loading**

**Solution:**
```bash
# Check if .env.local exists
ls -la client/.env.local
ls -la server/.env.local

# Verify .env.local is not empty
cat client/.env.local
cat server/.env.local

# Restart dev server
npm run dev
```

---

### **Problem: Firebase not connecting**

**Solution:**
1. Verify Firebase config in `.env.local`
2. Check Firebase project ID matches
3. Verify API key is correct
4. Check Firebase Console > Authentication is enabled

---

### **Problem: Database connection failed**

**Solution:**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify database exists
psql -U postgres -c "\l"

# Create database if needed
psql -U postgres -c "CREATE DATABASE cryptotally"

# Update DATABASE_URL in server/.env.local
DATABASE_URL=postgresql://localhost:5432/cryptotally
```

---

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

---

## ✅ Checklist

Before running the app, make sure:

- [ ] `.env.local` files created in both `client/` and `server/`
- [ ] All placeholder values replaced with real ones
- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] Firebase service account key downloaded to `server/serviceAccountKey.json`
- [ ] PostgreSQL database created and running
- [ ] Environment variables loading correctly (check console logs)

---

**Last Updated**: 2025-10-26
**Status**: ✅ Active
