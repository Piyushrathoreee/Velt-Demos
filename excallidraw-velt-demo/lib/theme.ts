type ThemeListener = () => void;

const THEME_STORAGE_KEY = "theme";
const DARK_CLASS = "dark";
const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

export const getThemeSnapshot = (): boolean => {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains(DARK_CLASS);
};

export const getThemeServerSnapshot = (): boolean => false;

const readStoredTheme = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const resolveDarkModeFromPreference = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const stored = readStoredTheme();
  if (stored === "dark") return true;
  if (stored === "light") return false;

  return window.matchMedia(SYSTEM_DARK_QUERY).matches;
};

const applyDarkClass = (isDark: boolean): void => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle(DARK_CLASS, isDark);
  root.setAttribute("data-theme", isDark ? "dark" : "light");
};

export const applyThemeFromPreference = (): boolean => {
  const isDark = resolveDarkModeFromPreference();
  applyDarkClass(isDark);
  return isDark;
};

export const setThemePreference = (isDark: boolean): void => {
  applyDarkClass(isDark);

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  } catch {
    // Ignore storage failures; class toggle already applied.
  }
};

export const subscribeToTheme = (onStoreChange: ThemeListener): (() => void) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const root = document.documentElement;
  const classObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        onStoreChange();
        break;
      }
    }
  });

  classObserver.observe(root, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const media = window.matchMedia(SYSTEM_DARK_QUERY);

  const handleSystemChange = () => {
    if (readStoredTheme() !== null) {
      return;
    }
    applyDarkClass(media.matches);
    onStoreChange();
  };

  media.addEventListener("change", handleSystemChange);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) {
      return;
    }
    applyThemeFromPreference();
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    classObserver.disconnect();
    media.removeEventListener("change", handleSystemChange);
    window.removeEventListener("storage", handleStorage);
  };
};
