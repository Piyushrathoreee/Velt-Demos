"use client";

import { MousePointer2, Pen, Image, Type, Settings } from "lucide-react";

interface LeftToolbarProps {
  onAddImage: () => void;
}

const tools = [
  {
    id: "image",
    icon: Image,
    label: "Add Image",
  },
  {
    id: "pointer",
    icon: MousePointer2,
    label: "Select",
  },
  {
    id: "draw",
    icon: Pen,
    label: "Draw",
  },

  { id: "text", icon: Type, label: "Text" },
];

export function LeftToolbar({ onAddImage }: LeftToolbarProps) {
  return (
    <div className="w-14 bg-white dark:bg-[#2c2c2c] border-r border-gray-200 dark:border-[#404040] flex flex-col items-center py-4 gap-2 relative transition-colors duration-200">
      {tools.map((tool) => (
        <div key={tool.id} className="relative group">
          <button
            onClick={() => {
              if (tool.id === "image") {
                onAddImage();
              }
            }}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              // activeTool === tool.id

              "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#404040]"
            }`}
          >
            {tool.icon && <tool.icon className="w-5 h-5" />}
          </button>
        </div>
      ))}

      <div className="flex-1" />

      {/* Divider */}
      <div className="w-8 h-px bg-gray-200 dark:bg-[#404040] my-2" />

      {/* Additional tools */}
      <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#404040] transition-colors group relative">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}
