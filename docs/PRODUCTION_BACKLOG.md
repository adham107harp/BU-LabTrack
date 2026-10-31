# Production backlog

Updated at the end of every automated run.

## Done
- 2026-10-30: strict `tsconfig.json` + `npm run typecheck` (fixed 3 real type errors, removed version suffixes from shadcn imports).
- 2026-10-30: Vitest + Testing Library set up (`npm test`); 15 service-level tests covering student, instructor, technician and doctor demo flows.
- 2026-10-30: CI workflow (`.github/workflows/ci.yml`): typecheck, tests, build, build:demo.
- 2026-10-30: ESLint 9 flat config (`npm run lint`, errors fail CI; `any` and React-compiler rules are warnings for now). Login component tests (4 roles + failure path); suite is 20 tests.

- 2026-10-30: Prettier (`npm run format` / `format:check`, enforced in CI; `src/components/ui` and docs excluded).
- 2026-10-31: `api.ts` refactor: one typed `request()` helper (+`ApiError`), safe non-JSON error bodies, network-failure message, 401 clears token only for authenticated calls, 204 handling; 7 unit tests. (Branch stacked on PR #5.)

## Next (highest value first)
1. Burn down ESLint warnings (45 `any`, 8 react-hooks warnings: fetch-in-effect / hoisted callbacks in dashboards).
2. Component tests for the role dashboards, reservation and maintenance screens.
3. Playwright e2e against `build:demo`.
4. Token storage: JWT lives in `localStorage` (`authToken`) - XSS-readable; move to httpOnly cookie once the API supports it, or at minimum add expiry handling and clear on 401.
5. Replace remaining `any` returns of `api.get/post/put` with per-endpoint typed wrappers; redirect to login on 401 (App-level listener).
6. Accessibility audit (nav buttons, form labels, focus states, dialog semantics); error/loading states per screen.
7. Remove the unused vite alias block / unused deps; bundle-size budget (currently ~273 kB JS, 66 kB gzip).
8. README accuracy pass (scripts: typecheck, test).

## Risks
- PRs #4, #5 and the api-request-helper PR are stacked and unmerged; merge in order #4 -> #5 -> helper.
- `npm audit` reports vulnerabilities in the dependency tree; not yet triaged.
- Real REST API lives outside this repo; non-demo paths in `api.ts` are untested.
- Tests share mutable in-memory demo state and are order-dependent; add a reset hook to demoBackend and fake timers (suite takes ~8s due to simulated latency).
- Type `Dashboard.onNavigate` as `(tab: Tab) => void` to drop the cast in MainApp.
