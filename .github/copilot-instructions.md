This is a Next.js 16 project with the App Router using TypeScript, Tailwind CSS v4, and shadCN UI components.

- Use the App Router (`src/app/` directory) for routes
- Place shared components in `src/components/ui/` for shadCN components and `src/components/` for custom ones
- Use `@/` import alias for src-relative imports (e.g., `@/components/ui/button`)
- Run `pnpm test` before pushing to ensure all unit tests pass
- Run `pnpm typecheck` to verify TypeScript
- Run `pnpm lint` to verify linting
- E2E tests live in `e2e/` and use Playwright
- Unit tests live next to their source files with `.test.tsx` extension
- Keep accessibility in mind: use semantic HTML, proper ARIA labels, keyboard navigation
