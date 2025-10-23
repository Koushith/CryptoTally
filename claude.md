# CryptoTally - Crypto Accounting Tool

## Project Overview

CryptoTally is a crypto accounting tool designed for startups, freelancers, and individuals who receive payments in cryptocurrency. It solves the common problem of tracking crypto transactions across multiple wallets and chains for tax filing and revenue tracking purposes.

## Problem Statement

When receiving payments in USDC, ETH, or other cryptocurrencies:

- Transactions are easily forgotten
- End up with 100+ unorganized transactions
- Causes panic during tax filing season
- Manual tracking via Etherscan is tedious and error-prone

## Target Users

- Startups receiving crypto payments
- Freelancers paid in cryptocurrency
- Anyone managing crypto revenue and expenses
- Users needing clean transaction records for accounting

## Core Features (MVP)

### 1. Multi-Chain Wallet Tracking

- **Read-only wallet connection** (no signing transactions)
- Support for multiple chains:
  - Ethereum
  - Polygon
  - Arbitrum
  - BNB Chain
- Add multiple wallets per organization
- Label wallets (e.g., "Treasury", "Payroll", "Operations")
- View consolidated balances across all chains

### 2. Auto-Sync Transactions

- Automatic blockchain transaction fetching
- Native token transfers (ETH, MATIC, etc.)
- ERC20 token transfers
- DEX swaps
- **Fiat value at time of transaction** (via CoinGecko API)
- Timeline view (passbook-style interface)

### 3. Transaction Tagging & Notes

- Custom tags:
  - Customer Payment
  - Vendor Expense
  - Grant
  - Salary
  - Asset Purchase
  - Gas fees
- Add narration/notes to each transaction
- **Upload up to 10 attachments per transaction** (invoices, receipts, contracts)
- Bulk tagging support

### 4. Dashboard & Analytics

- Total inflow/outflow summaries
- Wallet-level balances
- Tag breakdown (income/expense categories)
- Advanced filtering:
  - By tag
  - By token
  - By wallet
  - By date range
- Real-time updates

### 5. Export & Reporting

- CSV export of tagged transactions
- Filterable reports by wallet, tag, date
- Perfect for:
  - Accountants
  - Grant auditors
  - DAO treasury reports
  - Tax preparation

## Tech Stack

### Frontend Framework

- **React 18** - Modern UI library with hooks and concurrent features
- **Vite 6** - Lightning-fast build tool and dev server
- **React Router DOM v7** - Client-side routing
- **TypeScript** - Type safety across the stack

### UI Components & Styling

- **Tailwind CSS** - Utility-first CSS with custom design tokens
- **Radix UI** - Accessible component primitives (Accordion, Dialog, Dropdown, Select, Toast, etc.)
- **shadcn/ui** - Beautiful, accessible components built on Radix
- **Lucide React** - Icon library
- **class-variance-authority** - Component variants
- **tailwind-merge** - Merge Tailwind classes without conflicts

### Animation & Motion

- **Framer Motion** - Production-ready motion library for React
  - Page transitions
  - Scroll-triggered animations
  - Gesture animations
  - Layout animations (shared element transitions)
  - Spring physics for natural movement
- **React Spring** (optional) - Physics-based animations for micro-interactions
- **Auto Animate** - Zero-config animations for layout changes
- **GSAP** (optional) - Advanced timeline-based animations for hero sections

### State Management

- **Zustand** - Lightweight, fast state management (simpler than Redux)
  - ~1KB bundle size
  - No boilerplate
  - Excellent TypeScript support
  - Built-in devtools
- **TanStack Query (React Query)** - Server state management
  - Automatic caching and background refetching
  - Optimistic updates
  - Infinite queries for transaction lists
  - Prefetching support
- **Jotai** (alternative) - Atomic state management
  - Perfect for derived state
  - Better performance for frequent updates
  - Minimal re-renders

### Authentication & User Management

- **Auth Solution** (To be implemented)
  - Google OAuth (primary)
  - Email/password (optional)
  - Session management
  - Role-based access control (Admin, Contributor, Viewer)
- **Workspace system**:
  - Personal workspaces for individuals
  - Organization workspaces (multi-wallet, multi-user)

### Blockchain Data Fetching (Read-Only)

- **Viem** - TypeScript-first Ethereum library
  - Fetch transaction history from RPC nodes
  - Get token balances
  - Decode transaction data
  - ENS resolution
  - No private key handling (read-only)
- **Alchemy SDK** (recommended) - For comprehensive transaction history
  - Multi-chain support (Ethereum, Polygon, Arbitrum, BSC)
  - Enhanced APIs for:
    - Transaction history by address
    - ERC20 token transfers
    - NFT transfers
    - Internal transactions
  - WebSocket support for real-time updates
- **Etherscan API** (fallback) - For additional chain support
- **CoinGecko API** - For historical and real-time token prices
  - Fiat conversion at transaction time
  - Multi-currency support (USD, INR, EUR)
- **TanStack Query** - For caching and background refetching

### Data Visualization

- **Recharts 2.15** - Charts and graphs with smooth animations
- **Tremor** (alternative) - Modern React components for dashboards
- **Victory** (optional) - Highly customizable charts with animations

### Form Handling

- **React Hook Form 7.54** - Performant form state management
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation integration

### Backend & Database

- **Backend API** (To be implemented - Node.js/Express or similar)
- **Prisma** - Type-safe ORM for database operations
- **PostgreSQL** - Primary database (via Supabase or similar)
  - User accounts and workspaces
  - Wallet configurations
  - Transaction metadata (tags, notes)
  - Attachments metadata
- **File Storage**:
  - **Cloudflare R2** (recommended) - S3-compatible, zero egress fees
  - **Supabase Storage** (alternative) - Integrated with Supabase DB
  - Up to 10 attachments per transaction (invoices, receipts, contracts)

### Performance & Optimization

- **Vite Build Optimization** - Fast production builds with code splitting
- **React.lazy** - Code splitting for route-based components
- **Suspense Boundaries** - Granular loading states
- **React Router Lazy Loading** - Route-based code splitting
- **Bundle Analyzer** - Monitor and optimize bundle size (rollup-plugin-visualizer)

### Additional Libraries (Currently Installed)

- **date-fns** - Date manipulation (tree-shakeable)
- **Sonner** - Beautiful toast notifications with animations
- **vaul** - Beautiful drawer component (for mobile)
- **Recharts** - Data visualization and charts
- **next-themes** - Dark mode support
- **jspdf** - PDF generation
- **html-to-image** - Export components as images

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TS-specific linting
- **Vite Dev Server** - Fast HMR and development experience

### Why This Stack?

1. **React + Vite**:

   - Lightning-fast development with HMR
   - Simple SPA architecture for crypto accounting tool
   - Smaller bundle sizes with tree-shaking
   - Great for client-side heavy applications
   - Easy deployment to any static host

2. **Zustand over Redux**:

   - 97% smaller bundle (1KB vs 40KB+)
   - No boilerplate (no actions/reducers/types)
   - Simpler to learn and maintain
   - Just as powerful for most use cases
   - Better TypeScript inference

3. **TanStack Query for Server State**:

   - Separates server state from client state
   - Built-in caching, deduplication, background updates
   - Perfect for blockchain data (transactions, balances)
   - Optimistic updates for better UX

4. **Framer Motion**:

   - Industry-standard animation library
   - Declarative API (animations in JSX)
   - Excellent performance (GPU-accelerated)
   - Layout animations (magic move effects)
   - Gesture support (drag, tap, hover)

5. **Read-only Wallet Tracking**:
   - No transaction signing required
   - Simple address input for wallet tracking
   - Lower barrier to entry for non-crypto users
   - Users can track any wallet address (org treasuries, multi-sigs)
   - Better for accounting/bookkeeping use case

### Animation Strategy

```tsx
// Page transitions
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Stagger children animations
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Scroll-triggered animations
import { useInView } from 'framer-motion';
const ref = useRef(null);
const isInView = useInView(ref, { once: true });

// Number animations (for balances)
import { animate } from 'framer-motion';
```

### State Management Pattern

```tsx
// Zustand store for wallet state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletStore {
  address: string | null;
  setAddress: (address: string | null) => void;
}

export const useWallet = create<WalletStore>()(
  persist(
    (set) => ({
      address: null,
      setAddress: (address) => set({ address }),
    }),
    { name: 'wallet-storage' }
  )
);

// TanStack Query for transactions
import { useQuery } from '@tanstack/react-query';

export const useTransactions = (address: string) => {
  return useQuery({
    queryKey: ['transactions', address],
    queryFn: () => fetchTransactions(address),
    staleTime: 30000, // 30s
    refetchInterval: 60000, // 1min background refetch
  });
};
```

## Data Model (Simplified)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  workspaces WorkspaceMember[]
}

model Workspace {
  id       String   @id @default(cuid())
  name     String
  currency String   @default("USD")
  type     WorkspaceType // 'personal' | 'organization'
  wallets  Wallet[]
  tags     Tag[]
  members  WorkspaceMember[]
}

model WorkspaceMember {
  userId      String
  workspaceId String
  role        Role // 'admin' | 'contributor' | 'viewer'
  user        User      @relation(fields: [userId], references: [id])
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  @@id([userId, workspaceId])
}

model Wallet {
  id           String   @id @default(cuid())
  workspaceId  String
  address      String
  label        String?
  chain        String   // 'ethereum', 'polygon', 'arbitrum', 'bsc'
  workspace    Workspace @relation(fields: [workspaceId], references: [id])
  transactions Transaction[]
}

model Transaction {
  id          String   @id @default(cuid())
  walletId    String
  txHash      String
  fromAddress String
  toAddress   String
  token       String
  amount      String
  fiatValue   Float
  direction   Direction // 'in' | 'out'
  type        TxType    // 'transfer' | 'swap' | 'bridge'
  timestamp   DateTime
  wallet      Wallet @relation(fields: [walletId], references: [id])
  tags        TransactionTag[]
  attachments Attachment[]
  notes       String?
}

model Tag {
  id           String   @id @default(cuid())
  name         String
  workspaceId  String
  workspace    Workspace @relation(fields: [workspaceId], references: [id])
  transactions TransactionTag[]
}

model TransactionTag {
  transactionId String
  tagId         String
  transaction   Transaction @relation(fields: [transactionId], references: [id])
  tag           Tag @relation(fields: [tagId], references: [id])
  @@id([transactionId, tagId])
}

model Attachment {
  id            String   @id @default(cuid())
  transactionId String
  fileUrl       String
  fileName      String
  fileSize      Int
  uploadedBy    String
  uploadedAt    DateTime @default(now())
  transaction   Transaction @relation(fields: [transactionId], references: [id])
}
```

## Project Structure

```
/Accounting/client
├── src/
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # App entry point
│   ├── screens/             # Page components
│   │   ├── auth/           # Auth pages (login, signup)
│   │   ├── home/           # Dashboard/home
│   │   ├── customer/       # Customer management
│   │   ├── invoice/        # Invoice management
│   │   └── error/          # Error pages
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── layout/        # Layout components (AppShell)
│   ├── hooks/             # Custom React hooks
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   ├── lib/               # Utility libraries
│   │   └── utils.ts       # Utility functions
│   └── assets/            # Static assets (images, icons)
├── public/                # Public static files
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Key Configuration Files

- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite configuration with path aliases
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui component configuration

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (TypeScript check + Vite build)
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Notable Features (Planned)

1. **Read-only Wallet Tracking** - Simple address-based wallet monitoring
2. **Multi-chain Support** - Unified view across different blockchains
3. **Tag-based Organization** - Flexible categorization system
4. **Real-time Sync** - Automatic transaction fetching from blockchain
5. **Export Functionality** - CSV/PDF downloads for external accounting tools

## Use Cases

### For Individuals & Freelancers

1. **Tax Preparation** - Categorized transaction records with fiat values at time of receipt
2. **Revenue Tracking** - Tag customer payments, track project income
3. **Expense Management** - Categorize vendor payments, gas fees
4. **Multi-Wallet Management** - Track personal + business wallets separately

### For Organizations & DAOs

1. **Treasury Management** - Track organizational wallet balances and flows
2. **Grant Reporting** - Generate clean reports for grant auditors with supporting docs
3. **Team Collaboration** - Multi-user access with role-based permissions
4. **Audit Trail** - Complete transaction history with tags, notes, and attachments
5. **Payroll Tracking** - Tag and document salary payments
6. **Vendor Management** - Organize and document all vendor payments with invoices

## Design Philosophy

- **Simplicity First** - Clean, passbook-like interface
- **No Manual Entry** - Automatic blockchain data sync
- **Flexible Categorization** - User-defined tags and notes
- **Multi-chain Native** - Built for the reality of cross-chain transactions
- **Export-ready** - Data formatted for accounting software

## Current Status

The project currently has a starter template based on an invoice management system. It uses React 18 + Vite 6 with:
- Complete shadcn/ui component library
- React Router DOM v7 for routing
- Tailwind CSS for styling
- TypeScript for type safety
- Basic screens for auth, customer, and invoice management

**Next Steps:**
1. Remove invoice-related code and adapt for crypto accounting use case
2. Implement blockchain wallet connection and transaction fetching
3. Add Zustand for state management
4. Integrate TanStack Query for blockchain data caching
5. Build transaction tagging and categorization features
6. Implement backend API for data persistence
