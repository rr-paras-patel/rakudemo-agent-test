"use client";

import { useEffect, useSyncExternalStore } from "react";
import { THEME_MODES, parseThemeMode, resolveTheme, themeStore, type ThemeMode } from "@/lib/theme";

const LABELS: Record<ThemeMode, string> = { light: "Light", dark: "Dark", system: "System" };

function applyTheme(mode: ThemeMode) {
  const dark = resolveTheme(mode, window.matchMedia("(prefers-color-scheme: dark)").matches) === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

export default function ThemeToggle() {
  const mode = useSyncExternalStore(themeStore.subscribe, themeStore.read, themeStore.getServerSnapshot);

  useEffect(() => {
    applyTheme(mode);
    if (mode !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(mode);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [mode]);

  return (
    <select
      aria-label="Theme"
      data-testid="theme-select"
      value={mode}
      onChange={(e) => themeStore.write(parseThemeMode(e.target.value))}
      className="rounded-full border border-slate-200 bg-surface px-3 py-1.5 text-sm font-medium text-slate-600"
    >
      {THEME_MODES.map((m) => (
        <option key={m} value={m}>
          {LABELS[m]}
        </option>
      ))}
    </select>
  );
}
