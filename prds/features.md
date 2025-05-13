# 🚀 Feature Breakdown: Crypto Accounting SaaS

This document outlines the phased development of the crypto accounting platform for individuals and organizations.

---

## 🧱 MVP – Wallet Tracking + Tagging

### 🎯 Goal:

Allow users and orgs to connect wallets, track inflows/outflows, tag transactions, and generate basic reports.

### ✅ Core Features:

- **Multi-wallet support** (Ethereum, Polygon, Arbitrum, etc.)
- **Connect wallets** (MetaMask, Gnosis Safe, Ledger, etc.)
- **Auto-sync transactions** (native + ERC20)
- **Manual tagging** (e.g., `Customer Payment`, `Vendor`, `Grant`)
- **Fiat conversion at time of transaction** (via CoinGecko)
- **Add notes (narration)** to transactions
- **Upload up to 10 attachments per transaction** (e.g., invoice, receipt)
- **Basic transaction filtering** (by tag, wallet, date)
- **Export CSV** of tagged transactions
- **Simple dashboard** showing:
  - Total inflow/outflow
  - Wallet balances
  - Tag breakdown (income/expense categories)

---

## 📈 v1 – Cost Basis + Real-Time P&L

### 🎯 Goal:

Track acquisition costs and show realized/unrealized profits and losses.

### ✅ Additions:

- **Track cost basis per token per wallet**
  - FIFO / LIFO supported
- **Real-time P&L dashboard**
  - Unrealized gains/losses
  - Token-specific net gain tracking
- **Historical value at receipt**
  - Store fiat value when asset was acquired
- **Enhanced tagging UX**
  - Bulk tagging
  - Tag suggestion engine (based on counterparty/token)

---

## 🧾 v2 – Estimated Tax Reporting

### 🎯 Goal:

Give users a snapshot of their potential tax liability from crypto activity.

### ✅ Additions:

- **Set tax jurisdiction** (e.g., India, US, EU)
- **Select accounting method** (FIFO, LIFO, HIFO)
- **Capital gains tracking**
  - Based on sell/spend transactions
  - Short-term vs long-term split
- **Income tax tracking**
  - For received crypto (e.g., USDC payments, staking rewards)
- **Estimated tax summary view**
  - Capital gain/loss
  - Total income (based on fiat value at time of receipt)
- **PDF/CSV tax report export**

---

## 📤 v3 – Organization, Collaboration & Reporting

### 🎯 Goal:

Support org-level workflows, multi-user access, advanced tagging, and clean audit/reporting.

### ✅ Additions:

- **Workspace system**
  - Personal workspace for individuals
  - Create/manage org workspaces (multi-wallet, multi-user)
- **User roles and permissions**
  - Admin / Contributor / Viewer
- **Multi-wallet grouping**
  - Label wallets (e.g., `Payroll`, `Treasury`, `Ops`)
- **Attachment management**
  - Central library + transaction-level view
- **Team activity feed**
  - See who tagged/annotated/attached
- **Org-wide export reports**
  - Filterable by wallet, category, date range
- **Auto-tagging rules**
  - “If token is USDC and from 0xABC → tag as Revenue”
- **Audit trail for every transaction**

---

## ✨ Future (Post v3) – Advanced UX & Privacy Layer

### 🎯 Goal:

Support advanced power-user and compliance use cases.

### 🧪 Possible Features:

- **Zero-Knowledge Proof (ZK) Export Mode**
  - Prove compliance/spend without revealing full wallet history
- **Exchange API integrations**
  - (Binance, Coinbase, Kraken, etc.)
- **Payroll mode**
  - Define recurring crypto salaries
- **Recurring tagging automation**
  - “Tag this every month as Payroll”
- **Multi-currency reporting**
  - INR, EUR, GBP, etc.
- **Notification system**
  - Alerts on large txs, low balance, untagged txs

---

## 🧠 Summary Table

| Feature Area                | MVP | v1  | v2  | v3       |
| --------------------------- | --- | --- | --- | -------- |
| Multi-wallet support        | ✅  | ✅  | ✅  | ✅       |
| Tagging & notes             | ✅  | ✅  | ✅  | ✅       |
| Attachments per tx          | ✅  | ✅  | ✅  | ✅       |
| Fiat conversion (CoinGecko) | ✅  | ✅  | ✅  | ✅       |
| Cost basis & PnL            |     | ✅  | ✅  | ✅       |
| Capital gains calc          |     |     | ✅  | ✅       |
| Income tracking & tax est   |     |     | ✅  | ✅       |
| CSV/Tax report export       | ✅  | ✅  | ✅  | ✅       |
| Org workspaces              |     |     |     | ✅       |
| Roles & permissions         |     |     |     | ✅       |
| Audit trail & feed          |     |     |     | ✅       |
| Auto-tagging rules          |     |     |     | ✅       |
| ZK compliance reports       |     |     |     | (Future) |
| Exchange integration        |     |     |     | (Future) |

---
