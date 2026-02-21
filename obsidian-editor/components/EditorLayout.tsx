'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Editor from './Editor';
import PropertiesPanel from './PropertiesPanel';
import Toolbar from './Toolbar';
import { useEditorStore } from '@/lib/store';

export default function EditorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(true);
  const currentDocument = useEditorStore((state) => state.currentDocument);

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#121212] text-[#333] dark:text-[#dcddde]">
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
      )}

      {/* Main Editor Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <Toolbar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          propertiesOpen={propertiesOpen}
          setPropertiesOpen={setPropertiesOpen}
        />

        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          <Editor />
          {propertiesOpen && <PropertiesPanel />}
        </div>
      </div>
    </div>
  );
}
