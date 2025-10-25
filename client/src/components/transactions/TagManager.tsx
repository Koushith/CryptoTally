import React, { useState } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PREDEFINED_TAGS } from '@/constants/transactions';

interface TagManagerProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  isEditMode: boolean;
}

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  isEditMode,
}) => {
  const [newTag, setNewTag] = useState('');

  const handleAddCustomTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <TagIcon className="h-4 w-4" />
        <span>Tags</span>
      </div>

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.length === 0 ? (
          <span className="text-sm text-gray-500">No tags added</span>
        ) : (
          tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium"
            >
              {tag}
              {isEditMode && (
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="hover:text-gray-300 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          ))
        )}
      </div>

      {/* Add Tags (Edit Mode Only) */}
      {isEditMode && (
        <div className="space-y-3">
          {/* Predefined Tags */}
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">Quick Add</div>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onAddTag(tag)}
                  disabled={tags.includes(tag)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    tags.includes(tag)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Plus className="h-3 w-3 inline mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tag Input */}
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">Custom Tag</div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter custom tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={handleAddCustomTag} type="button" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
