# Obsidian Velt Demo

> **Obsidian-style collaborative document editor** powered by **Velt CRDT** and **TipTap**

## Overview

A real-time collaborative document editor that recreates the **Obsidian** look and feel — complete with a sidebar, graph view, properties panel, and dark/light theme toggle. Built with vanilla TypeScript (no React), Vite, and Tailwind CSS v4.

Multiple users can simultaneously edit the same document with automatic CRDT-based conflict resolution, live cursors, presence indicators, comments, and notifications.

## Built with AI

This project was developed using cutting-edge AI-assisted tools:

- **Model**: Claude Sonnet 4.6 (Anthropic)
- **IDE**: Antigravity
- **Capabilities**: The AI handled scaffolding, component architecture, Velt SDK integration, and iterative UI refinements, while human oversight drove design direction and quality control.

## Features

### Real-time Collaboration

- **CRDT Sync** — Simultaneous editing with automatic conflict resolution via Velt's TipTap CRDT extension (Yjs-based)
- **Live Cursors** — See collaborators' cursor positions in real-time
- **Presence** — View who's currently online in the toolbar
- **Comments** — Select text and add inline comments via the bubble menu
- **Notifications** — Bell icon for document activity updates
- **Huddle** — Built-in audio/video collaboration tool
- **User Switcher** — Floating bottom-left UI to switch between demo users (Ash Ketchum & Misty)

### Obsidian-style UI

- **3-Panel Layout** — Sidebar + Editor/Graph + Properties panel
- **Sidebar** — Vault header, search bar, and table of contents with click-to-scroll
- **Graph View** — Force-directed node graph of document sections with click-to-navigate
- **Properties Panel** — Document metadata (name, dates, word count, tags, collaboration info)
- **Dark/Light Theme** — Toggle with persistence, synced with Velt dark mode
- **Bubble Menu** — Floating toolbar with Bold, Italic, Strikethrough, Underline, and Comment

### Editor

- **Rich Text** — Powered by TipTap with custom inline heading marks (H1, H2, H3)
- **Initial Content** — Pre-loaded with the "Attention Is All You Need" paper
- **CRDT History** — Undo/redo that respects collaborative changes

## Directory Structure

```
obsidian-velt-demo/
├── src/
│   ├── main.ts                                  # App entry point, layout orchestration
│   ├── lib/
│   │   ├── user.ts                              # Hardcoded demo users + switcher logic
│   │   ├── document.ts                          # Document ID management (URL params)
│   │   ├── velt.ts                              # Velt SDK init, auth, document setup
│   │   └── theme.ts                             # Dark/light theme with persistence
│   └── components/
│       ├── document/tiptap/
│       │   ├── tiptap.ts                        # TipTap editor with Velt CRDT store
│       │   ├── extensions.ts                    # Custom inline heading marks (H1-H3)
│       │   ├── constants.ts                     # Icon paths + initial document content
│       │   └── ui/
│       │       ├── bubble-menu-toolbar.ts       # Floating formatting toolbar
│       │       ├── toolbar-button.ts            # Reusable toolbar button
│       │       └── toolbar-divider.ts           # Toolbar divider
│       ├── graph/
│       │   └── graph-view.ts                    # Canvas force-directed graph view
│       ├── sidebar/
│       │   └── sidebar.ts                       # Vault sidebar with TOC
│       ├── toolbar/
│       │   └── toolbar.ts                       # Top toolbar (view tabs, Velt tools, theme)
│       ├── properties/
│       │   └── properties-panel.ts              # Right-side metadata panel
│       ├── user-switcher/
│       │   └── user-switcher.ts                 # Floating user switch dropdown
│       └── velt/
│           ├── velt-collaboration.ts            # Velt comments + sidebar web components
│           ├── velt-tools.ts                    # Velt presence, huddle, notifications
│           └── ui-customization/
│               └── styles.css                   # Custom Velt component styles
├── styles/
│   ├── globals.css                              # Global styles + CSS variables
│   └── tiptap.css                               # TipTap editor styles
├── public/
│   └── icons/                                   # SVG icons (bold, italic, etc.)
├── index.html
├── vite.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

## Key Technologies

- **Vite 5** — Fast dev server and build tool
- **TypeScript** — Vanilla TS, no framework (no React)
- **TipTap 3.x** — Headless rich text editor
- **@veltdev/tiptap-crdt** — Velt CRDT extension for TipTap
- **@veltdev/tiptap-velt-comments** — Velt inline comment integration
- **@veltdev/client** — Velt collaboration SDK (presence, cursors, notifications)
- **Yjs** — Underlying CRDT implementation
- **Tailwind CSS v4** — Styling via PostCSS
- **Canvas API** — Graph view rendering

## Getting Started

### Install Dependencies

```bash
cd obsidian-velt-demo
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### Basic Editing

1. **Type content** — Click into the editor and start writing
2. **Format text** — Select text to see the bubble menu (Bold, Italic, Strikethrough, Underline)
3. **Add comments** — Select text → click the comment icon in the bubble menu

### Collaborative Features

1. **Open two tabs** — Open the same URL in two browser tabs (or different browsers)
2. **Switch users** — Use the floating switcher (bottom-left) to pick a different user in each tab
3. **Edit simultaneously** — Type in both tabs and see changes sync in real-time
4. **See presence** — View online users' avatars in the toolbar
5. **Live cursors** — See the other user's cursor position and name

### Graph View

1. **Switch to Graph** — Click the "Graph" tab in the toolbar
2. **Drag nodes** — Click and drag to rearrange the graph
3. **Zoom** — Scroll to zoom in/out
4. **Navigate** — Click any node to jump to that section in the editor

### Theme

- Click the sun/moon icon in the toolbar to toggle dark/light mode
- Theme persists across reloads and syncs with Velt dark mode

## Troubleshooting

### Velt Not Loading

1. Check that the API key is set in `src/lib/velt.ts`
2. Verify user initialization in the browser console
3. Ensure you're running the dev server

### CRDT Sync Issues

1. Check browser console for WebSocket errors
2. Verify both tabs share the same `?documentId=` URL parameter
3. Make sure you're using different users in each tab
4. Test with two different browser profiles (e.g., Chrome + Chrome Incognito)

### Editor Not Loading

1. Check browser console for TipTap errors
2. Verify `npm install` completed successfully
3. Ensure all `@veltdev/*` packages are installed

## About Velt SDK

<a href="https://npmjs.org/package/@veltdev/client">
  <img src="https://img.shields.io/npm/v/@veltdev/client?style=flat&label=npm&color=09f" alt="NPM" />
</a>

Add powerful collaboration features to your product extremely fast with Velt SDK.

The SDK provides **fullstack components**:

- UI and behavior are fully customizable to match your product's needs
- Fully-managed on a scalable realtime backend

**Features include:**

- **Comments** like Figma, Frame.io, Google Docs, Sheets and more
- **Recording** like Loom (audio, video, screen)
- **Huddle** like Slack (audio, video, screensharing)
- In-app and off-app **notifications**
- **@mentions** and assignment
- **Presence**, **Cursors**, **Live Selection**
- **Live state sync** with Single Editor mode
- **Multiplayer editing** with conflict resolution
- **Follow mode** like Figma
- ... and so much more

### Resources

- 📚 [Documentation](https://docs.velt.dev/get-started/overview) - Guides and API references
- 🎨 [Use Cases](https://velt.dev/use-case) - See collaboration in action
- 🎭 [Figma Template](https://www.figma.com/community/file/1402312407969730816/velt-collaboration-kit) - Visualize features for your product
- 📝 [Release Notes](https://docs.velt.dev/release-notes/version-4/sdk-changelog) - Latest changes
- 🔒 [Security](https://velt.dev/security) - SOC2 Type 2 & HIPAA compliant
- 🐦 [X/Twitter](https://x.com/veltjs) - Updates and announcements
