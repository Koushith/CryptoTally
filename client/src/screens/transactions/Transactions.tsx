import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowUpRight, ArrowDownLeft, FileText, Paperclip, Wallet, ExternalLink } from 'lucide-react';

const mockTransactions = [
  {
    id: '1',
    hash: '0x1234...5678',
    type: 'in',
    token: 'USDC',
    amount: '5,000.00',
    fiatValue: '$5,000.00',
    wallet: 'Treasury Wallet',
    chain: 'Ethereum',
    timestamp: '2024-01-15 14:32',
    tags: ['Customer Payment'],
    notes: 'Payment for Q1 services',
    attachments: 2,
  },
  {
    id: '2',
    hash: '0xabcd...efgh',
    type: 'out',
    token: 'ETH',
    amount: '2.5',
    fiatValue: '$4,250.00',
    wallet: 'Operations',
    chain: 'Ethereum',
    timestamp: '2024-01-15 09:15',
    tags: ['Vendor Expense'],
    notes: null,
    attachments: 1,
  },
  {
    id: '3',
    hash: '0x5678...9012',
    type: 'in',
    token: 'USDT',
    amount: '10,000.00',
    fiatValue: '$10,000.00',
    wallet: 'Treasury Wallet',
    chain: 'Polygon',
    timestamp: '2024-01-14 16:45',
    tags: ['Grant'],
    notes: 'Grant funding from XYZ Foundation',
    attachments: 3,
  },
  {
    id: '4',
    hash: '0x3456...7890',
    type: 'out',
    token: 'USDC',
    amount: '1,500.00',
    fiatValue: '$1,500.00',
    wallet: 'Payroll Wallet',
    chain: 'Polygon',
    timestamp: '2024-01-14 12:00',
    tags: ['Salary'],
    notes: 'Monthly salary - Developer',
    attachments: 0,
  },
  {
    id: '5',
    hash: '0x7890...1234',
    type: 'in',
    token: 'DAI',
    amount: '7,500.00',
    fiatValue: '$7,500.00',
    wallet: 'Treasury Wallet',
    chain: 'Arbitrum',
    timestamp: '2024-01-13 11:20',
    tags: ['Customer Payment', 'Consulting'],
    notes: null,
    attachments: 0,
  },
];

const chainColors: Record<string, { bg: string; text: string; border: string }> = {
  Ethereum: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Polygon: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Arbitrum: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  'BNB Chain': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
};

export const TransactionsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-gray-800">Transactions</h1>
          <p className="text-gray-500 text-sm mt-2">View and tag all your blockchain transactions</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-white border-0"
              />
            </div>
            <select className="px-4 py-2 rounded-lg bg-white border-0 text-sm font-medium text-gray-700">
              <option>All Wallets</option>
              <option>Treasury Wallet</option>
              <option>Payroll Wallet</option>
              <option>Operations</option>
            </select>
            <select className="px-4 py-2 rounded-lg bg-white border-0 text-sm font-medium text-gray-700">
              <option>All Chains</option>
              <option>Ethereum</option>
              <option>Polygon</option>
              <option>Arbitrum</option>
            </select>
            <select className="px-4 py-2 rounded-lg bg-white border-0 text-sm font-medium text-gray-700">
              <option>All Types</option>
              <option>Inflow</option>
              <option>Outflow</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-5 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Colored Icon */}
                <div className={`p-3 rounded-xl ${tx.type === 'in' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  {tx.type === 'in' ? (
                    <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-rose-600" />
                  )}
                </div>

                {/* Content */}
                <div>
                  {/* Title Line */}
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">
                    <span className={tx.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}>
                      {tx.type === 'in' ? '+' : '−'} {tx.amount} {tx.token}
                    </span>
                    <span className="text-gray-400 font-normal ml-2">≈ {tx.fiatValue}</span>
                  </h3>

                  {/* Metadata Line */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Wallet className="h-3 w-3" />
                    <span>{tx.wallet}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded ${chainColors[tx.chain].bg} ${chainColors[tx.chain].text}`}>
                      {tx.chain}
                    </span>
                    <span>•</span>
                    <span>{tx.tags.join(', ')}</span>
                    {tx.notes && (
                      <>
                        <span>•</span>
                        <FileText className="h-3 w-3" />
                        <span className="max-w-[150px] truncate">{tx.notes}</span>
                      </>
                    )}
                    {tx.attachments > 0 && (
                      <>
                        <span>•</span>
                        <Paperclip className="h-3 w-3" />
                        <span>{tx.attachments}</span>
                      </>
                    )}
                  </div>

                  {/* Hash Line */}
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs font-mono text-gray-400">{tx.hash}</code>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Timestamp */}
              <div className="text-right text-xs text-gray-500">
                <div>{tx.timestamp}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="default" className="w-12 p-0">1</Button>
            <Button variant="ghost" className="w-12 p-0">2</Button>
            <Button variant="ghost" className="w-12 p-0">3</Button>
          </div>
          <Button variant="outline">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
