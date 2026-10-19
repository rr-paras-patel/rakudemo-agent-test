import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ThemeToggle from "@/components/ThemeToggle";
import { THEME_KEY } from "@/lib/theme";

let systemDark = false;
const listeners = new Set<() => void>();

beforeEach(() => {
  systemDark = false;
  listeners.clear();
  document.documentElement.classList.remove("dark");
  vi.stubGlobal("matchMedia", (query: string) => ({
    get matches() {
      return systemDark;
    },
    media: query,
    addEventListener: (_: string, l: () => void) => listeners.add(l),
    removeEventListener: (_: string, l: () => void) => listeners.delete(l),
  }));
});

describe("ThemeToggle", () => {
  it("offers exactly Light, Dark and System, defaulting to System", () => {
    render(<ThemeToggle />);
    const select = screen.getByLabelText("Theme") as HTMLSelectElement;
    expect([...select.options].map((o) => o.text)).toEqual(["Light", "Dark", "System"]);
    expect(select.value).toBe("system");
  });

  it("follows the device in system mode and updates live", () => {
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    systemDark = true;
    listeners.forEach((l) => l());
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("overrides the device and saves the choice", async () => {
    systemDark = true;
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    await userEvent.selectOptions(screen.getByLabelText("Theme"), "light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(window.localStorage.getItem(THEME_KEY)).toBe('"light"');
  });
});
