import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Tag, FileText, Paperclip } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockTransactions = [
  {
    id: '1',
    hash: '0x1234...5678',
    type: 'in',
    token: 'USDC',
    amount: '5,000.00',
    fiatValue: '$5,000.00',
    from: '0x8765...4321',
    to: '0x1234...5678',
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
    from: '0x1234...5678',
    to: '0x9876...5432',
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
    from: '0x3456...7890',
    to: '0x1234...5678',
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
    from: '0x1234...5678',
    to: '0x6543...2109',
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
    from: '0x2345...6789',
    to: '0x1234...5678',
    wallet: 'Treasury Wallet',
    chain: 'Arbitrum',
    timestamp: '2024-01-13 11:20',
    tags: ['Customer Payment', 'Consulting'],
    notes: null,
    attachments: 0,
  },
];

const chainColors: Record<string, string> = {
  Ethereum: 'bg-gray-100 text-gray-700',
  Polygon: 'bg-gray-100 text-gray-700',
  Arbitrum: 'bg-gray-100 text-gray-700',
  'BNB Chain': 'bg-yellow-100 text-yellow-700',
};

export const TransactionsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-500 text-sm mt-2">View, tag, and manage all your blockchain transactions.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by hash, address, or tag..."
              className="pl-10"
            />
          </div>
          <select className="text-sm border-gray-200 rounded-md px-3 py-2 bg-white min-w-[140px]">
            <option>All Wallets</option>
            <option>Treasury Wallet</option>
            <option>Payroll Wallet</option>
            <option>Operations</option>
          </select>
          <select className="text-sm border-gray-200 rounded-md px-3 py-2 bg-white min-w-[140px]">
            <option>All Chains</option>
            <option>Ethereum</option>
            <option>Polygon</option>
            <option>Arbitrum</option>
          </select>
          <select className="text-sm border-gray-200 rounded-md px-3 py-2 bg-white min-w-[140px]">
            <option>All Types</option>
            <option>Inflow</option>
            <option>Outflow</option>
          </select>
        </div>

        {/* Transactions Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Chain</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.type === 'in' ? (
                        <div className="p-1.5 bg-green-100 rounded-full">
                          <ArrowDownLeft className="h-3.5 w-3.5 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-red-100 rounded-full">
                          <ArrowUpRight className="h-3.5 w-3.5 text-red-600" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <code className="text-xs font-mono text-gray-900">{tx.hash}</code>
                      {tx.notes && (
                        <span className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {tx.notes}
                        </span>
                      )}
                      {tx.attachments > 0 && (
                        <span className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          {tx.attachments} attachment{tx.attachments > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${tx.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'in' ? '+' : '-'} {tx.amount} {tx.token}
                      </span>
                      <span className="text-xs text-gray-500">{tx.fiatValue}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={chainColors[tx.chain]} variant="secondary">
                      {tx.chain}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{tx.wallet}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {tx.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Tag className="h-2.5 w-2.5 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500">{tx.timestamp}</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      •••
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-gray-500">Showing 5 of 231 transactions</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
