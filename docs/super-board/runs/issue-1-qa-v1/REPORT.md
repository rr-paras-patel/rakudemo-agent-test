# QA v1 · issue #1 · PR #6 @ e10de76

Result: FAIL (AC5)

| AC | Result | Proof |
|---|---|---|
| 1 Header control Light/Dark/System | pass | `tests/unit/theme-toggle.test.tsx`, `tests/e2e/theme.spec.ts:6` |
| 2 System follows device live | pass | `tests/e2e/theme.spec.ts:6` |
| 3 Override survives reload | pass | `tests/e2e/theme.spec.ts:23` |
| 4 No flash on first load | pass | `tests/e2e/theme.spec.ts:15` (class set before React) |
| 5 All pages readable in both themes | FAIL | `text-raku-700` (#be123c) on dark surface `#1e293b` = 2.33:1; "Cash Back" rates, "Demo" logo word, "See all", "Browse stores", account balance |
| 6 Unit + e2e tests exist | pass | 48/48 unit, 4/4 theme e2e |

Local tests: `npm run typecheck && npx vitest run` = 48 pass, 3 fail (pre-existing `tests/regression/*`, unrelated files); `npx playwright test theme` = 4/4 (PORT=3917; default 3100 was held by another app).
Contrast scan: dark theme, 6 pages, text under 3:1 listed above on every page.
