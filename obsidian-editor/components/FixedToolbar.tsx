'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Code,
  Link2,
  List,
  ListOrdered,
  CheckSquare,
  Type,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Trash2,
} from 'lucide-react';

interface FixedToolbarProps {
  editor: Editor | null;
}

export default function FixedToolbar({ editor }: FixedToolbarProps) {
  if (!editor) {
    return null;
  }

  const handleAddLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const handleFontSize = (size: string) => {
    if (size === 'small') {
      editor.chain().focus().setMark('textStyle', { fontSize: '12px' }).run();
    } else if (size === 'normal') {
      editor.chain().focus().unsetMark('textStyle').run();
    } else if (size === 'large') {
      editor.chain().focus().setMark('textStyle', { fontSize: '18px' }).run();
    } else if (size === 'xlarge') {
      editor.chain().focus().setMark('textStyle', { fontSize: '24px' }).run();
    }
  };

  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    title,
  }: {
    onClick: () => void;
    isActive: boolean;
    icon: React.ComponentType<any>;
    title: string;
  }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-2 rounded transition-all ${
        isActive
          ? 'bg-[#7c3aed] text-white dark:bg-[#7c3aed]'
          : 'bg-[#f0f0f0] text-[#333] hover:bg-[#e0e0e0] dark:bg-[#2d2d2d] dark:text-[#888] dark:hover:bg-[#3d3d3d]'
      }`}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="bg-[#f8f8f8] dark:bg-[#1a1a1a] border-b border-[#e0e0e0] dark:border-[#2d2d2d] px-4 py-2">
      <div className="flex items-center gap-1 flex-wrap">
        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={Underline}
          title="Underline (Ctrl+U)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={Code}
          title="Inline Code"
        />

        <div className="h-6 w-px bg-[#e0e0e0] dark:bg-[#2d2d2d]" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={Heading3}
          title="Heading 3"
        />

        <div className="h-6 w-px bg-[#e0e0e0] dark:bg-[#2d2d2d]" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="Ordered List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          icon={CheckSquare}
          title="Task List"
        />

        <div className="h-6 w-px bg-[#e0e0e0] dark:bg-[#2d2d2d]" />

        {/* Quote & Link */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={Quote}
          title="Block Quote"
        />
        <ToolbarButton
          onClick={handleAddLink}
          isActive={editor.isActive('link')}
          icon={Link2}
          title="Add Link"
        />

        <div className="h-6 w-px bg-[#e0e0e0] dark:bg-[#2d2d2d]" />

        {/* Font Size */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleFontSize(e.target.value);
            }
            e.target.value = '';
          }}
          className="px-2 py-1.5 bg-[#f0f0f0] text-[#333] dark:bg-[#2d2d2d] dark:text-[#dcddde] text-sm rounded hover:bg-[#e0e0e0] dark:hover:bg-[#3d3d3d] cursor-pointer focus:outline-none border border-[#e0e0e0] dark:border-[#3d3d3d]"
          title="Font Size"
        >
          <option value="">📝 Size</option>
          <option value="small">Small (12px)</option>
          <option value="normal">Normal (16px)</option>
          <option value="large">Large (18px)</option>
          <option value="xlarge">Extra Large (24px)</option>
        </select>

        <div className="h-6 w-px bg-[#e0e0e0] dark:bg-[#2d2d2d]" />

        {/* Code Block */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          icon={Code}
          title="Code Block"
        />

        {/* Clear Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().run()}
          isActive={false}
          icon={Trash2}
          title="Clear Formatting"
        />
      </div>
    </div>
  );
}
