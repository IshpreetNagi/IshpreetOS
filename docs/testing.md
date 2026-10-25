# Testing and phase gate

The [handbook](planning/PROJECT_HANDBOOK.md#17-testing-and-quality-strategy) defines the quality policy. This document explains the commands and checks currently implemented.

## Local setup

Use Node 22 (at least 22.14; `.node-version` supplies the CI major) and the exact pnpm version in `package.json`. Install the pinned package manager if necessary:

```bash
npm install --global pnpm@11.11.0
pnpm install --frozen-lockfile
```

Copy the example environment file once. In PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Use `cp .env.example .env.local` on macOS/Linux. Do not overwrite an existing local configuration. `NEXT_PUBLIC_SITE_URL=http://localhost:3000` supports local production builds. Deployed builds need the intended public origin in Vercel's environment configuration.

Start the app with `pnpm dev`, then open [localhost:3000](http://localhost:3000). For a local production run, use `pnpm build` followed by `pnpm start`.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm lint` | ESLint for application, configuration, validation scripts, and tests |
| `pnpm typecheck` | Generate Next.js route types, then run strict TypeScript checks |
| `pnpm content:validate` | Check local Markdown frontmatter/YAML syntax, then validate the required site file through its shared parser and Zod schema; other content contracts are pending |
| `pnpm test` | Run Vitest unit/component tests once |
| `pnpm test:watch` | Run Vitest while editing |
| `pnpm build` | Validate startup configuration and build the production application |
| `pnpm check:all` | Run lint, type checks, content validation, unit tests, and production build in sequence |
| `pnpm test:e2e` | Run Playwright Chromium journeys |
| `pnpm test:all` | Run unit/component and browser tests |

`next typegen` avoids relying on stale or missing generated route types in a fresh checkout. Run type checking and building sequentially when validating the final gate because they both use `.next` output.

## Test placement and current coverage

- Unit and component tests live beside the module they verify.
- Shared setup belongs in `src/test`.
- Full browser journeys belong in `e2e`.
- `src/server/env/schema.test.ts` tests defaults, explicit production configuration, invalid URLs, and sanitized error output.
- `scripts/validate-content.test.ts` uses temporary fixture directories to exercise recursive validation and malformed Markdown/YAML.
- `scripts/validate-content-contracts.test.ts` launches the real `tsx` contract command in temporary content directories to check successful validation and exit code 1 for missing files, syntax errors, duplicate keys, and invalid site fields. It does not modify the real `site.yaml`.
- The existing page and Base UI button tests verify basic rendering. The home browser test verifies a visible main landmark, the project heading, and page metadata.

The validator's filesystem tests use Node; UI tests use jsdom. Later phases add reducer, geometry, routing, integration, and real-device coverage as their behavior is implemented. Do not replace meaningful invariant coverage with arbitrary project-wide percentages.

## Browser checks

Install Chromium once:

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

Playwright starts `pnpm dev` locally. With `CI=true`, it builds and starts the production app. Use the CI path when verifying production behavior locally; on PowerShell, set `$env:CI = 'true'` for that invocation and restore the prior value afterward. The production path needs `NEXT_PUBLIC_SITE_URL` through `.env.local` or the process environment.

CI installs Chromium and Linux browser dependencies. On browser failures it uploads the report and test results for seven days. Later tasks add browser engines and real-device checks according to the handbook.

## CI and preview readiness

`.github/workflows/ci.yml` runs on pull requests to `main`, pushes to `main`, and manual dispatch. Its checks are **Lint**, **TypeScript**, **Content validation**, **Tests**, and **Build**. **E2E Tests** runs after those checks succeed and tests a production server.

Each job installs from the frozen lockfile, reads Node 22 from `.node-version`, and uses the package manager pinned in `package.json`. The workflow has read-only repository permissions and a public example site origin; external credentials are not required.

After the first successful remote run, require these checks in GitHub's rules for `main`. Enable Vercel's Git integration, previews for pull requests, and production deployment from `main`. These are remote account settings; the repository files make the project ready but do not configure the accounts.

## Phase completion

Before moving to dependent work:

1. The current task's acceptance criteria are met.
2. `pnpm check:all` passes, plus browser journeys relevant to the change.
3. CI passes on the branch's pull request.
4. Required device checks pass; P0 has no window/touch behavior yet.
5. Documentation matches the implemented behavior.
6. No abandoned dependency or unresolved critical/high-severity defect remains.

Use short-lived branches with tests and documentation in the same PR. Mark a Notion task In progress when work starts, and Done only after the acceptance criteria are verified. Local results do not prove that remote CI or Vercel previews have passed.
