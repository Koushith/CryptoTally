# 🧾 Organization-Based Crypto Accounting – Data Access & Tracking Rules

## Overview - MVP USER FLOW

This tool is designed for organizations (startups, DAOs, dev studios) to manage their **own crypto wallets** — tracking inflows, outflows, tagging transactions, uploading attachments, and exporting reports.

It is **not** a wallet spying or surveillance tool. Each organization only has access to wallets they explicitly connect.

---

## ✅ What Can an Organization Track?

| Data Type                                         | Org Visibility |
| ------------------------------------------------- | -------------- |
| Transactions from wallets the org added           | ✅ Yes         |
| Inflow/outflow summaries per wallet               | ✅ Yes         |
| Tags, notes, and attachments added by org members | ✅ Yes         |
| Reports (revenue, expenses, gain/loss)            | ✅ Yes         |
| Team members’ personal wallets (not added to org) | ❌ No          |

---

## 🧠 Org Workflow Summary

1. **Create an Org Workspace**

   - Set workspace name and currency
   - Invite team members (optional)

2. **Add Org-Owned Wallets**

   - Any wallet address the org controls (e.g., Treasury, Payroll, Vendor Ops)
   - Multi-chain supported (Ethereum, Polygon, etc.)

3. **Sync Transactions Automatically**

   - Native token transfers (e.g., ETH, MATIC)
   - ERC20 transfers
   - Swaps (DEX)
   - Fiat value at transaction time (via CoinGecko)

4. **Tag, Note, and Attach**

   - Add custom tags like:
     - `Customer Payment`
     - `Grant`
     - `Vendor Expense`
     - `Asset Purchase`
   - Add narration notes
   - Upload up to 10 supporting documents per transaction

5. **Export Reports**
   - Filter by wallet, tag, date, and export CSV/PDF
   - Ideal for accountants, grant auditors, DAO reports

---

## 🔒 Privacy & Permissions

- Only wallets **explicitly added by the org** are tracked.
- Personal wallets of team members are **never accessed or synced** unless:
  - They are added as a **linked wallet** (e.g. for reimbursements)
  - Explicitly tagged for org visibility

---

## 👤 Roles

| Role        | Access Level                              |
| ----------- | ----------------------------------------- |
| Admin       | Full access to all wallets and settings   |
| Contributor | Can tag, note, and upload attachments     |
| Viewer      | Read-only access to dashboard and reports |

---

## 🧩 Data Model (Simplified)

```sql
User (
  id,
  email,
  name
)

Workspace (
  id,
  name,
  currency,
  type: 'personal' | 'organization'
)

WorkspaceMember (
  userId,
  workspaceId,
  role: 'admin' | 'contributor' | 'viewer'
)

Wallet (
  id,
  workspaceId,
  address,
  label
)

Transaction (
  id,
  walletId,
  txHash,
  fromAddress,
  toAddress,
  token,
  amount,
  fiatValue,
  direction: 'in' | 'out',
  type: 'transfer' | 'swap' | 'bridging',
  timestamp
)

Tag (
  id,
  name,
  workspaceId
)

TransactionTag (
  transactionId,
  tagId
)

Attachment (
  id,
  transactionId,
  fileUrl,
  uploadedBy
)
```
