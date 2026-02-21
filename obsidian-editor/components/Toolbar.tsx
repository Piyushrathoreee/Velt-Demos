'use client';

import React, { useContext } from 'react';
import {
  Menu,
  Search,
  PanelRight,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { useRichEditor } from './EditorContext';
import { ThemeContext } from './ThemeContext';

interface ToolbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  propertiesOpen: boolean;
  setPropertiesOpen: (open: boolean) => void;
}

export default function Toolbar({
  sidebarOpen,
  setSidebarOpen,
  propertiesOpen,
  setPropertiesOpen,
}: ToolbarProps) {
  const editor = useRichEditor();
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme || 'dark';
  const toggleTheme = themeContext?.toggleTheme || (() => {});

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0] dark:border-[#2d2d2d] bg-white dark:bg-[#1a1a1a]">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 hover:bg-[#f0f0f0] dark:hover:bg-[#2d2d2d] rounded transition-colors text-[#333] dark:text-[#888]"
          title="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="h-6 w-px bg-[#e0e0e0] dark:bg-[#2d2d2d]" />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-[#f0f0f0] dark:hover:bg-[#2d2d2d] rounded transition-colors text-[#333] dark:text-[#888]" title="Search">
          <Search size={16} />
        </button>

        <button
          onClick={() => setPropertiesOpen(!propertiesOpen)}
          className={`p-1.5 rounded transition-colors ${
            propertiesOpen
              ? 'bg-[#f0f0f0] dark:bg-[#2d2d2d] text-[#7c3aed] dark:text-[#7c3aed]'
              : 'hover:bg-[#f0f0f0] dark:hover:bg-[#2d2d2d] text-[#333] dark:text-[#888]'
          }`}
          title="Toggle properties panel"
        >
          <PanelRight size={16} />
        </button>

        <button 
          onClick={toggleTheme}
          className="p-1.5 hover:bg-[#f0f0f0] dark:hover:bg-[#2d2d2d] rounded transition-colors text-[#333] dark:text-[#888]" 
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button className="p-1.5 hover:bg-[#f0f0f0] dark:hover:bg-[#2d2d2d] rounded transition-colors text-[#333] dark:text-[#888]" title="Settings">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
