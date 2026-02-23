"use client";

import React, { useState } from "react";
import { Clock, Tag, CalendarDays, Info, X, FileText } from "lucide-react";
import { useEditorStore } from "@/lib/store";

export default function PropertiesPanel() {
  const currentDocument = useEditorStore((state) => state.currentDocument);
  const updateDocument = useEditorStore((state) => state.updateDocument);
  const [newTag, setNewTag] = useState("");

  if (!currentDocument) {
    return null;
  }

  const tags = currentDocument.tags || [];

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      updateDocument(currentDocument.id, {
        tags: [...tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    updateDocument(currentDocument.id, {
      tags: tags.filter((t) => t !== tag),
    });
  };

  const wordCount =
    currentDocument.content
      ?.replace(/<[^>]*>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length || 0;

  const sectionStyle = { borderBottom: "1px solid var(--border)" };
  const labelStyle = { color: "var(--text-muted)" };
  const valueStyle = { color: "var(--text-secondary)" };

  return (
    <div
      className="w-[280px] min-w-[280px] flex flex-col overflow-hidden"
      style={{
        background: "var(--bg-primary)",
        borderLeft: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3" style={sectionStyle}>
        <Info size={14} style={labelStyle} />
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={labelStyle}
        >
          Properties
        </h3>
      </div>

      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Document Info */}
        <div className="px-4 py-3" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-1.5">
            <FileText size={13} style={labelStyle} />
            <label
              className="text-[11px] uppercase font-semibold tracking-wider"
              style={labelStyle}
            >
              Name
            </label>
          </div>
          <p className="text-sm pl-5" style={valueStyle}>
            {currentDocument.name}
          </p>
        </div>

        {/* Created */}
        <div className="px-4 py-3" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-1.5">
            <CalendarDays size={13} style={labelStyle} />
            <label
              className="text-[11px] uppercase font-semibold tracking-wider"
              style={labelStyle}
            >
              Created
            </label>
          </div>
          <p className="text-sm pl-5" style={valueStyle}>
            {currentDocument.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Updated */}
        <div className="px-4 py-3" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-1.5">
            <Clock size={13} style={labelStyle} />
            <label
              className="text-[11px] uppercase font-semibold tracking-wider"
              style={labelStyle}
            >
              Modified
            </label>
          </div>
          <p className="text-sm pl-5" style={valueStyle}>
            {currentDocument.updatedAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Word Count */}
        <div className="px-4 py-3" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-1.5">
            <FileText size={13} style={labelStyle} />
            <label
              className="text-[11px] uppercase font-semibold tracking-wider"
              style={labelStyle}
            >
              Words
            </label>
          </div>
          <p className="text-sm pl-5" style={valueStyle}>
            {wordCount}
          </p>
        </div>

        {/* Tags */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={13} style={labelStyle} />
            <label
              className="text-[11px] uppercase font-semibold tracking-wider"
              style={labelStyle}
            >
              Tags
            </label>
          </div>

          {/* Tag Input */}
          <div className="flex gap-1.5 mb-3 pl-5">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tag..."
              className="flex-1 px-2 py-1 text-xs rounded focus:outline-none focus:border-[#7c3aed] transition-colors"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-light)",
                color: "var(--text-secondary)",
              }}
            />
          </div>

          {/* Tags Display */}
          <div className="flex flex-wrap gap-1.5 pl-5">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 bg-[#7c3aed]/15 border border-[#7c3aed]/25 rounded text-[11px] text-[#a78bfa] group"
              >
                <span># {tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
