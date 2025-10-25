export type TransactionType = 'in' | 'out';

export interface TransactionAttachment {
  name: string;
  size: string;
}

export interface Transaction {
  id: string;
  hash: string;
  fullHash: string;
  type: TransactionType;
  token: string;
  amount: string;
  fiatValue: string;
  wallet: string;
  chain: string;
  timestamp: string;
  tags: string[];
  notes: string | null;
  attachments: TransactionAttachment[];
  from: string;
  to: string;
}

export type TabType = 'all' | 'untagged' | 'tagged';
