# Repository architecture

The [project handbook](planning/PROJECT_HANDBOOK.md) governs product behavior and the target architecture. This document records the foundation currently implemented and the boundaries later phases must follow.

Source task: [Foundation: Establish repository architecture, documentation, and CI](https://www.notion.so/3c8f4b74d2b58034b5f6d7803ca16bfb).

## Current state: P0 foundation and initial P1 contracts

- Next.js App Router and strict TypeScript remain the application foundation.
- `src/app/page.tsx` is a temporary IshpreetOS construction page. It loads the title and description from validated `content/site.yaml`; it does not implement the desktop.
- `src/app/layout.tsx` reads validated server configuration for initial metadata. Final content-derived metadata arrives with routing and content contracts.
- `src/server/env/schema.ts` defines a pure Zod parser. `src/server/env/index.ts` is the guarded `server-only` entry point application code imports.
- `next.config.ts` also calls the pure parser so startup, route type generation, and production builds validate configuration early. Configuration runs outside the React module graph, so it does not import the `server-only` entry point.
- `src/styles` owns initial tokens, document defaults, and font-role fallbacks. `src/app/globals.css` composes them with Tailwind and the existing shadcn stylesheet.
- `src/os/app-registry` defines the four application IDs, metadata, route lookup, the `/privacy` alias to Settings, and a separate dynamic component-loader map. These contracts do not implement Next.js application routes or desktop navigation yet.
- `src/apps` contains placeholder About, Projects, Experience, and Settings components; application interiors and windows are not implemented yet.
- `src/server/content` contains site, profile, project, and experience schemas and parsers, plus the shared Markdown parser and a server-only site loader. Profile/project/experience loaders, credits, and Markdown rendering remain pending.
- `scripts/validate-content.mjs` checks local Markdown frontmatter and YAML syntax. `scripts/validate-content-contracts.ts` then validates the site contract. `pnpm dev` and `pnpm build` run both stages through `pnpm content:validate` before starting Next.js; other content contracts are not connected to this command yet.
- Vitest, Testing Library, and Playwright verify the foundation. GitHub Actions runs the quality checks on pull requests to `main` and pushes to `main`.

The starter page, demo SVGs, generated favicon, Google-font downloads, dark-theme defaults, animation CSS dependency, and analytics runtime have been removed. Local licensed fonts and analytics return in their approved implementation phases.

## Folder ownership

| Path | Responsibility | Introduced |
| --- | --- | --- |
| `src/app` | Next.js pages, layouts, metadata, route handlers, and error boundaries | Existing foundation |
| `src/components/ui` | Foundational UI primitives; the Base UI button remains available | Existing foundation |
| `src/lib` | Small generic utilities such as `cn` | Existing foundation |
| `src/os/app-registry` | Static application definitions, lookup, navigation targets, and the component-loader map | P1 |
| `src/apps` | Placeholder application components; final interiors arrive later | P1 |
| `src/server/content` | Local-content schemas, pure parsers, and the guarded site loader | P1 |
| `src/server/env` | Environment schemas and guarded server configuration | P0 |
| `src/styles` | Shared design tokens, base rules, and font roles | P0 |
| `src/test` | Shared test setup and content fixtures | Existing foundation; fixtures added in P1 |
| `content` | Local portfolio Markdown/YAML; currently placeholder `site.yaml`, `profile.md`, and a README | P0; content files added in P1 |
| `scripts` | Repository validation commands and their tests | P0 |
| `e2e` | Browser journeys | Existing foundation |
| `docs` | Implementation documentation | P0 |
| `docs/planning` | Handbook and historical design reference | Planning baseline |
| `.github` | CI, pull-request template, and assistant guidance | Foundation |

Introduce the following boundaries with their first real implementation files; empty placeholder trees are unnecessary:

- Additional `src/os` modules for desktop, onboarding, preferences, responsive controller, routing coordinator, taskbar, and window manager.
- Application interiors within the existing `src/apps` directories.
- Remaining content loaders and Markdown rendering alongside the existing content contracts.
- `src/server/actions` and `src/server/integrations` for capability-based recommendations and watchlist services.
- `src/components/shared` for deliberately shared application presentation.
- `public/icons`, `public/images`, `public/wallpapers`, and `src/assets/fonts` when approved assets are added.

## Import and ownership rules

- Use the existing `@/*` alias for source imports.
- Use named exports for ordinary modules. Framework entry points and configuration may use default exports as required by their APIs.
- Guard secret-bearing server entry points with `import "server-only"`. Client modules must not import `@/server`.
- Pure schemas can be tested without the guarded runtime entry point. Do not read `process.env` throughout the component tree.
- Keep reducers, geometry, bounds, selectors, and cascade calculations React-free.
- Applications use the public OS command API. They do not import reducer internals or each other.
- The routing coordinator translates navigation to OS commands; the reducer does not import Next.js routing.
- Avoid broad barrel exports. A small `index.ts` is appropriate for an intentional public entry point, such as server environment configuration.

These boundaries were established in P0 and apply to the P1 modules. `server-only` is a build-time guard; a comprehensive import-boundary lint system has not been introduced.

## State and styling ownership

Preferences, responsive-mode selection, and desktop-session state will have separate providers. The future composition is `PreferencesProvider`, `ResponsiveModeProvider`, `DesktopSessionProvider`, and `RoutingCoordinator`; these providers are not implemented yet.

Window geometry and open applications reset on refresh. Preferences and onboarding completion persist in that browser's local storage. Application state lives inside mounted application components and is destroyed on close.

`tokens.css` owns reusable values; `base.css` owns document defaults; `typography.css` owns font roles. Add `motion.css` with actual motion behavior in its phase. Tailwind handles ordinary layout and scoped CSS Modules handle complex effects or geometry. Final pixel/serif/terminal font families and colour values remain prototype decisions in the handbook.

## Environment and deployment

Copy `.env.example` to `.env.local` for local builds. `NEXT_PUBLIC_SITE_URL` must be a valid HTTP or HTTPS URL. Development and test use localhost when it is absent; production builds require an explicit value.

The current setting is public metadata, so its existing `NEXT_PUBLIC_` name is retained. Secrets introduced in later phases must have server-only names and stay behind guarded modules. Validation errors list field names only.

CI uses an explicit example origin and needs no provider credentials. Vercel must use the Next.js preset, the repository's pinned pnpm version, Node 22, and a configured site origin in production and preview environments. Connect the Git repository so PRs create previews and merges to `main` deploy production. The connection and remote branch protection are account settings, not completed by committing these files.
