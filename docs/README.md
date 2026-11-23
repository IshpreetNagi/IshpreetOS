# IshpreetOS Documentation

This directory keeps IshpreetOS planning and implementation documentation together without mixing documentation artifacts into the application source tree.

## Planning

The [`planning`](planning/) directory contains the product baseline and the visual material used while planning the project.

- [`PROJECT_HANDBOOK.md`](planning/PROJECT_HANDBOOK.md) is the authoritative, living specification. Product, design, architecture, scope, or release decisions should be updated here when they change.
- [`rough-design-reference.pdf`](planning/rough-design-reference.pdf) is an early visual reference. It is retained for project history and inspiration, not as the current source of truth.

## Testing documentation

[Testing](testing.md) is the documentation file for local setup, test commands, CI, preview readiness, and the phase gate.

## Working with agentic AI

[Working with Codex](workflow.md) records how I directs, reviews, corrects, and verifies AI-assisted work. Entries describe the decisions and fixes in reverse chronological order: newest at the top, oldest at the bottom. Use the short entry template, preserve edits, and keep notable entries with the PR that introduces the decision or correction. Evidence sections and detailed verification records are not required.

## Documentation rules

- Keep implementation documentation inside `docs` instead of creating competing documentation folders.
- Do not store credentials, private email addresses, access tokens, or unredacted provider responses in documentation.
- Update documentation in the same branch as the behavior it explains.
- Prefer links to a single source of truth over copying the same decision into multiple files.
