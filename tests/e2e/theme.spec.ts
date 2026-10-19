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
});
