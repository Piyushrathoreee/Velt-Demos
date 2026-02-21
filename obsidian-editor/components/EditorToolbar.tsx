'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Code,
  Link2,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Strikethrough,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  const ButtonGroup = ({ children }: { children: React.ReactNode }) => (
    <>
      {children}
      <div className="h-6 w-px bg-[#2d2d2d]" />
    </>
  );

  const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    title,
  }: {
    onClick: () => void;
    isActive: boolean;
    icon: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        isActive
          ? 'bg-[#7c3aed] text-white'
          : 'hover:bg-[#2d2d2d] text-[#888]'
      }`}
      title={title}
    >
      {Icon}
    </button>
  );

  return (
    <>
      <ButtonGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={<Bold size={16} />}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={<Italic size={16} />}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={<Strikethrough size={16} />}
          title="Strikethrough"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={<Code size={16} />}
          title="Inline Code"
        />
      </ButtonGroup>

      <ButtonGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={<Heading1 size={16} />}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={<Heading2 size={16} />}
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={<Heading3 size={16} />}
          title="Heading 3"
        />
      </ButtonGroup>

      <ButtonGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={<List size={16} />}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={<ListOrdered size={16} />}
          title="Numbered List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={<Quote size={16} />}
          title="Quote"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          icon={<Code size={16} />}
          title="Code Block"
        />
      </ButtonGroup>

      <ToolbarButton
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }
        }}
        isActive={editor.isActive('link')}
        icon={<Link2 size={16} />}
        title="Link"
      />
    </>
  );
}
