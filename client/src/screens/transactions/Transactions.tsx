import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Paperclip,
  ExternalLink,
  X,
  Plus,
  Upload,
  Tag as TagIcon,
  Download,
  AlertCircle,
  Edit3,
  Home,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

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
    type: 'in' as const,
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
    type: 'out' as const,
    token: 'ETH',
    amount: '2.5',
    fiatValue: '$4,250.00',
    wallet: 'Operations',
    chain: 'Ethereum',
    timestamp: '2024-01-15 09:15',
    tags: [],
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
    type: 'in' as const,
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
    type: 'out' as const,
    token: 'USDC',
    amount: '1,500.00',
    fiatValue: '$1,500.00',
    wallet: 'Payroll Wallet',
    chain: 'Polygon',
    timestamp: '2024-01-14 12:00',
    tags: [],
    notes: null,
    attachments: [],
    from: '0x5678...efgh',
    to: '0x7890...1234',
  },
  {
    id: '5',
    hash: '0x7890...1234',
    fullHash: '0x7890123456789abcdef1234567890abcdef12345',
    type: 'in' as const,
    token: 'DAI',
    amount: '7,500.00',
    fiatValue: '$7,500.00',
    wallet: 'Treasury Wallet',
    chain: 'Arbitrum',
    timestamp: '2024-01-13 11:20',
    tags: [],
    notes: null,
    attachments: [],
    from: '0x1234...7890',
    to: '0x5678...efgh',
  },
  {
    id: '6',
    hash: '0x9999...8888',
    fullHash: '0x9999888877776666555544443333222211110000',
    type: 'out' as const,
    token: 'USDC',
    amount: '850.00',
    fiatValue: '$850.00',
    wallet: 'Operations',
    chain: 'Arbitrum',
    timestamp: '2024-01-12 15:30',
    tags: ['Vendor Expense'],
    notes: 'Software subscription',
    attachments: [],
    from: '0x5678...efgh',
    to: '0x9999...8888',
  },
];

type TabType = 'all' | 'untagged' | 'tagged';

export const TransactionsPage = () => {
  const [selectedTx, setSelectedTx] = useState<typeof mockTransactions[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editedNotes, setEditedNotes] = useState('');
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const handleViewTransaction = (tx: typeof mockTransactions[0]) => {
    setSelectedTx(tx);
    setEditedTags(tx.tags);
    setEditedNotes(tx.notes || '');
    setIsEditMode(false);
    setIsDetailOpen(true);
  };

  const handleEditTransaction = (tx: typeof mockTransactions[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTx(tx);
    setEditedTags(tx.tags);
    setEditedNotes(tx.notes || '');
    setIsEditMode(true);
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
    console.log('Saving:', { tags: editedTags, notes: editedNotes });
    setIsDetailOpen(false);
  };

  const filteredTransactions = mockTransactions.filter((tx) => {
    if (activeTab === 'untagged') return tx.tags.length === 0;
    if (activeTab === 'tagged') return tx.tags.length > 0;
    return true;
  });

  const untaggedCount = mockTransactions.filter(tx => tx.tags.length === 0).length;
  const taggedCount = mockTransactions.filter(tx => tx.tags.length > 0).length;

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1.5">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Transactions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-5 md:mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-[32px] font-bold text-gray-800">Transactions</h1>
            <p className="text-gray-500 text-sm mt-1 md:mt-2">Tag and categorize your blockchain transactions</p>
          </div>
          <Button variant="outline" className="flex-shrink-0">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Stats Banner */}
        {untaggedCount > 0 && (
          <div className="mb-5 md:mb-6 bg-gray-100 border border-gray-200 rounded-2xl md:rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {untaggedCount} transaction{untaggedCount > 1 ? 's' : ''} need{untaggedCount === 1 ? 's' : ''} tagging
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Tag your transactions to organize them for accounting and tax reporting
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('untagged')}
              className="ml-auto flex-shrink-0"
            >
              View Untagged
            </Button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-5 md:mb-6 flex items-center gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Transactions
            <span className="ml-2 text-xs text-gray-400">({mockTransactions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('untagged')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'untagged'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Needs Tagging
            {untaggedCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold bg-gray-900 text-white rounded">
                {untaggedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tagged')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'tagged'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tagged
            <span className="ml-2 text-xs text-gray-400">({taggedCount})</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 md:mb-6">
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
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {activeTab === 'untagged' ? 'All caught up!' : 'No transactions found'}
            </h3>
            <p className="text-sm text-gray-500">
              {activeTab === 'untagged'
                ? 'All your transactions are tagged and organized.'
                : 'Try adjusting your filters or connect more wallets.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => {
              const isUntagged = tx.tags.length === 0;

              return (
                <div
                  key={tx.id}
                  onClick={() => handleViewTransaction(tx)}
                  className={`bg-white border rounded-xl p-4 transition-all cursor-pointer group ${
                    isUntagged
                      ? 'border-gray-300 bg-gray-50 hover:border-gray-400'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'in' ? 'bg-gray-100' : 'bg-gray-900'
                    }`}>
                      {tx.type === 'in' ? (
                        <ArrowDownLeft className="h-5 w-5 text-gray-900" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Amount */}
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <div className="text-base font-bold text-gray-900">
                            {tx.type === 'in' ? '+' : '−'} {tx.amount} {tx.token}
                          </div>
                          <div className="text-sm text-gray-500">{tx.fiatValue}</div>
                        </div>

                        {/* Edit button on hover */}
                        <Button
                          onClick={(e) => handleEditTransaction(tx, e)}
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-3"
                        >
                          <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                          Edit
                        </Button>
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2">
                        <span>{tx.wallet}</span>
                        <span className="text-gray-300">•</span>
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                          {tx.chain}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>{tx.timestamp}</span>
                      </div>

                      {/* Tags and metadata */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isUntagged ? (
                          <span className="text-xs text-gray-600 font-medium">Needs tagging</span>
                        ) : (
                          tx.tags.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-900 text-white text-xs font-medium">
                              {tag}
                            </span>
                          ))
                        )}
                        {tx.notes && (
                          <span className="text-xs text-gray-500">• Has notes</span>
                        )}
                        {tx.attachments.length > 0 && (
                          <span className="text-xs text-gray-500">• {tx.attachments.length} file{tx.attachments.length > 1 ? 's' : ''}</span>
                        )}
                      </div>

                      {/* Hash */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                        <code className="text-xs font-mono text-gray-400">{tx.hash}</code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Open block explorer
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Transaction Detail Sheet */}
        <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            {selectedTx && (
              <>
                <SheetHeader>
                  <SheetTitle>
                    {isEditMode ? 'Edit Transaction' : 'Transaction Details'}
                  </SheetTitle>
                  <SheetDescription>
                    {isEditMode
                      ? 'Add tags, notes, and attachments to organize this transaction'
                      : 'View transaction details and metadata'}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-5">
                  {/* Transaction Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedTx.type === 'in' ? 'bg-gray-100' : 'bg-gray-900'
                      }`}>
                        {selectedTx.type === 'in' ? (
                          <ArrowDownLeft className="h-6 w-6 text-gray-900" />
                        ) : (
                          <ArrowUpRight className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">
                          {selectedTx.type === 'in' ? '+' : '−'} {selectedTx.amount} {selectedTx.token}
                        </div>
                        <div className="text-sm text-gray-600">{selectedTx.fiatValue}</div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Wallet</span>
                        <span className="font-medium text-gray-900">{selectedTx.wallet}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Chain</span>
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          {selectedTx.chain}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium text-gray-900">{selectedTx.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-600">Hash</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-gray-700">{selectedTx.hash}</code>
                          <button className="text-gray-500 hover:text-gray-900 transition-colors">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className="pb-5 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <TagIcon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-900">Tags</span>
                      {isEditMode && editedTags.length === 0 && (
                        <span className="text-red-600 text-xs font-normal">(Required)</span>
                      )}
                    </div>

                    {!isEditMode ? (
                      // Read-only view
                      <div className="flex flex-wrap gap-2">
                        {selectedTx.tags.length > 0 ? (
                          selectedTx.tags.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-900 text-white text-xs font-medium">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-gray-600">No tags added yet</p>
                        )}
                      </div>
                    ) : (
                      // Edit mode
                      <div className="space-y-3">
                        {editedTags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {editedTags.map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-900 text-white text-xs font-medium">
                                {tag}
                                <button onClick={() => handleRemoveTag(tag)} className="hover:text-gray-300">
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="text-xs text-gray-600 font-medium">Quick add:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {PREDEFINED_TAGS.filter(tag => !editedTags.includes(tag)).map((tag) => (
                              <button
                                key={tag}
                                onClick={() => handleAddTag(tag)}
                                className="inline-flex items-center px-2.5 py-1.5 rounded-md border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Input
                            placeholder="Custom tag..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                            className="text-sm h-9"
                          />
                          <Button onClick={handleAddCustomTag} size="sm" className="h-9 px-3">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes Section */}
                  <div className="pb-5 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-900">Notes</span>
                      {isEditMode && <span className="text-gray-500 text-xs font-normal">(Optional)</span>}
                    </div>
                    {!isEditMode ? (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedTx.notes || <span className="text-gray-600">No notes added</span>}
                      </p>
                    ) : (
                      <textarea
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        placeholder="Add notes about this transaction..."
                        className="w-full min-h-[100px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                      />
                    )}
                  </div>

                  {/* Attachments Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Paperclip className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-900">Attachments</span>
                      {isEditMode && (
                        <span className="text-gray-500 text-xs font-normal">
                          ({selectedTx.attachments.length}/10)
                        </span>
                      )}
                    </div>

                    {selectedTx.attachments.length > 0 ? (
                      <div className="space-y-2 mb-3">
                        {selectedTx.attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-4 w-4 text-gray-600" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                                <div className="text-xs text-gray-600">{file.size}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                                <Download className="h-4 w-4" />
                              </button>
                              {isEditMode && (
                                <button className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 mb-3">No attachments</p>
                    )}

                    {isEditMode && (
                      <>
                        <Button variant="outline" className="w-full h-10" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload File
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Supported: PDF, PNG, JPG, XLSX • Max 10 files
                        </p>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-5 border-t border-gray-200">
                    {isEditMode ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditMode(false)}
                          className="flex-1 h-10"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          className="flex-1 h-10"
                          disabled={editedTags.length === 0}
                        >
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setIsDetailOpen(false)}
                          className="flex-1 h-10"
                        >
                          Close
                        </Button>
                        <Button
                          onClick={() => setIsEditMode(true)}
                          className="flex-1 h-10"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </>
                    )}
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
