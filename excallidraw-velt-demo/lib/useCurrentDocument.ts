"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface CurrentDocument {
  documentId: string | null;
  documentName: string;
}

export function useCurrentDocument(): CurrentDocument {
  const [documentId, setDocumentId] = useState<string | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    let docId = urlParams.get("docId");

    if (docId) {
      setDocumentId(docId);
      localStorage.setItem("excalidraw-doc-id", docId);
    } else {
      const stored = localStorage.getItem("excalidraw-doc-id");
      if (stored) {
        docId = stored;
      } else {
        docId = `wb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("excalidraw-doc-id", docId);
      }

      const newUrl = `${window.location.pathname}?docId=${docId}`;
      window.history.replaceState({}, "", newUrl);
      setDocumentId(docId);
    }

    isInitialized.current = true;
  }, []);

  return useMemo(
    () => ({
      documentId,
      documentName: "Excalidraw Whiteboard",
    }),
    [documentId],
  );
}
