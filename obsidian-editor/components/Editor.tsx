"use client";

import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEditorStore } from "@/lib/store";
import { EditorProvider } from "./EditorContext";
import FixedToolbar from "./FixedToolbar";

export default function Editor() {
  const currentDocument = useEditorStore((state) => state.currentDocument);
  const updateDocument = useEditorStore((state) => state.updateDocument);
  const isUpdatingRef = useRef(false);

  // Use ref to access latest document ID without adding to dependencies
  const docIdRef = useRef(currentDocument?.id);
  useEffect(() => {
    docIdRef.current = currentDocument?.id;
  }, [currentDocument?.id]);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
        }),
        Underline,
        TextStyle,
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
      ],
      content: currentDocument?.content || "",
      onUpdate: ({ editor }) => {
        if (!docIdRef.current || isUpdatingRef.current) return;

        const html = editor.getHTML();
        isUpdatingRef.current = true;
        updateDocument(docIdRef.current, {
          content: html,
          updatedAt: new Date(),
        });
        isUpdatingRef.current = false;
      },
    },
    [], // Empty dependency array to prevent TipTap re-initialization
  );

  // Update editor content when switching documents
  useEffect(() => {
    if (editor && currentDocument) {
      // Only update if the content is actually different to prevent cursor jumps
      const currentHtml = editor.getHTML();
      if (currentHtml !== currentDocument.content) {
        isUpdatingRef.current = true;
        editor.commands.setContent(currentDocument.content);
        isUpdatingRef.current = false;
      }
    }
  }, [currentDocument?.id, editor]);

  if (!currentDocument) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="text-center">
          <p className="mb-2 text-sm" style={{ color: "var(--text-muted)" }}>
            No document selected
          </p>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            Select a note from the sidebar to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <EditorProvider editor={editor}>
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="px-8 pt-6 pb-2">
          <h2
            className="text-[22px] font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {currentDocument.name}
          </h2>
          <p
            className="text-[11px] mt-1"
            style={{ color: "var(--text-faint)" }}
          >
            Last edited{" "}
            {currentDocument.updatedAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <FixedToolbar editor={editor} />

        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} className="h-full w-full" />
        </div>
      </div>
    </EditorProvider>
  );
}
