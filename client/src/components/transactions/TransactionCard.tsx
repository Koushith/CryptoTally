import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Edit3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/transaction.types';

interface TransactionCardProps {
  transaction: Transaction;
  onView: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction, e: React.MouseEvent) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction: tx,
  onView,
  onEdit,
}) => {
  const isUntagged = tx.tags.length === 0;

  return (
    <div
      onClick={() => onView(tx)}
      className={`bg-white border rounded-xl p-4 transition-all cursor-pointer group ${
        isUntagged
          ? 'border-gray-300 bg-gray-50 hover:border-gray-400'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Chain Icon with Direction */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              tx.type === 'in' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
            }`}
          >
            {tx.type === 'in' ? (
              <ArrowDownLeft className={`h-5 w-5 ${tx.type === 'in' ? 'text-green-600' : 'text-red-600'}`} />
            ) : (
              <ArrowUpRight className="h-5 w-5 text-red-600" />
            )}
          </div>
          {/* Chain badge */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold">
            {tx.chain === 'Ethereum' && '⟠'}
            {tx.chain === 'Polygon' && '⬡'}
            {tx.chain === 'Arbitrum' && 'A'}
            {tx.chain === 'Optimism' && 'O'}
            {tx.chain === 'Base' && 'B'}
          </div>
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
              onClick={(e) => onEdit(tx, e)}
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
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-900 text-white text-xs font-medium"
                >
                  {tag}
                </span>
              ))
            )}
            {tx.notes && <span className="text-xs text-gray-500">• Has notes</span>}
            {tx.attachments.length > 0 && (
              <span className="text-xs text-gray-500">
                • {tx.attachments.length} file{tx.attachments.length > 1 ? 's' : ''}
              </span>
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
};
