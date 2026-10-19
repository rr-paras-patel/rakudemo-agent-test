import { createLocalStore } from "@/lib/local-store";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_KEY = "rakudemo:theme";
export const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];

export function parseThemeMode(value: unknown): ThemeMode {
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

export function resolveTheme(mode: ThemeMode, systemDark: boolean): ResolvedTheme {
  if (mode === "system") return systemDark ? "dark" : "light";
  return mode;
}

const rawStore = createLocalStore<unknown>(THEME_KEY, "system");

export const themeStore = {
  read: () => parseThemeMode(rawStore.read()),
  write: (mode: ThemeMode) => rawStore.write(mode),
  subscribe: rawStore.subscribe,
  getServerSnapshot: () => "system" as ThemeMode,
};

/** Runs inline in <head> before first paint; mirrors resolveTheme. */
export const themeInitScript = `(function(){try{var m="system";try{var v=JSON.parse(localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)})||"null");if(v==="light"||v==="dark")m=v}catch(e){}var d=m==="dark"||(m==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})()`;
