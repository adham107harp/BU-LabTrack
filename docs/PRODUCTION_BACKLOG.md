# Production backlog

Updated at the end of every automated run.

## Done
- 2026-10-30: strict `tsconfig.json` + `npm run typecheck` (fixed 3 real type errors, removed version suffixes from shadcn imports).
- 2026-10-30: Vitest + Testing Library set up (`npm test`); 15 service-level tests covering student, instructor, technician and doctor demo flows.
- 2026-10-30: CI workflow (`.github/workflows/ci.yml`): typecheck, tests, build, build:demo.
- 2026-10-30: ESLint 9 flat config (`npm run lint`, errors fail CI; `any` and React-compiler rules are warnings for now). Login component tests (4 roles + failure path); suite is 20 tests.

## Next (highest value first)
1. Prettier config (needs a one-off repo-wide format commit), then burn down ESLint warnings (45 `any`, 8 react-hooks warnings: fetch-in-effect / hoisted callbacks in dashboards).
2. Component tests for the role dashboards, reservation and maintenance screens.
3. Playwright e2e against `build:demo`.
4. Token storage: JWT lives in `localStorage` (`authToken`) - XSS-readable; move to httpOnly cookie once the API supports it, or at minimum add expiry handling and clear on 401.
5. `api.ts` duplicates fetch/error handling per method and returns `any`; extract a typed `request()` helper; non-JSON error bodies currently throw on `response.json()`.
6. Accessibility audit (nav buttons, form labels, focus states, dialog semantics); error/loading states per screen.
7. Remove the unused vite alias block / unused deps; bundle-size budget (currently ~273 kB JS, 66 kB gzip).
8. README accuracy pass (scripts: typecheck, test).

## Risks
- `npm audit` reports vulnerabilities in the dependency tree; not yet triaged.
- Real REST API lives outside this repo; non-demo paths in `api.ts` are untested.
- Tests share mutable in-memory demo state and are order-dependent; add a reset hook to demoBackend and fake timers (suite takes ~8s due to simulated latency).
- Type `Dashboard.onNavigate` as `(tab: Tab) => void` to drop the cast in MainApp.
