import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Paperclip,
  Wallet,
  ExternalLink,
  X,
  Plus,
  Upload,
  Tag as TagIcon,
  Download
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const PREDEFINED_TAGS = [
  'Customer Payment',
  'Vendor Expense',
  'Grant',
  'Salary',
  'Asset Purchase',
  'Gas Fees',
  'Consulting',
  'Subscription',
  'Refund',
];

const mockTransactions = [
  {
    id: '1',
    hash: '0x1234...5678',
    fullHash: '0x1234567890abcdef1234567890abcdef12345678',
    type: 'in',
    token: 'USDC',
    amount: '5,000.00',
    fiatValue: '$5,000.00',
    wallet: 'Treasury Wallet',
    chain: 'Ethereum',
    timestamp: '2024-01-15 14:32',
    tags: ['Customer Payment'],
    notes: 'Payment for Q1 services',
    attachments: [
      { name: 'invoice.pdf', size: '245 KB' },
      { name: 'contract.pdf', size: '1.2 MB' }
    ],
    from: '0xabcd...1234',
    to: '0x5678...efgh',
  },
  {
    id: '2',
    hash: '0xabcd...efgh',
    fullHash: '0xabcdefgh1234567890abcdef1234567890abcdef',
    type: 'out',
    token: 'ETH',
    amount: '2.5',
    fiatValue: '$4,250.00',
    wallet: 'Operations',
    chain: 'Ethereum',
    timestamp: '2024-01-15 09:15',
    tags: ['Vendor Expense'],
    notes: null,
    attachments: [
      { name: 'receipt.pdf', size: '180 KB' }
    ],
    from: '0x5678...efgh',
    to: '0xabcd...1234',
  },
  {
    id: '3',
    hash: '0x5678...9012',
    fullHash: '0x567890121234567890abcdef1234567890abcdef',
    type: 'in',
    token: 'USDT',
    amount: '10,000.00',
    fiatValue: '$10,000.00',
    wallet: 'Treasury Wallet',
    chain: 'Polygon',
    timestamp: '2024-01-14 16:45',
    tags: ['Grant'],
    notes: 'Grant funding from XYZ Foundation',
    attachments: [
      { name: 'grant_agreement.pdf', size: '3.8 MB' },
      { name: 'proposal.pdf', size: '2.1 MB' },
      { name: 'budget.xlsx', size: '125 KB' }
    ],
    from: '0x9012...5678',
    to: '0x5678...efgh',
  },
  {
    id: '4',
    hash: '0x3456...7890',
    fullHash: '0x34567890abcdef1234567890abcdef1234567890',
    type: 'out',
    token: 'USDC',
    amount: '1,500.00',
    fiatValue: '$1,500.00',
    wallet: 'Payroll Wallet',
    chain: 'Polygon',
    timestamp: '2024-01-14 12:00',
    tags: ['Salary'],
    notes: 'Monthly salary - Developer',
    attachments: [],
    from: '0x5678...efgh',
    to: '0x7890...1234',
  },
  {
    id: '5',
    hash: '0x7890...1234',
    fullHash: '0x7890123456789abcdef1234567890abcdef12345',
    type: 'in',
    token: 'DAI',
    amount: '7,500.00',
    fiatValue: '$7,500.00',
    wallet: 'Treasury Wallet',
    chain: 'Arbitrum',
    timestamp: '2024-01-13 11:20',
    tags: ['Customer Payment', 'Consulting'],
    notes: null,
    attachments: [],
    from: '0x1234...7890',
    to: '0x5678...efgh',
  },
];

const chainColors: Record<string, { bg: string; text: string }> = {
  Ethereum: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Polygon: { bg: 'bg-purple-50', text: 'text-purple-700' },
  Arbitrum: { bg: 'bg-cyan-50', text: 'text-cyan-700' },
  'BNB Chain': { bg: 'bg-yellow-50', text: 'text-yellow-700' },
};

export const TransactionsPage = () => {
  const [selectedTx, setSelectedTx] = useState<typeof mockTransactions[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editedNotes, setEditedNotes] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleTransactionClick = (tx: typeof mockTransactions[0]) => {
    setSelectedTx(tx);
    setEditedTags(tx.tags);
    setEditedNotes(tx.notes || '');
    setIsDetailOpen(true);
  };

  const handleAddTag = (tag: string) => {
    if (!editedTags.includes(tag)) {
      setEditedTags([...editedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditedTags(editedTags.filter(t => t !== tag));
  };

  const handleAddCustomTag = () => {
    if (newTag.trim() && !editedTags.includes(newTag.trim())) {
      setEditedTags([...editedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleSave = () => {
    // In real app, this would save to backend
    console.log('Saving:', { tags: editedTags, notes: editedNotes });
    setIsDetailOpen(false);
  };

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-5 md:mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-[32px] font-bold text-gray-800">Transactions</h1>
            <p className="text-gray-500 text-sm mt-1 md:mt-2">View, tag, and manage all your blockchain transactions</p>
          </div>
          <Button variant="outline" className="flex-shrink-0">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl p-4 md:p-5 mb-5 md:mb-8 shadow-sm md:shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                className="pl-10 border-gray-200"
              />
            </div>
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300">
              <option>All Wallets</option>
              <option>Treasury Wallet</option>
              <option>Payroll Wallet</option>
              <option>Operations</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300">
              <option>All Chains</option>
              <option>Ethereum</option>
              <option>Polygon</option>
              <option>Arbitrum</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300">
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
              onClick={() => handleTransactionClick(tx)}
              className="bg-white border border-gray-200 md:hover:border-gray-300 md:hover:shadow-md rounded-2xl md:rounded-xl p-4 md:p-5 shadow-sm md:shadow-none active:scale-[0.98] md:active:scale-100 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3 md:gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  tx.type === 'in' ? 'bg-emerald-50' : 'bg-rose-50'
                }`}>
                  {tx.type === 'in' ? (
                    <ArrowDownLeft className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6 text-rose-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Amount */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base md:text-lg font-semibold">
                      <span className={tx.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}>
                        {tx.type === 'in' ? '+' : '−'} {tx.amount} {tx.token}
                      </span>
                      <span className="text-gray-400 font-normal text-sm ml-2">≈ {tx.fiatValue}</span>
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{tx.timestamp}</span>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Wallet className="h-3.5 w-3.5" />
                      <span>{tx.wallet}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-xs ${chainColors[tx.chain].bg} ${chainColors[tx.chain].text}`}>
                      {tx.chain}
                    </span>
                  </div>

                  {/* Tags and Info */}
                  <div className="flex flex-wrap items-center gap-2">
                    {tx.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tx.notes && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="max-w-[200px] truncate">{tx.notes}</span>
                      </div>
                    )}
                    {tx.attachments.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Paperclip className="h-3.5 w-3.5" />
                        <span>{tx.attachments.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Hash */}
                  <div className="mt-2">
                    <code className="text-xs font-mono text-gray-400">{tx.hash}</code>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transaction Detail Sheet */}
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            {selectedTx && (
              <>
                <SheetHeader>
                  <SheetTitle>Transaction Details</SheetTitle>
                  <SheetDescription>
                    View and manage transaction tags, notes, and attachments
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Transaction Info */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedTx.type === 'in' ? 'bg-emerald-50' : 'bg-rose-50'
                      }`}>
                        {selectedTx.type === 'in' ? (
                          <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-rose-600" />
                        )}
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${
                          selectedTx.type === 'in' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {selectedTx.type === 'in' ? '+' : '−'} {selectedTx.amount} {selectedTx.token}
                        </div>
                        <div className="text-sm text-gray-500">{selectedTx.fiatValue}</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Wallet</span>
                        <span className="font-medium text-gray-800">{selectedTx.wallet}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Chain</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${chainColors[selectedTx.chain].bg} ${chainColors[selectedTx.chain].text}`}>
                          {selectedTx.chain}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Time</span>
                        <span className="font-medium text-gray-800">{selectedTx.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-gray-500">Hash</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-gray-600">{selectedTx.hash}</code>
                          <button className="text-gray-400 hover:text-gray-600">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <TagIcon className="h-4 w-4" />
                      Tags
                    </Label>

                    {/* Current Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {editedTags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm gap-1">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    {/* Predefined Tags */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 font-medium">Quick Add:</div>
                      <div className="flex flex-wrap gap-2">
                        {PREDEFINED_TAGS.filter(tag => !editedTags.includes(tag)).map((tag) => (
                          <Button
                            key={tag}
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTag(tag)}
                            className="text-xs h-7"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Tag Input */}
                    <div className="flex gap-2 mt-3">
                      <Input
                        placeholder="Add custom tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                        className="text-sm"
                      />
                      <Button onClick={handleAddCustomTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Notes
                    </Label>
                    <textarea
                      id="notes"
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Add notes about this transaction..."
                      className="w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
                    />
                  </div>

                  {/* Attachments Section */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      Attachments ({selectedTx.attachments.length}/10)
                    </Label>

                    {selectedTx.attachments.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {selectedTx.attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-800 truncate">{file.name}</div>
                                <div className="text-xs text-gray-500">{file.size}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-600">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button variant="outline" className="w-full" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Attachment
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Upload invoices, receipts, or contracts (PDF, PNG, JPG, XLSX)
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="flex-1">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
