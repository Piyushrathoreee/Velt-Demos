"use client";

/**
 * Validates if the code is running in a browser environment
 */
const isBrowser = typeof window !== "undefined";

/**
 * Proxies localStorage to redirect specific keys to sessionStorage
 * This allows Velt to have isolated sessions per tab (using sessionStorage)
 * while the rest of the app continues to use localStorage.
 */
export function initStorageProxy() {
  if (!isBrowser) return;

  // Store the original localStorage implementation
  const originalLocalStorage = window.localStorage;
  const originalSessionStorage = window.sessionStorage;

  // Keys that should be redirected to sessionStorage
  // Velt uses keys starting with 'velt', 'snippyly', or '_v' (e.g., _viu, _vv)
  // Also proxying firebase keys as Velt likely uses them for auth/presence
  const isVeltKey = (key: string) => {
    const k = key.toLowerCase();
    return (
      k.startsWith("velt") ||
      k.startsWith("snippyly") ||
      k.startsWith("_v") ||
      k.startsWith("firebase")
    );
  };

  // Create a proxy object that implements the Storage interface
  const storageProxy = new Proxy(originalLocalStorage, {
    get(target, prop, receiver) {
      // Handle setItem
      if (prop === "setItem") {
        return (key: string, value: string) => {
          if (isVeltKey(key)) {
            console.log(
              `[StorageProxy] Redirecting setItem to sessionStorage: ${key}`,
            );
            return originalSessionStorage.setItem(key, value);
          }
          console.log(`[StorageProxy] setItem to localStorage: ${key}`);
          return originalLocalStorage.setItem(key, value);
        };
      }

      // Handle getItem
      if (prop === "getItem") {
        return (key: string) => {
          if (isVeltKey(key)) {
            const val = originalSessionStorage.getItem(key);
            console.log(
              `[StorageProxy] Redirecting getItem from sessionStorage: ${key} -> ${val ? "FOUND" : "NULL"}`,
            );
            return val;
          }
          // console.log(`[StorageProxy] getItem from localStorage: ${key}`);
          return originalLocalStorage.getItem(key);
        };
      }

      // Handle removeItem
      if (prop === "removeItem") {
        return (key: string) => {
          if (isVeltKey(key)) {
            console.log(
              `[StorageProxy] Redirecting removeItem to sessionStorage: ${key}`,
            );
            return originalSessionStorage.removeItem(key);
          }
          return originalLocalStorage.removeItem(key);
        };
      }

      // Handle clear
      if (prop === "clear") {
        return () => {
          // We probably shouldn't clear everything from both,
          // but for safety let's just clear localStorage as expected
          // and maybe remove Velt keys from sessionStorage?
          // For now, let's just forward to localStorage to be safe for the app.
          return originalLocalStorage.clear();
        };
      }

      // Handle key (index)
      if (prop === "key") {
        return (index: number) => {
          // This is tricky because we're splitting data.
          // For simplicity, we'll just forward to localStorage.
          // Velt likely doesn't iterate over keys this way for critical logic.
          return originalLocalStorage.key(index);
        };
      }

      // Handle length
      if (prop === "length") {
        return originalLocalStorage.length;
      }

      // Fallback to Reflect for other properties
      return Reflect.get(target, prop, receiver);
    },
  });

  // Override the global localStorage
  try {
    Object.defineProperty(window, "localStorage", {
      value: storageProxy,
      configurable: true,
      writable: true,
    });
    console.log("[Velt Demo] Storage proxy initialized for session isolation");
  } catch (err) {
    console.error("[Velt Demo] Failed to initialize storage proxy:", err);
  }
}
