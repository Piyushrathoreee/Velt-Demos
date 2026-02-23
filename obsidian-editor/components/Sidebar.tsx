"use client";

import React, { useState } from "react";
import { FileText, Plus, Search, Trash2, Hash } from "lucide-react";
import { useEditorStore } from "@/lib/store";

export default function Sidebar() {
  const documents = useEditorStore((state) => state.documents);
  const currentDocument = useEditorStore((state) => state.currentDocument);
  const setCurrentDocument = useEditorStore(
    (state) => state.setCurrentDocument,
  );
  const addDocument = useEditorStore((state) => state.addDocument);
  const deleteDocument = useEditorStore((state) => state.deleteDocument);
  const setActiveView = useEditorStore((state) => state.setActiveView);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectDocument = (doc: (typeof documents)[0]) => {
    setCurrentDocument(doc);
    setActiveView("editor");
  };

  const handleNewDocument = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: "Untitled",
      content: "<p>Start typing...</p>",
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };
    addDocument(newDoc);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteDocument(id);
  };

  return (
    <div
      className="flex flex-col w-[260px] min-w-[260px] overflow-hidden select-none"
      style={{
        background: "var(--bg-primary)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Vault Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="w-5 h-5 rounded bg-[#7c3aed] flex items-center justify-center">
          <Hash size={12} className="text-white" />
        </div>
        <span
          className="text-sm font-semibold tracking-wide"
          style={{ color: "var(--text-primary)" }}
        >
          My Vault
        </span>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-[9px]"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded focus:outline-none focus:border-[#7c3aed] transition-colors"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-light)",
              color: "var(--text-secondary)",
            }}
          />
        </div>
      </div>

      {/* New Note Button */}
      <div className="px-3 py-1">
        <button
          onClick={handleNewDocument}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <Plus size={14} />
          New note
        </button>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleSelectDocument(doc)}
              className="group flex items-center gap-2 px-3 py-[6px] mx-1 rounded cursor-pointer transition-colors mb-[1px]"
              style={{
                background:
                  currentDocument?.id === doc.id
                    ? "var(--bg-tertiary)"
                    : "transparent",
                color:
                  currentDocument?.id === doc.id
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
              }}
              onMouseEnter={(e) => {
                if (currentDocument?.id !== doc.id) {
                  e.currentTarget.style.background = "var(--bg-hover)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentDocument?.id !== doc.id) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-muted)";
                }
              }}
            >
              <FileText size={14} className="flex-shrink-0 opacity-60" />
              <span className="flex-1 text-[13px] truncate">{doc.name}</span>
              <button
                onClick={(e) => handleDelete(e, doc.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 rounded transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        ) : (
          <div
            className="px-4 py-8 text-center text-xs"
            style={{ color: "var(--text-faint)" }}
          >
            {searchQuery ? "No matching notes" : "No notes yet"}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="text-[11px]" style={{ color: "var(--text-faint)" }}>
          {documents.length} note{documents.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
