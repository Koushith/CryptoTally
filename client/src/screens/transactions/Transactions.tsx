import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Home, FileText } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { TransactionDetailSheet } from '@/components/transactions/TransactionDetailSheet';
import { MOCK_TRANSACTIONS } from '@/constants/transactions';
import { Transaction, TabType } from '@/types/transaction.types';

export const TransactionsPage = () => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');

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

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    if (activeTab === 'untagged') return tx.tags.length === 0;
    if (activeTab === 'tagged') return tx.tags.length > 0;
    return true;
  });

  const untaggedCount = MOCK_TRANSACTIONS.filter((tx) => tx.tags.length === 0).length;
  const taggedCount = MOCK_TRANSACTIONS.filter((tx) => tx.tags.length > 0).length;

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
        <PageHeader
          title="Transactions"
          description="Tag and categorize your blockchain transactions"
          action={
            <Button variant="outline" className="flex-shrink-0">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          }
        />

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by amount, token, wallet..."
              className="pl-9 h-10 bg-white"
            />
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
                {MOCK_TRANSACTIONS.length}
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
        {filteredTransactions.length === 0 ? (
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
