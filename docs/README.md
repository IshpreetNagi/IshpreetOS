# IshpreetOS Documentation

This directory keeps IshpreetOS planning and implementation documentation together without mixing documentation artifacts into the application source tree.

## Planning

The [`planning`](planning/) directory contains the product baseline and the visual material used while planning the project.

- [`PROJECT_HANDBOOK.md`](planning/PROJECT_HANDBOOK.md) is the authoritative, living specification. Product, design, architecture, scope, or release decisions should be updated here when they change.
- [`PROJECT_HANDBOOK.pdf`](planning/PROJECT_HANDBOOK.pdf) is the designed presentation snapshot of the handbook. It is useful for reading and sharing, but the Markdown edition takes priority if the two ever differ.
- [`rough-design-reference.pdf`](planning/rough-design-reference.pdf) is an early visual reference. It is retained for project history and inspiration, not as the current source of truth.

## Implementation documentation

Implementation-specific documents will be added to this directory as their corresponding phases begin:

- `architecture.md` for implemented system boundaries and provider composition.
- `window-behavior.md` for reducer transitions, geometry, bounds, and responsive behavior.
- `content-model.md` for schemas, frontmatter contracts, and content-loading rules.
- `testing.md` for test placement, fixtures, browser journeys, and manual device checks.

These files should describe the system that actually exists in code. The handbook defines the approved plan; implementation documents evolve with the implementation.

## Documentation rules

- Keep planning artifacts inside `docs/planning`.
- Keep implementation documentation inside `docs` instead of creating competing documentation folders.
- Do not store credentials, private email addresses, access tokens, or unredacted provider responses in documentation.
- Update documentation in the same branch as the behavior it explains.
- Prefer links to a single source of truth over copying the same decision into multiple files.
