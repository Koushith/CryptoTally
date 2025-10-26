# CryptoTally

A crypto accounting tool designed for startups, freelancers, and individuals who receive payments in cryptocurrency.

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ and npm
- PostgreSQL database
- Firebase account (for authentication)

### **1. Clone and Install**

```bash
git clone <repo-url>
cd Accounting

# Install dependencies
cd client && npm install
cd ../server && npm install
```

### **2. Environment Setup** ⚠️ **Important**

We use `.env.local` files for local development to keep credentials secure.

**Option A: Automated Setup** (Recommended)
```bash
# Run the setup script from the project root
./setup-env.sh
```

**Option B: Manual Setup**
```bash
# Client
cd client
cp .env .env.local
# Edit .env.local with your Firebase config

# Server
cd server
cp .env .env.local
# Edit .env.local with your real values
```

📖 **For detailed instructions, see [ENV_SETUP.md](./ENV_SETUP.md)**

### **3. Firebase Setup**

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Get web app config and add to `client/.env.local`
3. Download service account key to `server/serviceAccountKey.json`
4. Update `FIREBASE_PROJECT_ID` in `server/.env.local`

### **4. Database Setup**

```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE cryptotally"

# Update DATABASE_URL in server/.env.local
# DATABASE_URL=postgresql://localhost:5432/cryptotally
```

### **5. Run the App**

```bash
# Terminal 1: Client
cd client
npm run dev
# Opens at http://localhost:5173

# Terminal 2: Server
cd server
npm run dev
# Runs at http://localhost:5000
```

---

## 📂 Project Structure

```
/Accounting/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
├── landing/         # Landing page
├── mintlify-docs/   # Documentation site
├── ENV_SETUP.md     # Environment variables guide
└── setup-env.sh     # Automated setup script
```

---

## 📚 Documentation

- **[ENV_SETUP.md](./ENV_SETUP.md)** - Environment variables setup guide
- **[DOCS.md](./DOCS.md)** - Complete documentation index
- **[Client Docs](./client/docs/)** - Frontend architecture & features
- **[Server Docs](./server/docs/)** - Backend architecture & API docs
- **[Online Docs](https://docs.cryptotally.xyz)** - Full documentation site

---

## 🔒 Security Notes

- ✅ `.env.local` is gitignored (safe to add real credentials)
- ❌ Never commit `.env.local` or `serviceAccountKey.json`
- ✅ `.env` contains only placeholder values (safe to commit)

---

## 🛠️ Development Commands

### **Client**
```bash
cd client
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

### **Server**
```bash
cd server
npm run dev       # Start dev server with hot reload
npm run build     # Build TypeScript
npm start         # Start production server
```

---

## 🚢 Deployment

### **Environment Variables in Production**

For production (Railway, Render, Vercel), set environment variables directly in your hosting platform - **DO NOT** use `.env` or `.env.local` files.

See [ENV_SETUP.md](./ENV_SETUP.md#-production-deployment) for detailed deployment instructions.

---

## 🤝 Contributing

1. Create `.env.local` files (see ENV_SETUP.md)
2. Make your changes
3. Test locally
4. Submit a pull request

---

## 📄 License

[Add your license here]

---

## 🔗 Links

- **Website**: [cryptotally.xyz](https://cryptotally.xyz)
- **App**: [app.cryptotally.xyz](https://app.cryptotally.xyz)
- **Docs**: [docs.cryptotally.xyz](https://docs.cryptotally.xyz)
- **Landing**: [www.cryptotally.xyz](https://www.cryptotally.xyz)

---

**Status**: 🚧 In Development
