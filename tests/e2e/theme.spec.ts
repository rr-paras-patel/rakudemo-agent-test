import { expect, test } from "@playwright/test";

const html = "html";

test.describe("theme modes", () => {
  test("system is the default and follows the device live", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.getByLabel("Theme")).toHaveValue("system");
    await expect(page.locator(html)).toHaveClass(/dark/);
    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator(html)).not.toHaveClass(/dark/);
  });

  test("first paint already has the right theme (no flash)", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/", { waitUntil: "commit" });
    await page.waitForSelector("body");
    // The inline head script sets the class before any React code runs.
    expect(await page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(true);
  });

  test("explicit choice overrides the device and survives a reload", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.getByLabel("Theme").selectOption("dark");
    await expect(page.locator(html)).toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator(html)).toHaveClass(/dark/);
    await expect(page.getByLabel("Theme")).toHaveValue("dark");

    await page.getByLabel("Theme").selectOption("light");
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();
    await expect(page.locator(html)).not.toHaveClass(/dark/);
  });

  test("every page is themed and keeps its content", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Theme").selectOption("dark");
    for (const path of ["/", "/stores", "/stores/nike", "/trips", "/favorites", "/account"]) {
      await page.goto(path);
      await expect(page.locator(html)).toHaveClass(/dark/);
      await expect(page.locator("main")).toBeVisible();
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg).toBe("rgb(15, 23, 42)");
    }
  });

  for (const scheme of ["light", "dark"] as const) {
    test(`text keeps 4.5:1 contrast on every page in ${scheme}`, async ({ page }) => {
      await page.goto("/");
      await page.getByLabel("Theme").selectOption(scheme);
      for (const path of ["/", "/stores", "/stores/nike", "/trips", "/favorites", "/account"]) {
        await page.goto(path);
        const low = await page.evaluate(() => {
          const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
          const lum = ([r, g, b]: number[]) => {
            const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
            return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
          };
          const bgOf = (el: Element | null): number[] | null => {
            for (; el; el = el.parentElement) {
              const cs = getComputedStyle(el);
              if (cs.backgroundImage !== "none") return null; // gradient: skip
              const [r, g, b, a = 1] = parse(cs.backgroundColor);
              if (a > 0.99) return [r, g, b];
            }
            return [255, 255, 255];
          };
          const bad: string[] = [];
          for (const el of Array.from(document.querySelectorAll("main *, header *, footer *"))) {
            const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent?.trim());
            if (!own) continue;
            const bg = bgOf(el);
            if (!bg) continue;
            const fg = parse(getComputedStyle(el).color).slice(0, 3);
            const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
            const ratio = (a + 0.05) / (b + 0.05);
            if (ratio < 4.5) bad.push(`${el.tagName} "${el.textContent?.trim().slice(0, 20)}" ${ratio.toFixed(2)}`);
          }
          return bad;
        });
        expect(low, `${path} in ${scheme}`).toEqual([]);
      }
    });
  }
});
