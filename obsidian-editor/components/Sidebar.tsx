'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  FolderOpen,
  Plus,
  Search,
  Settings,
  Trash2,
} from 'lucide-react';
import { useEditorStore } from '@/lib/store';

interface Document {
  id: string;
  name: string;
  children?: Document[];
  isOpen?: boolean;
}

export default function Sidebar({
  onToggle,
}: {
  onToggle: () => void;
}) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Welcome',
      children: [],
      isOpen: false,
    },
    {
      id: '2',
      name: 'Getting Started',
      children: [
        { id: '2-1', name: 'Installation', children: [] },
        { id: '2-2', name: 'Configuration', children: [] },
      ],
      isOpen: true,
    },
    {
      id: '3',
      name: 'Documentation',
      children: [
        { id: '3-1', name: 'API Reference', children: [] },
        { id: '3-2', name: 'Examples', children: [] },
      ],
      isOpen: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const setCurrentDocument = useEditorStore((state) => state.setCurrentDocument);
  const currentDocId = useEditorStore((state) => state.currentDocument?.id);

  const toggleFolder = (id: string) => {
    const toggleInArray = (arr: Document[]): Document[] =>
      arr.map((doc) => {
        if (doc.id === id) {
          return { ...doc, isOpen: !doc.isOpen };
        }
        if (doc.children) {
          return { ...doc, children: toggleInArray(doc.children) };
        }
        return doc;
      });

    setDocuments(toggleInArray(documents));
  };

  const handleSelectDocument = (doc: Document) => {
    setCurrentDocument({
      id: doc.id,
      name: doc.name,
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const addNewDocument = () => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: 'Untitled',
      children: [],
      isOpen: false,
    };
    setDocuments([newDoc, ...documents]);
    handleSelectDocument(newDoc);
  };

  const renderDocuments = (docs: Document[], level = 0) => {
    return docs.map((doc) => (
      <div key={doc.id}>
        <div
          className={`flex items-center gap-2 px-2 py-1 mx-1 rounded cursor-pointer hover:bg-[#f0f0f0] dark:hover:bg-[#2d2d2d] group transition-colors ${
            currentDocId === doc.id ? 'bg-[#e8e8e8] dark:bg-[#3d3d3d]' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {doc.children && doc.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(doc.id);
              }}
              className="p-0 hover:bg-[#e0e0e0] dark:hover:bg-[#3d3d3d] rounded"
            >
              {doc.isOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}
          {(!doc.children || doc.children.length === 0) && (
            <div className="w-4" />
          )}

          <FileText size={16} className="text-[#999] dark:text-[#888] flex-shrink-0" />

          <span
            onClick={() => handleSelectDocument(doc)}
            className="flex-1 text-sm truncate text-[#333] dark:text-[#dcddde]"
          >
            {doc.name}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#e0e0e0] dark:hover:bg-[#3d3d3d] rounded"
          >
            <Trash2 size={14} className="text-[#999] dark:text-[#888]" />
          </button>
        </div>

        {doc.isOpen && doc.children && doc.children.length > 0 && (
          <div>
            {renderDocuments(doc.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col w-64 bg-[#f8f8f8] dark:bg-[#1a1a1a] border-r border-[#e0e0e0] dark:border-[#2d2d2d] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0] dark:border-[#2d2d2d]">
        <h1 className="text-sm font-semibold text-[#333] dark:text-[#dcddde]">Files</h1>
      </div>

      {/* Search */}
      <div className="px-2 py-2 border-b border-[#e0e0e0] dark:border-[#2d2d2d]">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-[#ccc] dark:text-[#666]" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#2d2d2d] border border-[#e0e0e0] dark:border-[#3d3d3d] rounded text-[#333] dark:text-[#dcddde] focus:outline-none focus:border-[#7c3aed]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1 px-2 py-2 border-b border-[#e0e0e0] dark:border-[#2d2d2d]">
        <button
          onClick={addNewDocument}
          className="flex-1 flex items-center justify-center gap-2 px-2 py-1.5 text-xs bg-white dark:bg-[#2d2d2d] hover:bg-[#f0f0f0] dark:hover:bg-[#3d3d3d] rounded transition-colors border border-[#e0e0e0] dark:border-[#3d3d3d] text-[#333] dark:text-[#dcddde]"
        >
          <Plus size={14} />
          New
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-2 py-1.5 text-xs bg-white dark:bg-[#2d2d2d] hover:bg-[#f0f0f0] dark:hover:bg-[#3d3d3d] rounded transition-colors border border-[#e0e0e0] dark:border-[#3d3d3d] text-[#333] dark:text-[#dcddde]">
          <FolderOpen size={14} />
        </button>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto py-2">
        {documents.length > 0 ? (
          renderDocuments(documents)
        ) : (
          <div className="px-4 py-8 text-center text-xs text-[#999] dark:text-[#666]">
            No documents yet
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#e0e0e0] dark:border-[#2d2d2d] px-2 py-2 flex gap-1">
        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-white dark:bg-[#2d2d2d] hover:bg-[#f0f0f0] dark:hover:bg-[#3d3d3d] rounded transition-colors border border-[#e0e0e0] dark:border-[#3d3d3d] text-[#333] dark:text-[#dcddde]">
          <Settings size={14} />
        </button>
      </div>
    </div>
  );
}
