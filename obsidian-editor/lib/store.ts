import { create } from "zustand";

export interface DocumentType {
  id: string;
  name: string;
  content: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

type ActiveView = "editor" | "graph";

interface EditorStore {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currentDocument: DocumentType | null;
  documents: DocumentType[];
  setCurrentDocument: (doc: DocumentType) => void;
  addDocument: (doc: DocumentType) => void;
  updateDocument: (id: string, updates: Partial<DocumentType>) => void;
  deleteDocument: (id: string) => void;
}

const sampleDocuments: DocumentType[] = [
  {
    id: "1",
    name: "Welcome",
    content:
      "<h1>Welcome to Obsidian Editor</h1><p>This is a demo document editor inspired by <strong>Obsidian</strong>. You can create, edit, and organize your notes in a beautiful dark interface.</p><h2>Features</h2><ul><li>Rich text editing with formatting toolbar</li><li>Document organization with sidebar</li><li>Graph view to visualize connections</li><li>Tag management and metadata</li></ul><blockquote><p>Start by clicking on any document in the sidebar, or create a new one!</p></blockquote>",
    parentId: null,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-02-20"),
    tags: ["getting-started", "welcome"],
  },
  {
    id: "2",
    name: "Daily Notes",
    content:
      '<h1>Daily Notes</h1><p>Use daily notes to capture your thoughts, tasks, and ideas throughout the day.</p><h2>Today\'s Tasks</h2><ul data-type="taskList"><li data-type="taskItem" data-checked="true">Review project documentation</li><li data-type="taskItem" data-checked="false">Write meeting notes</li><li data-type="taskItem" data-checked="false">Update the knowledge base</li></ul><h2>Ideas</h2><p>Consider linking related notes together using the <code>[[wiki-link]]</code> syntax to build a knowledge graph.</p>',
    parentId: null,
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-22"),
    tags: ["daily", "tasks"],
  },
  {
    id: "3",
    name: "Project Ideas",
    content:
      "<h1>Project Ideas</h1><p>A collection of project ideas and brainstorming notes.</p><h2>Web Applications</h2><ol><li><strong>Note-taking app</strong> — Build an Obsidian-like editor with graph view</li><li><strong>Task manager</strong> — Kanban board with drag and drop</li><li><strong>Blog platform</strong> — Markdown-based static site generator</li></ol><h2>Research Topics</h2><p>Look into <em>knowledge graphs</em> and how they can be used to connect related concepts across documents.</p>",
    parentId: null,
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-02-18"),
    tags: ["projects", "ideas"],
  },
  {
    id: "4",
    name: "Meeting Notes",
    content:
      '<h1>Meeting Notes</h1><h2>Team Standup — Feb 20</h2><p><strong>Attendees:</strong> Alice, Bob, Charlie</p><h3>Updates</h3><ul><li>Alice: Finished the landing page redesign</li><li>Bob: Working on API integration</li><li>Charlie: Setting up CI/CD pipeline</li></ul><h3>Action Items</h3><ul data-type="taskList"><li data-type="taskItem" data-checked="false">Alice to review PR #42</li><li data-type="taskItem" data-checked="false">Bob to write API documentation</li><li data-type="taskItem" data-checked="true">Charlie to deploy to staging</li></ul>',
    parentId: null,
    createdAt: new Date("2025-02-20"),
    updatedAt: new Date("2025-02-20"),
    tags: ["meetings", "team"],
  },
  {
    id: "5",
    name: "JavaScript Snippets",
    content:
      '<h1>JavaScript Snippets</h1><p>Useful code snippets for everyday development.</p><h2>Debounce Function</h2><pre><code class="language-javascript">function debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}</code></pre><h2>Deep Clone</h2><pre><code class="language-javascript">const deepClone = (obj) => JSON.parse(JSON.stringify(obj));</code></pre><p>These snippets are referenced in the <em>Project Ideas</em> note.</p>',
    parentId: null,
    createdAt: new Date("2025-01-25"),
    updatedAt: new Date("2025-02-15"),
    tags: ["code", "javascript"],
  },
  {
    id: "6",
    name: "Reading List",
    content:
      '<h1>Reading List</h1><p>Books and articles to read.</p><h2>Books</h2><ul><li><strong>Designing Data-Intensive Applications</strong> — Martin Kleppmann</li><li><strong>Clean Code</strong> — Robert C. Martin</li><li><strong>The Pragmatic Programmer</strong> — Hunt & Thomas</li></ul><h2>Articles</h2><ul><li><a href="#">Understanding Graph Databases</a></li><li><a href="#">Modern CSS Techniques</a></li></ul><blockquote><p>Related to <em>Project Ideas</em> and <em>JavaScript Snippets</em>.</p></blockquote>',
    parentId: null,
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-02-21"),
    tags: ["reading", "books"],
  },
];

export const useEditorStore = create<EditorStore>((set) => ({
  activeView: "editor",
  currentDocument: sampleDocuments[0],
  documents: sampleDocuments,

  setActiveView: (view) => set({ activeView: view }),

  setCurrentDocument: (doc) => set({ currentDocument: doc }),

  addDocument: (doc) =>
    set((state) => ({
      documents: [...state.documents, doc],
      currentDocument: doc,
    })),

  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc,
      ),
      currentDocument:
        state.currentDocument?.id === id
          ? { ...state.currentDocument, ...updates }
          : state.currentDocument,
    })),

  deleteDocument: (id) =>
    set((state) => {
      const remaining = state.documents.filter((doc) => doc.id !== id);
      return {
        documents: remaining,
        currentDocument:
          state.currentDocument?.id === id
            ? remaining[0] || null
            : state.currentDocument,
      };
    }),
}));
