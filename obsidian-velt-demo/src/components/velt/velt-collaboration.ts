import { subscribeToTheme, getTheme } from "../../lib/theme";

export function createVeltCollaboration(container: HTMLElement) {
  const wrapper = document.createElement("div");
  wrapper.id = "velt-collaboration";

  const comments = document.createElement("velt-comments");
  comments.setAttribute("text-mode", "false");
  comments.setAttribute("shadow-dom", "false");
  wrapper.appendChild(comments);

  const sidebar = document.createElement("velt-comments-sidebar");
  wrapper.appendChild(sidebar);

  container.appendChild(wrapper);

  function applyDarkMode() {
    const isDark = getTheme() === "dark";
    const elements = wrapper.querySelectorAll(
      "velt-comments, velt-comments-sidebar",
    );
    elements.forEach((el) => {
      if (isDark) {
        el.setAttribute("dark-mode", "true");
      } else {
        el.removeAttribute("dark-mode");
      }
    });
  }

  applyDarkMode();
  subscribeToTheme(() => applyDarkMode());

  return {
    el: wrapper,
    destroy() {
      wrapper.remove();
    },
  };
}
