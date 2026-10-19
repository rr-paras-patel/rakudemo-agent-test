import { describe, expect, it } from "vitest";
import { THEME_KEY, parseThemeMode, resolveTheme, themeStore } from "@/lib/theme";

describe("parseThemeMode", () => {
  it("accepts the three modes", () => {
    expect(parseThemeMode("light")).toBe("light");
    expect(parseThemeMode("dark")).toBe("dark");
    expect(parseThemeMode("system")).toBe("system");
  });

  it("falls back to system for anything else", () => {
    expect(parseThemeMode(null)).toBe("system");
    expect(parseThemeMode("purple")).toBe("system");
    expect(parseThemeMode(42)).toBe("system");
  });
});

describe("resolveTheme", () => {
  it("follows the device in system mode", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("lets light and dark override the device", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});

describe("themeStore", () => {
  it("defaults to system with nothing saved", () => {
    expect(themeStore.read()).toBe("system");
  });

  it("persists the chosen mode in localStorage", () => {
    themeStore.write("dark");
    expect(window.localStorage.getItem(THEME_KEY)).toBe('"dark"');
    expect(themeStore.read()).toBe("dark");
  });

  it("treats a corrupt saved value as system", () => {
    window.localStorage.setItem(THEME_KEY, '"neon"');
    expect(themeStore.read()).toBe("system");
  });
});
