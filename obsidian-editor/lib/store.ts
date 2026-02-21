import { create } from 'zustand';

export interface DocumentType {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EditorStore {
  currentDocument: DocumentType | null;
  documents: DocumentType[];
  setCurrentDocument: (doc: DocumentType) => void;
  addDocument: (doc: DocumentType) => void;
  updateDocument: (id: string, updates: Partial<DocumentType>) => void;
  deleteDocument: (id: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  currentDocument: null,
  documents: [],

  setCurrentDocument: (doc) =>
    set({
      currentDocument: doc,
    }),

  addDocument: (doc) =>
    set((state) => ({
      documents: [...state.documents, doc],
    })),

  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
      currentDocument:
        state.currentDocument?.id === id
          ? { ...state.currentDocument, ...updates }
          : state.currentDocument,
    })),

  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
      currentDocument:
        state.currentDocument?.id === id ? null : state.currentDocument,
    })),
}));
