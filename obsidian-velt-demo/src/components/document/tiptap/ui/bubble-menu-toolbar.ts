import { createToolbarButton } from "./toolbar-button";
import { createToolbarDivider } from "./toolbar-divider";
import {
  imgTablerIconBold,
  imgTablerIconItalic,
  imgTablerIconStrikethrough,
  imgTablerIconUnderline,
} from "../constants";
import type { Editor } from "@tiptap/core";

interface BubbleMenuOptions {
  editor: Editor;
  onAddComment: () => void;
}

export function createBubbleMenuToolbar({
  editor,
  onAddComment,
}: BubbleMenuOptions): HTMLElement {
  const toolbar = document.createElement("div");
  toolbar.className =
    "bubble-menu rounded-full p-[6px] flex gap-[4px] items-center";

  const updateToolbar = () => {
    toolbar.innerHTML = "";

    const formattingGroup = document.createElement("div");
    formattingGroup.className = "flex gap-[4px] items-center relative shrink-0";

    formattingGroup.appendChild(
      createToolbarButton({
        icon: imgTablerIconBold,
        alt: "Bold",
        active: editor.isActive("bold"),
        onClick: () => editor.chain().focus().toggleBold().run(),
      }),
    );

    formattingGroup.appendChild(
      createToolbarButton({
        icon: imgTablerIconItalic,
        alt: "Italic",
        active: editor.isActive("italic"),
        onClick: () => editor.chain().focus().toggleItalic().run(),
      }),
    );

    formattingGroup.appendChild(
      createToolbarButton({
        icon: imgTablerIconStrikethrough,
        alt: "Strikethrough",
        active: editor.isActive("strike"),
        onClick: () => editor.chain().focus().toggleStrike().run(),
      }),
    );

    formattingGroup.appendChild(
      createToolbarButton({
        icon: imgTablerIconUnderline,
        alt: "Underline",
        active: editor.isActive("underline"),
        onClick: () => editor.chain().focus().toggleUnderline().run(),
      }),
    );

    toolbar.appendChild(formattingGroup);
    toolbar.appendChild(createToolbarDivider());

    const commentButton = document.createElement("button");
    commentButton.className =
      "flex items-center justify-center p-[6px] hover:bg-white/10 rounded-full transition-all cursor-pointer";
    commentButton.title = "Add comment";
    commentButton.style.border = "none";
    commentButton.style.background = "transparent";

    const isDark = document.documentElement.classList.contains("dark");
    const strokeColor = isDark ? "white" : "#333";

    commentButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="${strokeColor}">
        <path
          d="M10 17.25H4C3.30964 17.25 2.75 16.6904 2.75 16V10C2.75 5.99594 5.99594 2.75 10 2.75C14.0041 2.75 17.25 5.99594 17.25 10C17.25 14.0041 14.0041 17.25 10 17.25Z"
          stroke-width="1.5"
        />
      </svg>
    `;

    commentButton.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onAddComment();
    });

    toolbar.appendChild(commentButton);
  };

  editor.on("selectionUpdate", updateToolbar);
  editor.on("transaction", updateToolbar);
  updateToolbar();

  return toolbar;
}
