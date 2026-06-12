# AGENTS.md

## Stack

React 19, TypeScript 6, Vite 8, Tailwind v4, shadcn/ui (radix-nova, data-slot attrs), React Router v7, Firebase Auth, Leaflet maps, Recharts.

## Commands

| Command          | Action                                    |
| ---------------- | ----------------------------------------- |
| `yarn dev`       | Vite dev server                           |
| `yarn build`     | `tsc -b && vite build` (typecheck first!) |
| `yarn lint`      | ESLint on all files                       |
| `yarn format`    | Prettier write (singleQuote, semi)        |
| `yarn storybook` | Storybook on :6006                        |
| `yarn preview`   | Vite preview                              |

No `yarn test` — Vitest configured in `vite.config.ts` (Playwright + Storybook addon) but no script. Tests in `.stories.tsx` files, run via Storybook.

**Husky pre-commit**: `yarn format && yarn lint && yarn build` — format+lint+build gate every commit.

## Conventions

- **Path alias**: `@/` → `src/` (tsconfig + vite resolve)
- **Components**: `src/components/<Name>/<name>.tsx` + `<name>.stories.tsx`. Variants via `cva` in separate file.
- **shadcn/ui**: `src/components/ui/`. All use `cn()` from `@/lib/utils` + `data-slot` attrs.
- **Styles**: Tailwind v4 only, `cn()` for merging. No CSS modules, no styled-components.
- **Dark mode**: `next-themes` — class-based, `.dark` variants in `index.css`.
- **Forms**: `formik` + `yup` for validation.
- **Toasts**: `sonner` via `<Toaster>` in `App.tsx`.
- **Types**: `verbatimModuleSyntax: true` → `import type` for type-only. `noUnusedLocals`/`noUnusedParameters` on.
- **API**: `src/services/api.ts` — Axios + `axios-case-converter` (auto snake_case ↔ camelCase). Auth token from `localStorage` attached as Bearer.
- **Routes**: `src/App.tsx` — 3 role guards: `citizen`, `admin`, `health` via `<ProtectedRoute>`.
- **Auth flow**: Firebase `signInWithEmailAndPassword` → `getIdToken` → localStorage + backend `/auth/me` for profile. Token/user persisted in localStorage.
- **Env vars**: All `VITE_*`. Passed as Docker build-args: `VITE_API_URL`, `VITE_FIREBASE_*`, `VITE_GOOGLE_MAPS_API_KEY`.
- **React Compiler**: enabled via `@rolldown/plugin-babel` + `reactCompilerPreset()` in vite config.

## Architecture

- **Entry**: `src/main.tsx` → `<AuthProvider>` → `<App>` (BrowserRouter)
- **Pages**: `src/pages/*.tsx` (flat, one per route)
- **Services**: `src/services/` — one file per domain (reportService.ts, stockService.ts, etc.)
- **Common types**: `src/common/` — shared API response interfaces
- **Config**: `src/config/index.ts` reads `import.meta.env.VITE_API_URL`
- **Hooks**: `src/hooks/` — custom React hooks
- **Storybook**: `.storybook/main.ts` — scans `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)`. Addons: chromatic, vitest, a11y, docs.

## Deployment

- Cloud Build → Docker → Cloud Run. `cloudbuild.yaml` pushes to Artifact Registry.
- Build args: `_VITE_API_URL`, `_VITE_FIREBASE_*` (substitutions map to `VITE_*`).
- Docker: multi-stage (`node:22-alpine` build → `nginx:1.27-alpine` serve).
- nginx serves `dist/` on port 8080, SPA fallback (try_files), 1y cache on static assets.

## Gotchas

- Build runs `tsc -b` **before** `vite build` — type errors block production build.
- `src/common/ReportData .ts` has trailing space in filename — breaks scripts that don't quote paths.
- `CLAUDE.md` is gitignored — do not create one, use AGENTS.md instead.
- `.claude/skills/add-component.md` has team component-creation workflow (Spanish).
- `docs/` is gitignored — local scratchpad, not committed.
- `.env` is gitignored via `/**/*.env` pattern — credentials never committed.

# Unit & Integration Testing — React / Expo

## Stack

| Tool                      | Role                                             |
| ------------------------- | ------------------------------------------------ |
| **Jest**                  | Test runner, mocks, assertions, coverage reports |
| **React Testing Library** | Component queries & interactions (web)           |

---

## Anatomy of a Test

```js
describe('LoginForm', () => {
  test('calls onLogin on submit', () => {
    // Arrange — set up data, mocks, render
    // Act    — trigger the action
    // Assert — verify the outcome
  });
});
```

Always follow **AAA (Arrange → Act → Assert)**. One test = one behavior.

---

## Unit Tests — for logic

Target: utility functions, custom hooks, validators, pure business logic.

```js
test('formats currency correctly', () => {
  expect(formatCurrency(1000)).toBe('$1,000.00');
});
```

Use mocks to isolate external dependencies:

```js
jest.mock('axios');
axios.get.mockResolvedValue({ data: [{ id: 1 }] });
```

Clean mocks between tests with `afterEach(() => jest.clearAllMocks())`.

---

## Integration Tests — for flows

Target: component + state + API working together.

```js
jest.mock('./api', () => ({
  getUsers: jest.fn().mockResolvedValue([{ id: 1, name: 'Ana' }]),
}));

test('renders users after load', async () => {
  render(<UserList />);
  const item = await screen.findByText('Ana'); // findBy* = async
  expect(item).toBeInTheDocument();
});
```

---

## Test IDs

Add them in markup when text/classes are unstable or for E2E selectors.

**React (web)**

```jsx
<button data-testid="btn-login">Sign in</button>
```

**React Native / Expo**

```jsx
<TouchableOpacity testID="btn-login">...</TouchableOpacity>
```

**Naming convention** — prefix by element type, describe intent not appearance:

| Prefix   | Use for                         |
| -------- | ------------------------------- |
| `btn-`   | Buttons and tappable actions    |
| `input-` | Form fields                     |
| `txt-`   | Titles, labels, visible content |
| `card-`  | Container / card sections       |
| `lbl-`   | Error messages, descriptors     |

`btn-submit-form` · `input-email` · `lbl-error-password`

Treat test IDs like a public API — rename intentionally, not casually.

## Coverage Target

Run with `jest --coverage`. Aim for **70–80%** on critical paths.  
100% is not the goal — untested UI animations and trivial wrappers are fine to skip.  
Focus coverage on: business logic, form validation, data transformations, async flows.

---

## Common Mistakes

- **Testing implementation** instead of behavior — if you refactor without changing behavior, no test should break
- **Over-mocking** — if everything is mocked, you're testing the mocks
- **Skipping `clearAllMocks()`** — stale mocks cause false positives across tests
- **Using `getByTestId` when `getByRole` exists** — prefer semantic queries; test IDs are a fallback
- **Generic test ID names** — `button1` becomes ambiguous fast; name by intent

---

## Recommended Strategy

```
Many unit tests (logic) + a few integration tests (flows) = max coverage, min maintenance cost
```

1. Start with the functions/flows that cause the most damage if they break
2. Unit test all pure logic and custom hooks
3. Integration test key UI flows (login, form submit, data load)
4. Add E2E (Cypress/Detox) only for the most critical user journeys
5. Run everything in CI on every PR; block merges on failure
