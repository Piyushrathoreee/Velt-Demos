"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
import PropertiesPanel from "./PropertiesPanel";
import Toolbar from "./Toolbar";
import GraphView from "./GraphView";
import { useEditorStore } from "@/lib/store";

export default function EditorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const activeView = useEditorStore((state) => state.activeView);

  return (
    <div
      className="flex h-screen w-full"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-secondary)",
      }}
    >
      {/* Sidebar */}
      {sidebarOpen && <Sidebar />}

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <Toolbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          propertiesOpen={propertiesOpen}
          setPropertiesOpen={setPropertiesOpen}
        />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {activeView === "editor" ? <Editor /> : <GraphView />}
          {propertiesOpen && activeView === "editor" && <PropertiesPanel />}
        </div>
      </div>
    </div>
  );
}
