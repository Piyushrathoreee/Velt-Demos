"use client";

import React from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Link2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Minus,
} from "lucide-react";

interface FixedToolbarProps {
  editor: Editor | null;
}

export default function FixedToolbar({ editor }: FixedToolbarProps) {
  if (!editor) {
    return null;
  }

  const handleAddLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
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
      className={`p-1.5 rounded transition-all ${
        isActive ? "bg-[#7c3aed] text-white" : ""
      }`}
      style={!isActive ? { color: "var(--text-muted)" } : {}}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Icon size={15} />
    </button>
  );

  const Divider = () => (
    <div
      className="h-5 w-px mx-0.5"
      style={{ background: "var(--border-light)" }}
    />
  );

  return (
    <div
      className="px-6 py-1.5"
      style={{
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={Underline}
          title="Underline (Ctrl+U)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          icon={Code}
          title="Inline Code"
        />

        <Divider />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          icon={Heading3}
          title="Heading 3"
        />

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          title="Ordered List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive("taskList")}
          icon={CheckSquare}
          title="Task List"
        />

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={Quote}
          title="Block Quote"
        />
        <ToolbarButton
          onClick={handleAddLink}
          isActive={editor.isActive("link")}
          icon={Link2}
          title="Add Link"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          icon={Code}
          title="Code Block"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          isActive={false}
          icon={Minus}
          title="Horizontal Rule"
        />
      </div>
    </div>
  );
}
