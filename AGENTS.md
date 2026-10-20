# IshpreetOS development rules

- Read `docs/planning/PROJECT_HANDBOOK.md` before changing behavior. It is the source of truth. Ask Ishpreet when it does not resolve an important product or technical decision.
- Read the current Notion task and relevant implementation documents in `docs/`. Keep work inside the active task and release boundary.
- Keep routes in `src/app`, OS mechanics in `src/os`, portfolio applications in `src/apps`, and server code in `src/server`. Introduce directories with their first real files.
- Keep domain reducers, geometry, and selectors free of React. Applications use the OS command API; routing remains outside the reducer.
- Use `@/*` for source imports. Use named exports except framework entry points. Keep server-only entry points guarded with `import "server-only"`.
- Keep module tests beside their source; shared setup belongs in `src/test`, and browser journeys belong in `e2e`.
- Add dependencies in the phase that uses them. Spotify and weather code, credentials, and packages are deferred to v1.1.
- Run `pnpm check:all` for the phase gate and relevant browser checks. Describe anything that could not be verified.
- Update implementation documentation with code changes. Mark Notion tasks Done only after their acceptance criteria pass.
- Preserve unrelated working changes. Do not commit, push, merge, deploy, or change repository settings unless requested.
