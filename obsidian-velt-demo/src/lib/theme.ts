import { setVeltDarkMode } from "./velt";

type Theme = "dark" | "light";

const STORAGE_KEY = "obsidian-velt-theme";

let currentTheme: Theme = "dark";
const listeners: Array<(theme: Theme) => void> = [];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  setVeltDarkMode(theme === "dark");
}

export function getTheme(): Theme {
  return currentTheme;
}

export function initializeTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  currentTheme = saved || "dark";
  applyTheme(currentTheme);
  return currentTheme;
}

export function toggleTheme(): Theme {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(currentTheme);
  localStorage.setItem(STORAGE_KEY, currentTheme);
  notifyListeners();
  return currentTheme;
}

export function subscribeToTheme(callback: (theme: Theme) => void) {
  listeners.push(callback);
  callback(currentTheme);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

function notifyListeners() {
  listeners.forEach((cb) => cb(currentTheme));
}
