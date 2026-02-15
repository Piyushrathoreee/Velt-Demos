   # Excalidraw with Velt Collaboration

A powerful whiteboard collaboration app built with Next.js, HTML5 Canvas, and Velt, demonstrating real-time drawing, shape manipulation, and multi-user collaboration features.
https://velt-excalidraw.vercel.app

## 🛠 Tech Stack

| Category             | Technology                            |
| -------------------- | ------------------------------------- |
| **Framework**        | Next.js 16+ (App Router) + TypeScript |
| **Drawing Engine**   | HTML5 Canvas API + Custom Logic       |
| **Collaboration**    | Velt SDK (Cursors, Comments, Huddle)  |
| **State Sync**       | CRDT (Yjs / Custom Implementation)    |
| **Styling**          | Tailwind CSS v4                       |
| **Icons**            | Lucide React                          |


## 🤖 AI Usage

- **IDE** - Antigravity
- **Model** - Gemini 3 pro

## 🔌 MCP Usage

- **Velt Installer mcp**: Used to streamline the installation and configuration of the Velt SDK and CRDT.

## Prompt

- **Prompt**: I want to start the Velt integration. Review my project structure and use your Velt Agent Skills to plan the CRDT store implementation. 

<img src="https://github.com/Studio1HQ/Velt-Demos/blob/main/excallidraw-velt-demo/public/ss.png" width="500" >

## ✨ Features

- **Infinite Canvas**: Pan and zoom support.
- **Drawing Tools**: Pen, Rectangle, Circle, Diamond, Line, Arrow, Text.
- **Real-time Collaboration**:
  - **Multi-user Presence**: See who is online with avatars and cursors.
  - **Live Comments**: Add comments anywhere on the canvas (context-aware).
  - **Huddle**: Voice/Audio collaboration.
  - **Notifications**: Real-time updates on activity.
- **Dark Mode**: Fully supported dark theme with Neutral-900 palette and vibrant tool accents.
- **Responsive Design**: Works on various screen sizes.
- **Velt Integration**: Seamlessly integrated sidebar, collaborative tools, and identity management.

## 📋 Prerequisites

- Node.js v18 or higher
- npm v8+ / bun / yarn / pnpm
- A Velt API Key — [Get one free](https://console.velt.dev)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Studio1HQ/Velt-Demos
cd Velt-Demos
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_VELT_API_KEY=your_velt_api_key_here
```

💡 **Tip:** Get your API key from the [Velt Dashboard](https://console.velt.dev)

### 4. Start Development Server

```bash
npm run dev
# or
bun dev
```

### 5. Open in Browser

Navigate to `http://localhost:3000`

**Testing Collaboration:**

- Open the app in one browser window (User 1).
- Open the app in an **Incognito** window or another browser (User 2).
- You will see two different users (Red/Blue avatars) interacting in real-time!

## 📁 Project Structure

```
excalidraw-velt-demo/
├── app/
│   ├── components/
│   │   ├── ThemeToggle.tsx          # Dark/Light mode switcher with persistence
│   │   ├── velt/
│   │   │   └── VeltSetup.tsx        # Velt SDK initialization & User Identity
│   ├── globals.css                  # Global styles & Tailwind directives
│   ├── layout.tsx                   # Root layout with VeltProvider
│   └── page.tsx                     # Main Canvas logic, Drawing Engine, & Toolbar
├── lib/
│   ├── useCurrentDocument.ts        # Document ID management
│   ├── useWhiteboardStore.ts        # State management for tools/settings
│   ├── theme.ts                     # Theme persistence logic
│   └── utils.ts                     # Utility functions (geometry, etc.)
└── public/
     └── ...
```

## 🔗 Velt Integration

This project demonstrates how to add deep collaboration to a canvas-based application using Velt.

### Velt Components Used

| Component               | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `VeltProvider`          | Main provider wrapping the app for Velt SDK.          |
| `VeltCursor`            | Shows real-time cursors of other users on the canvas. |
| `VeltComments`          | Canvas-based comment overlay logic.                   |
| `VeltCommentTool`       | Toolbar button to activate comment mode.              |
| `VeltCommentsSidebar`   | Sidebar panel showing all conversation threads.       |
| `VeltSidebarButton`     | Toggle button to open/close the comments sidebar.     |
| `VeltPresence`          | Displays avatars of active users in the navbar.       |
| `VeltHuddleTool`        | Button to start voice/video huddles.                  |
| `VeltNotificationsTool` | Notification bell for updates.                        |

### Integration Logic

**User Identity (`components/velt/VeltSetup.tsx`):**
We simulated a multi-user environment by randomly assigning one of two hardcoded users (User 1 or User 2) on load.

```typescript
const users = [
  { userId: "user1", name: "User 1", color: "#F97316", photoUrl: "..." },
  { userId: "user2", name: "User 2", color: "#3B82F6", photoUrl: "..." },
];
const randomUser = users[Math.floor(Math.random() * users.length)];
await client.identify(randomUser);
```

**Canvas Comments (`app/page.tsx`):**
Comments are anchored to the canvas coordinates (`x`, `y`) or specific elements.

```typescript
client.getCommentElement().addManualComment({
  context: {
    x,
    y,
    canvasId: "whiteboard",
    elementId: selectedId, // Optional: anchor to specific shape
  },
});
```

## 🎨 Dark Mode Implementation

We use a custom `ThemeToggle` combined with a `layout.tsx` script to ensure **zero-flicker** dark mode persistence.

- **Storage**: `localStorage.getItem('theme')`
- **CSS**: Tailwind `dark:` variants (Neutral-900 background).
- **Velt Sync**: We sync the theme preference to Velt so Velt's UI (sidebar, comments) matches the app theme automatically.

---

Built with ❤️ using [Velt](https://velt.dev) and [Next.js](https://nextjs.org).
