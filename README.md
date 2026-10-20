# IshpreetOS

IshpreetOS is a retro-modern portfolio being built as a personal operating system, with familiar desktop interactions, real web routes, responsive behavior, and content-first application windows.

The repository is currently in P0 (foundation). The homepage is a temporary construction page; the OS shell and applications arrive in later phases.

## Run locally

Use Node 22 and pnpm 11.11.0, then run:

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Copy the environment file only if `.env.local` does not already exist. On macOS/Linux, use `cp` instead of `Copy-Item`. Open [localhost:3000](http://localhost:3000).

Run `pnpm check:all` for lint, type checks, content syntax validation, unit/component tests, and a production build. See [testing and phase gates](docs/testing.md) for browser tests and Vercel setup.

## Project documentation

- [Documentation index](docs/README.md) — the guide to planning and future implementation documentation
- [Working with Codex](docs/workflow.md) — owner decisions, corrections, and the AI-assisted development workflow, with the latest entries first
- [Project Handbook](docs/planning/PROJECT_HANDBOOK.md) — the governing product, design, architecture, implementation, and release specification
- [Designed PDF Handbook](docs/planning/PROJECT_HANDBOOK.pdf) — the presentation edition of the same planning baseline

Development is organized through short-lived feature branches and the phased build order documented in the handbook.
