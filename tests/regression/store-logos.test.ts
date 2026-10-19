import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { stores } from "@/data/stores";

describe("regression: every store logo points at an existing file", () => {
  it.each(stores.map((s) => [s.id, s.logo]))("%s logo exists under public/", (_id, logo) => {
    expect(logo.startsWith("/")).toBe(true);
    const file = path.join(process.cwd(), "public", logo);
    expect(fs.existsSync(file)).toBe(true);
  });
});
