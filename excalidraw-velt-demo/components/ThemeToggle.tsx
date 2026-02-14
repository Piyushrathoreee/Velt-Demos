"use client";

import { useVeltClient } from "@veltdev/react";
import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  setThemePreference,
  subscribeToTheme,
} from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { client } = useVeltClient();
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  useEffect(() => {
    if (client) {
      client.setDarkMode(isDark);
    }
  }, [client, isDark]);

  const toggleTheme = () => {
    setThemePreference(!isDark);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-white transition-colors hover:bg-slate-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 ${className}`}
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px] text-neutral-700 dark:text-neutral-200" />
      ) : (
        <Moon className="h-[18px] w-[18px] text-slate-700 dark:text-slate-200" />
      )}
    </button>
  );
}
