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

  return {
    el: wrapper,
    destroy() {
      wrapper.remove();
    },
  };
}
