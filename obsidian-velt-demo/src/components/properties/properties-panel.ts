export function createPropertiesPanel(container: HTMLElement) {
  const panel = document.createElement("div");
  panel.className = "obsidian-properties";

  function render() {
    const editorContent = document.querySelector(
      ".tiptap-editor-content .ProseMirror",
    );
    const text = editorContent?.textContent || "";
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    panel.innerHTML = `
      <div class="properties-section">
        <div class="properties-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>Properties</span>
        </div>
      </div>

      <div class="properties-section">
        <div class="properties-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Name</span>
        </div>
        <div class="properties-value">Attention Is All You Need</div>
      </div>

      <div class="properties-section">
        <div class="properties-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Created</span>
        </div>
        <div class="properties-value">${dateStr}</div>
      </div>

      <div class="properties-section">
        <div class="properties-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Modified</span>
        </div>
        <div class="properties-value">${dateStr}</div>
      </div>

      <div class="properties-section">
        <div class="properties-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>Words</span>
        </div>
        <div class="properties-value">${wordCount}</div>
      </div>

      <div class="properties-section" style="border-bottom: none;">
        <div class="properties-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          <span>Tags</span>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px; padding-left: 20px;">
          <span style="padding: 2px 8px; font-size: 11px; border-radius: 4px; background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.25); color: var(--accent-light);"># transformer</span>
          <span style="padding: 2px 8px; font-size: 11px; border-radius: 4px; background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.25); color: var(--accent-light);"># research</span>
          <span style="padding: 2px 8px; font-size: 11px; border-radius: 4px; background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.25); color: var(--accent-light);"># attention</span>
        </div>
      </div>

      <div class="properties-section" style="margin-top: auto; border-top: 1px solid var(--border); border-bottom: none;">
        <div class="properties-label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>Collaboration</span>
        </div>
        <div class="properties-value" style="font-size: 12px; opacity: 0.7;">
          Real-time CRDT · Velt Powered
        </div>
      </div>
    `;
  }

  render();

  const interval = setInterval(() => render(), 5000);

  container.appendChild(panel);

  return {
    el: panel,
    setCollapsed(collapsed: boolean) {
      if (collapsed) {
        panel.classList.add("collapsed");
      } else {
        panel.classList.remove("collapsed");
      }
    },
    destroy() {
      clearInterval(interval);
      panel.remove();
    },
  };
}
