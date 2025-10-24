# CryptoTally Server

Backend API server for CryptoTally crypto accounting application.

## Tech Stack

- **Node.js** with **TypeScript**
- **Express** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe database ORM
- **Firebase Admin SDK** - Authentication and services
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```
DATABASE_URL=postgresql://user:password@localhost:5432/cryptotally
```

4. **Setup Firebase Admin SDK** (for authentication):
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to **Project Settings** > **Service Accounts**
   - Click **Generate New Private Key**
   - Save the downloaded JSON file as `serviceAccountKey.json` in the server root directory
   - The file is already gitignored for security

   > ⚠️ **IMPORTANT**: Never commit `serviceAccountKey.json` to git. See [FIREBASE_SECURITY.md](./FIREBASE_SECURITY.md) for details.

5. **Create the database**:
```bash
createdb cryptotally
npm run db:push
```

## Development

Start development server with auto-restart:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Full health check (includes DB connection test)
- `GET /api/health/ping` - Simple ping/pong check

### Root
- `GET /` - API information

## Scripts

- `npm run dev` - Start development server with auto-restart
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── env.ts       # Environment variables
│   │   ├── database.ts  # Database connection
│   │   └── firebase.ts  # Firebase Admin SDK config
│   ├── controllers/     # Request handlers
│   │   └── health.controller.ts
│   ├── routes/          # Route definitions
│   │   ├── index.ts
│   │   └── health.routes.ts
│   ├── db/             # Database schemas
│   └── index.ts        # App entry point
├── drizzle/            # Generated migrations
├── serviceAccountKey.json  # Firebase service account (gitignored!)
├── .env.example        # Example environment variables
├── FIREBASE_SECURITY.md    # Firebase security best practices
├── drizzle.config.ts   # Drizzle ORM config
├── nodemon.json        # Nodemon config
├── tsconfig.json       # TypeScript config
└── package.json        # Dependencies and scripts
```

## Database

This project uses PostgreSQL with Drizzle ORM. Make sure you have PostgreSQL installed and running.

To create the database:
```bash
createdb cryptotally
```

To run migrations:
```bash
npm run db:push
```

## Deployment

### Railway / Render / Vercel

For production deployment, use environment variables instead of the JSON file:

1. Encode your service account key:
```bash
cat serviceAccountKey.json | base64
```

2. Add to your hosting platform's environment variables:
   - `FIREBASE_SERVICE_ACCOUNT_BASE64` = (paste the base64 string)
   - `FIREBASE_PROJECT_ID` = cryptotally-5bdd8
   - `DATABASE_URL` = (your production database URL)
   - `NODE_ENV` = production

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed Railway deployment instructions.
