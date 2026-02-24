import { DEMO_USERS, getCurrentUserIndex, switchUser } from "../../lib/user";
import { subscribeToTheme } from "../../lib/theme";

export function createUserSwitcher(container: HTMLElement) {
  const wrapper = document.createElement("div");
  wrapper.id = "user-switcher";

  function render() {
    const currentIndex = getCurrentUserIndex();
    const currentUser = DEMO_USERS[currentIndex];
    const isDark = document.documentElement.classList.contains("dark");

    wrapper.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9999;
      background: ${isDark ? "#2a2a2a" : "#ffffff"};
      padding: 10px 14px;
      border-radius: 12px;
      box-shadow: ${isDark ? "0 4px 24px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.12)"};
      border: 1px solid ${isDark ? "#3a3a3a" : "#e8e8e8"};
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: Inter, system-ui, sans-serif;
      transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
    `;

    wrapper.innerHTML = `
      <img
        src="${currentUser.photoUrl}"
        alt="${currentUser.name}"
        style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid ${currentUser.color};
          flex-shrink: 0;
        "
      />

      <div style="display: flex; flex-direction: column; gap: 1px;">
        <span style="
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          color: ${isDark ? "#888" : "#999"};
        ">Switch User</span>

        <div style="position: relative;">
          <select
            id="user-select"
            style="
              padding: 3px 22px 3px 6px;
              border: 1px solid ${isDark ? "#444" : "#ddd"};
              border-radius: 5px;
              font-size: 13px;
              font-weight: 500;
              cursor: pointer;
              appearance: none;
              -webkit-appearance: none;
              background: ${isDark ? "#333" : "#f9f9f9"};
              color: ${isDark ? "#e0e0e0" : "#333"};
              width: 100%;
              outline: none;
              font-family: Inter, system-ui, sans-serif;
            "
          >
            ${DEMO_USERS.map(
              (user, index) => `
              <option value="${index}" ${index === currentIndex ? "selected" : ""}>
                ${user.name}
              </option>
            `,
            ).join("")}
          </select>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${isDark ? "#aaa" : "#666"}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; right: 7px; top: 50%; transform: translateY(-50%); pointer-events: none;">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <div style="
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
        flex-shrink: 0;
      " title="Online"></div>
    `;

    const select = wrapper.querySelector("#user-select") as HTMLSelectElement;
    if (select) {
      select.addEventListener("change", (e) => {
        const newIndex = parseInt((e.target as HTMLSelectElement).value, 10);
        switchUser(newIndex);
      });
    }
  }

  render();

  subscribeToTheme(() => render());

  container.appendChild(wrapper);

  return {
    el: wrapper,
    destroy() {
      wrapper.remove();
    },
  };
}
