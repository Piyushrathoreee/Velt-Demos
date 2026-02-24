const tableOfContentsItems = [
  { id: "abstract", label: "Abstract" },
  { id: "introduction", label: "Introduction" },
  { id: "background", label: "Background" },
  { id: "model-architecture", label: "Model Architecture" },
  { id: "why-self-attention", label: "Why Self-Attention" },
  { id: "training", label: "Training" },
  { id: "results", label: "Results" },
  { id: "conclusion", label: "Conclusion" },
  { id: "references", label: "References" },
];

interface SidebarOptions {
  onScrollToHeading?: (headingText: string) => void;
}

export function createSidebar(
  container: HTMLElement,
  options: SidebarOptions = {},
) {
  const { onScrollToHeading } = options;
  let activeItem = "abstract";

  const sidebar = document.createElement("div");
  sidebar.className = "obsidian-sidebar";

  function render() {
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="vault-icon">#</div>
        <span style="font-size: 14px; font-weight: 600; color: var(--text-primary); letter-spacing: 0.02em;">My Vault</span>
      </div>

      <div class="sidebar-search" style="position: relative;">
        <div style="position: relative;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 10px; top: 9px; color: var(--text-muted);">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search..." style="padding-left: 30px;" />
        </div>
      </div>

      <div style="padding: 8px 16px; display: flex; align-items: center; gap: 8px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.6;">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <span style="font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; color: var(--text-muted);">Table of Contents</span>
      </div>

      <div class="toc-section" id="toc-items">
        ${tableOfContentsItems
          .map(
            (item) => `
          <button class="toc-item ${activeItem === item.id ? "active" : ""}" data-id="${item.id}">
            <div class="indicator"></div>
            <span>${item.label}</span>
          </button>
        `,
          )
          .join("")}
      </div>

      <div class="sidebar-footer">
        ${tableOfContentsItems.length} sections · Collaborative
      </div>
    `;

    const tocItems = sidebar.querySelectorAll(".toc-item");
    tocItems.forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-id");
        if (id) {
          activeItem = id;
          render();
          if (onScrollToHeading) {
            const tocItem = tableOfContentsItems.find((t) => t.id === id);
            if (tocItem) onScrollToHeading(tocItem.label);
          }
        }
      });
    });
  }

  render();
  container.appendChild(sidebar);

  return {
    el: sidebar,
    setCollapsed(collapsed: boolean) {
      if (collapsed) {
        sidebar.classList.add("collapsed");
      } else {
        sidebar.classList.remove("collapsed");
      }
    },
    destroy() {
      sidebar.remove();
    },
  };
}
