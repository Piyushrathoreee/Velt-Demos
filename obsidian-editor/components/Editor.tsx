'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {TextStyle} from '@tiptap/extension-text-style';
import { useEditorStore } from '@/lib/store';
import { EditorProvider } from './EditorContext';
import FixedToolbar from './FixedToolbar';

function EditorInner() {
  const currentDocument = useEditorStore((state) => state.currentDocument);
  const setCurrentDocument = useEditorStore((state) => state.setCurrentDocument);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: {
          languageClassPrefix: 'language-',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      TextStyle,
      TaskList.configure({
        nested: true,
      }),
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: currentDocument?.content || '<p>Start typing...</p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (currentDocument) {
        setCurrentDocument({
          ...currentDocument,
          content: html,
          updatedAt: new Date(),
        });
      }
    },
  });

  useEffect(() => {
    if (editor && currentDocument?.content && editor.getHTML() !== currentDocument.content) {
      editor.commands.setContent(currentDocument.content || '<p></p>');
    }
  }, [currentDocument?.id, editor]);

  if (!currentDocument) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#888] mb-2">No document selected</p>
          <p className="text-sm text-[#666]">Click on a document to edit</p>
        </div>
      </div>
    );
  }

  return (
    <EditorProvider editor={editor}>
      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#121212]">
        {/* Document Title */}
        <div className="border-b border-[#e0e0e0] dark:border-[#2d2d2d] px-6 py-4">
          <h2 className="text-2xl font-semibold text-[#333] dark:text-[#dcddde]">
            {currentDocument.name}
          </h2>
          <p className="text-xs text-[#999] dark:text-[#888] mt-1">
            Last edited: {currentDocument.updatedAt.toLocaleString()}
          </p>
        </div>

        {/* Fixed Toolbar */}
        <FixedToolbar editor={editor} />

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          <EditorContent 
            editor={editor}
            className="h-full w-full"
          />
        </div>
      </div>
    </EditorProvider>
  );
}

export default EditorInner;
