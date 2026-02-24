interface ToolbarButtonOptions {
  icon: string;
  alt: string;
  active: boolean;
  onClick: () => void;
}

export function createToolbarButton({
  icon,
  alt,
  active,
  onClick,
}: ToolbarButtonOptions): HTMLElement {
  const button = document.createElement("div");
  const isDark = document.documentElement.classList.contains("dark");

  button.className = `box-border flex items-center p-[8px] rounded-[12px] shrink-0 cursor-pointer transition-all ${
    active
      ? isDark
        ? "bg-[rgb(255,255,255)]"
        : "bg-[rgb(30,30,30)]"
      : "hover:bg-white/10"
  }`;

  const filterActive = isDark
    ? "filter: brightness(0) saturate(100%) invert(9%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%);"
    : "filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(0deg) brightness(100%) contrast(100%);";

  const filterInactive = isDark
    ? "filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(0deg) brightness(100%) contrast(100%);"
    : "filter: brightness(0) saturate(100%) invert(9%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(92%);";

  button.innerHTML = `
    <div class="relative shrink-0 size-[20px] transition-all">
      <img
        alt="${alt}"
        class="block max-w-none size-full"
        src="${icon}"
        style="${active ? filterActive : filterInactive}"
      />
    </div>
  `;

  button.addEventListener("click", onClick);
  return button;
}
