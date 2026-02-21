'use client';

import React, { useState } from 'react';
import {
  Clock,
  Tag,
  CalendarDays,
  Info,
  X,
} from 'lucide-react';
import { useEditorStore } from '@/lib/store';

export default function PropertiesPanel() {
  const currentDocument = useEditorStore((state) => state.currentDocument);
  const [tags, setTags] = useState<string[]>(['important', 'documentation']);
  const [newTag, setNewTag] = useState('');

  if (!currentDocument) {
    return null;
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="w-80 border-l border-[#e0e0e0] dark:border-[#2d2d2d] bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0] dark:border-[#2d2d2d]">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-[#999] dark:text-[#888]" />
          <h3 className="text-sm font-semibold text-[#333] dark:text-[#dcddde]">Properties</h3>
        </div>
      </div>

      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Document Name */}
        <div className="px-4 py-4 border-b border-[#e0e0e0] dark:border-[#2d2d2d]">
          <label className="text-xs text-[#999] dark:text-[#888] uppercase font-semibold block mb-2">
            Document
          </label>
          <input
            type="text"
            value={currentDocument.name}
            readOnly
            className="w-full px-2 py-1.5 bg-white dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-[#2d2d2d] rounded text-sm text-[#333] dark:text-[#dcddde] focus:outline-none"
          />
        </div>

        {/* Created Date */}
        <div className="px-4 py-4 border-b border-[#e0e0e0] dark:border-[#2d2d2d]">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays size={14} className="text-[#999] dark:text-[#888]" />
            <label className="text-xs text-[#999] dark:text-[#888] uppercase font-semibold">
              Created
            </label>
          </div>
          <p className="text-sm text-[#333] dark:text-[#dcddde]">
            {currentDocument.createdAt.toLocaleString()}
          </p>
        </div>

        {/* Updated Date */}
        <div className="px-4 py-4 border-b border-[#e0e0e0] dark:border-[#2d2d2d]">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-[#999] dark:text-[#888]" />
            <label className="text-xs text-[#999] dark:text-[#888] uppercase font-semibold">
              Updated
            </label>
          </div>
          <p className="text-sm text-[#333] dark:text-[#dcddde]">
            {currentDocument.updatedAt.toLocaleString()}
          </p>
        </div>

        {/* Word Count */}
        <div className="px-4 py-4 border-b border-[#e0e0e0] dark:border-[#2d2d2d]">
          <label className="text-xs text-[#999] dark:text-[#888] uppercase font-semibold block mb-2">
            Word Count
          </label>
          <p className="text-sm text-[#333] dark:text-[#dcddde]">
            {currentDocument.content?.split(/\s+/).filter(Boolean).length || 0} words
          </p>
        </div>

        {/* Tags */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={14} className="text-[#999] dark:text-[#888]" />
            <label className="text-xs text-[#999] dark:text-[#888] uppercase font-semibold">
              Tags
            </label>
          </div>

          {/* Tag Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tag..."
              className="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-[#2d2d2d] rounded text-[#333] dark:text-[#dcddde] focus:outline-none focus:border-[#7c3aed]"
            />
            <button
              onClick={addTag}
              className="px-2 py-1.5 text-xs bg-[#f0f0f0] dark:bg-[#2d2d2d] hover:bg-[#e0e0e0] dark:hover:bg-[#3d3d3d] rounded transition-colors text-[#333] dark:text-[#dcddde]"
            >
              Add
            </button>
          </div>

          {/* Tags Display */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-[#7c3aed] bg-opacity-20 border border-[#7c3aed] border-opacity-30 rounded text-xs text-[#7c3aed]"
              >
                <span>{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-[#dcddde]"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
