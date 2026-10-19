# QA v2 · issue #1 · PR #6 @ 72f5f53

| AC | Result | Proof |
|---|---|---|
| 1 control offers Light, Dark, System | pass | tests/unit/theme-toggle.test.tsx, theme.spec.ts:6 |
| 2 System follows device live | pass | theme.spec.ts:6 |
| 3 override survives reload | pass | theme.spec.ts:23 |
| 4 default System, no flash | pass | theme.spec.ts:15 |
| 5 six pages readable in both themes | pass | theme.spec.ts:51 contrast scan (light and dark) green; v1 failure fixed |
| 6 unit + e2e tests | pass | 48/48 theme-related unit, 6/6 theme e2e |

Local tests: `npm run typecheck && npx vitest run` (3 pre-existing `tests/regression/*` fail, same on staging); `PORT=3921 npx playwright test theme`

The contrast scan skips gradient backgrounds (hero), checked by eye in the screenshots.
