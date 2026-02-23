"use client";

import React, { useContext } from "react";
import { Menu, PanelRight, FileText, GitFork, Moon, Sun } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { ThemeContext } from "./ThemeContext";

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
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme || "dark";
  const toggleTheme = themeContext?.toggleTheme || (() => {});
  const activeView = useEditorStore((state) => state.activeView);
  const setActiveView = useEditorStore((state) => state.setActiveView);

  return (
    <div
      className="flex items-center justify-between px-2 py-1.5"
      style={{
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded transition-colors"
          style={{ color: "var(--text-muted)" }}
          title="Toggle sidebar"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Center: View Tabs */}
      <div
        className="flex items-center rounded-md p-0.5"
        style={{ background: "var(--bg-secondary)" }}
      >
        <button
          onClick={() => setActiveView("editor")}
          className="flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-all"
          style={{
            background:
              activeView === "editor" ? "var(--bg-active)" : "transparent",
            color:
              activeView === "editor"
                ? "var(--text-primary)"
                : "var(--text-muted)",
          }}
        >
          <FileText size={13} />
          Editor
        </button>
        <button
          onClick={() => setActiveView("graph")}
          className="flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-all"
          style={{
            background:
              activeView === "graph" ? "var(--bg-active)" : "transparent",
            color:
              activeView === "graph"
                ? "var(--text-primary)"
                : "var(--text-muted)",
          }}
        >
          <GitFork size={13} />
          Graph
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <div
          className="h-5 w-px"
          style={{ background: "var(--border-light)" }}
        />

        <button
          onClick={() => setPropertiesOpen(!propertiesOpen)}
          className="p-1.5 rounded transition-colors"
          style={{
            background: propertiesOpen ? "var(--bg-hover)" : "transparent",
            color: propertiesOpen ? "var(--accent)" : "var(--text-muted)",
          }}
          title="Toggle properties"
        >
          <PanelRight size={16} />
        </button>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded transition-colors"
          style={{ color: "var(--text-muted)" }}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </div>
  );
}
