import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Home, FileText, RefreshCw, Loader2 } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { EmptyState } from '@/components/shared/EmptyState';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { TransactionDetailSheet } from '@/components/transactions/TransactionDetailSheet';
import { TransactionService, Transaction as ApiTransaction } from '@/services/transaction.service';
import { Transaction, TabType } from '@/types/transaction.types';
import { WorkspaceSelector } from '@/components/workspace/WorkspaceSelector';
import { toast } from 'sonner';

export const TransactionsPage = () => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasAttemptedAutoSync, setHasAttemptedAutoSync] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [selectedToken, setSelectedToken] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Load transactions on mount and workspace change
  useEffect(() => {
    if (currentWorkspaceId) {
      setHasAttemptedAutoSync(false); // Reset when workspace changes
      loadTransactions();
    }
  }, [currentWorkspaceId]);

  const loadTransactions = async (skipAutoSync = false) => {
    if (!currentWorkspaceId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const apiTransactions = await TransactionService.getTransactions(currentWorkspaceId);

      // If no transactions found and we haven't attempted auto-sync yet, trigger it once
      if (apiTransactions.length === 0 && !hasAttemptedAutoSync && !skipAutoSync && !isSyncing) {
        console.log('No transactions found, triggering auto-sync...');
        setHasAttemptedAutoSync(true); // Prevent infinite loop
        toast.info('Fetching transactions from blockchain...');

        // Trigger sync in the background
        handleSyncTransactions();
        return;
      }

      // Convert API transactions to component format
      const formattedTransactions: Transaction[] = apiTransactions.map((tx: ApiTransaction) => ({
        id: tx.hash,
        hash: tx.hash.slice(0, 10) + '...' + tx.hash.slice(-8),
        fullHash: tx.hash,
        timestamp: tx.timestamp,
        type: (tx.type === 'out' ? 'out' : 'in') as 'in' | 'out', // Determine if incoming or outgoing
        chain: tx.chainName,
        amount: tx.value || '0',
        token: tx.asset || 'ETH',
        fiatValue: tx.valueUsd ? `$${tx.valueUsd.toFixed(2)}` : '$0.00',
        wallet: tx.toAddress || '',
        from: tx.fromAddress,
        to: tx.toAddress || '',
        tags: [], // Tags will be added later
        notes: null,
        attachments: [],
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncTransactions = async () => {
    if (!currentWorkspaceId) {
      toast.error('Please select a workspace first');
      return;
    }

    if (isSyncing) {
      console.log('Sync already in progress, skipping...');
      return;
    }

    try {
      setIsSyncing(true);
      console.log('Starting transaction sync...');

      await TransactionService.syncAllTransactions(currentWorkspaceId);

      // Poll for transactions instead of waiting fixed time
      // The sync happens in background, so we need to wait for it to complete
      let attempts = 0;
      const maxAttempts = 20; // Try for up to 20 seconds
      const pollInterval = 1000; // Check every second

      const pollForTransactions = async () => {
        attempts++;
        console.log(`Polling attempt ${attempts}/${maxAttempts}...`);

        const txs = await TransactionService.getTransactions(currentWorkspaceId);

        if (txs.length > 0) {
          // Transactions found!
          console.log(`Found ${txs.length} transactions!`);
          await loadTransactions(true); // Skip auto-sync
          toast.success(`Synced ${txs.length} transactions successfully!`);
          setIsSyncing(false);
        } else if (attempts < maxAttempts) {
          // Keep polling
          setTimeout(pollForTransactions, pollInterval);
        } else {
          // Timeout - no transactions found
          console.log('Sync timeout - no transactions found');
          await loadTransactions(true); // Skip auto-sync
          toast.info('Sync completed. No transactions found on active chains.');
          setIsSyncing(false);
        }
      };

      // Start polling after initial delay
      setTimeout(pollForTransactions, 2000);
    } catch (error) {
      console.error('Error syncing transactions:', error);
      toast.error('Failed to sync transactions');
      setIsSyncing(false);
    }
  };

  const handleWorkspaceChange = (workspaceId: number) => {
    setCurrentWorkspaceId(workspaceId);
  };

  const handleViewTransaction = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsEditMode(false);
    setIsDetailOpen(true);
  };

  const handleEditTransaction = (tx: Transaction, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTx(tx);
    setIsEditMode(true);
    setIsDetailOpen(true);
  };

  const handleSave = (tags: string[], notes: string) => {
    console.log('Saving:', { tags, notes });
    setIsDetailOpen(false);
  };

  // Get unique chains and tokens for filters
  const uniqueChains = Array.from(new Set(transactions.map(tx => tx.chain))).sort();
  const uniqueTokens = Array.from(new Set(transactions.map(tx => tx.token))).sort();

  const filteredTransactions = transactions.filter((tx) => {
    // Tab filter
    if (activeTab === 'untagged' && tx.tags.length > 0) return false;
    if (activeTab === 'tagged' && tx.tags.length === 0) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesAmount = tx.amount.toLowerCase().includes(query);
      const matchesToken = tx.token.toLowerCase().includes(query);
      const matchesHash = tx.fullHash.toLowerCase().includes(query);
      const matchesFrom = tx.from.toLowerCase().includes(query);
      const matchesTo = tx.to.toLowerCase().includes(query);
      const matchesChain = tx.chain.toLowerCase().includes(query);

      if (!matchesAmount && !matchesToken && !matchesHash && !matchesFrom && !matchesTo && !matchesChain) {
        return false;
      }
    }

    // Chain filter
    if (selectedChain !== 'all' && tx.chain !== selectedChain) return false;

    // Token filter
    if (selectedToken !== 'all' && tx.token !== selectedToken) return false;

    // Type filter (incoming/outgoing)
    if (selectedType !== 'all' && tx.type !== selectedType) return false;

    return true;
  });

  const untaggedCount = transactions.filter((tx) => tx.tags.length === 0).length;
  const taggedCount = transactions.filter((tx) => tx.tags.length > 0).length;

  const getEmptyStateProps = () => {
    if (activeTab === 'untagged') {
      return {
        title: 'All caught up!',
        description: 'All your transactions are tagged and organized.',
      };
    }
    return {
      title: 'No transactions found',
      description: 'Try adjusting your filters or connect more wallets.',
    };
  };

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
        <div className="mb-8 md:mb-16">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Transactions</h1>
                <WorkspaceSelector
                  selectedWorkspaceId={currentWorkspaceId}
                  onWorkspaceChange={handleWorkspaceChange}
                />
              </div>
              <p className="text-gray-500 text-sm mt-1">Tag and categorize your blockchain transactions</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSyncTransactions} disabled={isSyncing} className="flex-shrink-0">
                {isSyncing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync
                  </>
                )}
              </Button>
              <Button variant="outline" className="flex-shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by amount, token, hash, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-white"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-2">
            {/* Chain Filter */}
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">All Chains</option>
              {uniqueChains.map(chain => (
                <option key={chain} value={chain}>{chain}</option>
              ))}
            </select>

            {/* Token Filter */}
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">All Tokens</option>
              {uniqueTokens.map(token => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="in">Incoming</option>
              <option value="out">Outgoing</option>
            </select>

            {/* Clear Filters */}
            {(searchQuery || selectedChain !== 'all' || selectedToken !== 'all' || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedChain('all');
                  setSelectedToken('all');
                  setSelectedType('all');
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
              >
                Clear filters
              </button>
            )}

            {/* Results count */}
            <div className="flex items-center px-3 py-1.5 text-sm text-gray-500">
              {filteredTransactions.length} {filteredTransactions.length === 1 ? 'result' : 'results'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5 border-b border-gray-200">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'all'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All
              <span className="ml-1.5 text-xs text-gray-400">
                {transactions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('untagged')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'untagged'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Untagged
              {untaggedCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
                  {untaggedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('tagged')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'tagged'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tagged
              <span className="ml-1.5 text-xs text-gray-400">{taggedCount}</span>
            </button>
          </div>
        </div>

        {/* Transaction List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-500">Loading transactions...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={getEmptyStateProps().title}
            description={getEmptyStateProps().description}
          />
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onView={handleViewTransaction}
                onEdit={handleEditTransaction}
              />
            ))}
          </div>
        )}

        {/* Transaction Detail Sheet */}
        <TransactionDetailSheet
          transaction={selectedTx}
          isOpen={isDetailOpen}
          isEditMode={isEditMode}
          onClose={() => setIsDetailOpen(false)}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};
