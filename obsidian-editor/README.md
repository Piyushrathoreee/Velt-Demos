# Obsidian-like Document Editor

A modern document editor inspired by Obsidian, built with Next.js 16, Tailwind CSS v4, and React.

## Features

- 📝 **Live Markdown Editor** - Write and edit markdown with real-time preview
- 📁 **File Sidebar** - Navigate through documents in a tree-like hierarchy
- 🏷️ **Properties Panel** - View and manage document metadata, tags, and timestamps
- 🎨 **Obsidian-like UI** - Dark theme with familiar interface inspired by Obsidian
- ⌨️ **Markdown Formatting** - Toolbar buttons for quick formatting (bold, italic, code, etc.)
- 🔍 **Search** - Quick search for documents
- 📊 **Word Count** - Track document statistics

## Tech Stack

- **Framework**: Next.js 16
- **UI Components**: BaseUI, shadcn/ui
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser and navigate to
# http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
obsidian-editor/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── EditorLayout.tsx     # Main layout wrapper
│   ├── Sidebar.tsx          # Document navigation
│   ├── Editor.tsx           # Main editor with preview
│   ├── PropertiesPanel.tsx  # Metadata panel
│   └── Toolbar.tsx          # Formatting toolbar
├── lib/
│   └── store.ts             # Zustand store
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript config
├── next.config.ts           # Next.js config
└── package.json             # Dependencies
```

## Features Overview

### Main Editor
- Live markdown editor with code highlighting
- Real-time preview panel
- Auto-save functionality
- Support for markdown formatting

### Sidebar
- Hierarchical document organization
- Create new documents
- Search documents
- Collapsible folders
- Quick delete action

### Properties Panel
- Document metadata display
- Creation and modification dates
- Word count tracking
- Tag management system
- Custom tag creation

### Toolbar
- Quick formatting buttons (Bold, Italic, Code)
- Link insertion
- List formatting (bullets, numbered)
- Quote formatting
- Panel toggle shortcuts
- Settings access

## Usage

1. **Create a Document** - Click "New" in the sidebar
2. **Edit Content** - Type in the main editor area
3. **Format Text** - Use toolbar buttons or markdown syntax
4. **Manage Properties** - Add tags and view metadata in the right panel
5. **Navigate** - Use the sidebar to switch between documents

## Keyboard Shortcuts

- `Ctrl+B` - Bold
- `Ctrl+I` - Italic
- `Enter` - Add tags

## Customization

### Changing Theme Colors

Edit `tailwind.config.ts` to modify the Obsidian-like theme:

```typescript
colors: {
  'obsidian-bg': '#121212',
  'obsidian-fg': '#ffffff',
  'obsidian-sidebar': '#1a1a1a',
  // ... more colors
}
```

### Adding More Features

The application is modular and designed for easy extension. Consider adding:
- Auto-save with IndexedDB
- Export to PDF
- Collaborative editing
- Syntax highlighting for code blocks
- Full markdown parser (MDX)

## License

MIT

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.
