'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Code,
  Link2,
  List,
  CheckSquare,
  Type,
  Trash2,
  Quote,
  Heading1,
  Heading2,
} from 'lucide-react';

interface FloatingToolbarProps {
  editor: Editor | null;
}

export default function FloatingToolbar({ editor }: FloatingToolbarProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = useCallback(() => {
    if (!editor) return;

    const { view } = editor;
    const { state } = view;
    const { from, to } = state.selection;

    if (from === to) {
      setIsVisible(false);
      return;
    }

    const start = view.coordsAtPos(from);
    const end = view.coordsAtPos(to);

    const menuWidth = 400;
    const menuHeight = 60;

    const left = Math.max(
      10,
      (start.left + end.left) / 2 - menuWidth / 2
    );
    const top = start.top - menuHeight - 10;

    setIsVisible(true);
    setPosition({ top, left });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    editor.on('selectionUpdate', updateMenuPosition);
    editor.on('update', updateMenuPosition);
    editor.on('focus', () => setIsVisible(false));

    return () => {
      editor.off('selectionUpdate', updateMenuPosition);
      editor.off('update', updateMenuPosition);
      editor.off('focus', () => setIsVisible(false));
    };
  }, [editor, updateMenuPosition]);

  if (!editor || !isVisible) {
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
    editor.chain().focus().run();
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
          ? 'bg-[#7c3aed] text-white'
          : 'bg-[#2d2d2d] text-[#dcddde] hover:bg-[#3d3d3d] text-[#888]'
      }`}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
      }}
      className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg shadow-lg backdrop-blur-md"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-1 p-2 flex-wrap max-w-md">
        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          title="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          title="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={Underline}
          title="Underline"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={Code}
          title="Inline Code"
        />

        <div className="h-6 w-px bg-[#2d2d2d]" />

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

        <div className="h-6 w-px bg-[#2d2d2d]" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          icon={CheckSquare}
          title="Checklist"
        />

        <div className="h-6 w-px bg-[#2d2d2d]" />

        {/* Quote & Link */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={Quote}
          title="Quote"
        />
        <ToolbarButton
          onClick={handleAddLink}
          isActive={editor.isActive('link')}
          icon={Link2}
          title="Add Link"
        />

        <div className="h-6 w-px bg-[#2d2d2d]" />

        {/* Font Size */}
        <select
          onChange={(e) => {
            const fontSize = e.target.value;
            if (fontSize) {
              editor.chain().focus().run();
            }
            e.target.value = '';
          }}
          className="px-2 py-1.5 bg-[#2d2d2d] text-[#dcddde] text-sm rounded hover:bg-[#3d3d3d] cursor-pointer focus:outline-none border border-[#3d3d3d]"
          title="Font Size"
        >
          <option value="">📝 Size</option>
          <option value="small">Small</option>
          <option value="normal">Normal</option>
          <option value="large">Large</option>
          <option value="xlarge">Extra Large</option>
        </select>

        <div className="h-6 w-px bg-[#2d2d2d]" />

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
