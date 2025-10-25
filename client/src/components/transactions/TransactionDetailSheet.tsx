import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Paperclip,
  Upload,
  ExternalLink,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Transaction } from '@/types/transaction.types';
import { TagManager } from './TagManager';

interface TransactionDetailSheetProps {
  transaction: Transaction | null;
  isOpen: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onSave: (tags: string[], notes: string) => void;
}

export const TransactionDetailSheet: React.FC<TransactionDetailSheetProps> = ({
  transaction,
  isOpen,
  isEditMode,
  onClose,
  onSave,
}) => {
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editedNotes, setEditedNotes] = useState('');

  useEffect(() => {
    if (transaction) {
      setEditedTags(transaction.tags);
      setEditedNotes(transaction.notes || '');
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleAddTag = (tag: string) => {
    if (!editedTags.includes(tag)) {
      setEditedTags([...editedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditedTags(editedTags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    onSave(editedTags, editedNotes);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
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
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  transaction.type === 'in' ? 'bg-gray-100' : 'bg-gray-900'
                }`}
              >
                {transaction.type === 'in' ? (
                  <ArrowDownLeft className="h-6 w-6 text-gray-900" />
                ) : (
                  <ArrowUpRight className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {transaction.type === 'in' ? '+' : '−'} {transaction.amount}{' '}
                  {transaction.token}
                </div>
                <div className="text-sm text-gray-600">{transaction.fiatValue}</div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 mb-1">Wallet</div>
                <div className="font-medium text-gray-900">{transaction.wallet}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Chain</div>
                <div className="font-medium text-gray-900">{transaction.chain}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Date & Time</div>
                <div className="font-medium text-gray-900">{transaction.timestamp}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Direction</div>
                <div className="font-medium text-gray-900 capitalize">
                  {transaction.type === 'in' ? 'Received' : 'Sent'}
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-gray-500 mb-1">From</div>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-xs text-gray-900 bg-gray-50 px-2 py-1 rounded">
                    {transaction.from}
                  </code>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">To</div>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-xs text-gray-900 bg-gray-50 px-2 py-1 rounded">
                    {transaction.to}
                  </code>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction Hash */}
            <div className="text-sm">
              <div className="text-gray-500 mb-1">Transaction Hash</div>
              <div className="flex items-center gap-2">
                <code className="font-mono text-xs text-gray-900 bg-gray-50 px-2 py-1 rounded flex-1 truncate">
                  {transaction.fullHash}
                </code>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="pt-3 border-t border-gray-200">
            <TagManager
              tags={editedTags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              isEditMode={isEditMode}
            />
          </div>

          {/* Notes */}
          <div className="pt-3 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4" />
              <span>Notes</span>
            </div>
            {isEditMode ? (
              <Textarea
                placeholder="Add notes about this transaction..."
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            ) : (
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {transaction.notes || (
                  <span className="text-gray-500">No notes added</span>
                )}
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="pt-3 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Paperclip className="h-4 w-4" />
              <span>Attachments</span>
            </div>

            {transaction.attachments.length > 0 ? (
              <div className="space-y-2">
                {transaction.attachments.map((attachment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {attachment.name}
                        </div>
                        <div className="text-xs text-gray-500">{attachment.size}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No attachments</div>
            )}

            {isEditMode && (
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          {isEditMode && (
            <div className="pt-4 border-t border-gray-200 flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
