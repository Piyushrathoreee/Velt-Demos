'use client';

import React, { createContext, useContext } from 'react';
import { Editor } from '@tiptap/react';

interface EditorContextType {
  editor: Editor | null;
}

const EditorContext = createContext<EditorContextType>({ editor: null });

export function EditorProvider({ children, editor }: { children: React.ReactNode; editor: Editor | null }) {
  return (
    <EditorContext.Provider value={{ editor }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useRichEditor() {
  const context = useContext(EditorContext);
  return context.editor;
}
