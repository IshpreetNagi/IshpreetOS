# Working with Codex on IshpreetOS

I am building IshpreetOS, a personal portfolio presented as an operating system, with Codex as an implementation partner. I set the product direction, choose the scope, write code, review the results, and decide what merges. Codex helps explore tradeoffs, helps write some code and tests, and investigates failures.

My philosophy with Codex is to treat it as a junior engineer: I define the work, review the results, and verify that the implementation meets the requirements. I do not accept work without independent verification.

- **I own the decisions.** I challenge, change, or reject recommendations that do not fit the project.
- **I review the work.** I read AI-generated code, tests, and documentation, and ask questions when something is unclear.
- **I verify it myself.** I run automated tests and manually check behavior, including what the tests actually cover.
- **I follow failures through to a fix.** I investigate problems, correct mistakes, and rerun the relevant checks.
- **I gate progress on verification.** I accept work and move forward only after review and the relevant checks pass. I retain the final merge decision.

## The review loop

1. I define the task and its acceptance criteria using the Notion board and [project handbook](planning/PROJECT_HANDBOOK.md).
2. I write code or delegate a bounded implementation task on a working branch. For delegated work, Codex explains the changes, tests, and limitations.
3. I review the result, run automated tests, and manually check behavior. Any problems return to implementation and another round of checks.
4. I check GitHub CI and the Vercel deployment, then decide whether the work is ready to merge and the next phase can begin.

[AGENTS.md](../AGENTS.md) makes the working boundaries explicit. The handbook governs product behavior and is updated when a product decision changes; this field note records why I accepted or changed a proposal.

Tests written by the same agent that wrote the implementation need review too. A green run is evidence for the assertions exercised, not proof that every requirement or environment is covered. I distinguish unit tests, browser tests, builds, and deployment checks before treating a task as complete.

## Key decisions and results

- I reviewed a failing Markdown-formatting regression before approving its fix. I confirmed that intentional indentation must be preserved and required Codex to show future errors for my review before making corrections.
- I required a tested foundation before starting OS features. P0 reached 21 passing unit and component tests, one green Chromium end-to-end journey against a production server, and passing GitHub CI before I merged it.
- I caught a production-only `NEXT_PUBLIC_SITE_URL` failure on Vercel after local checks passed. I configured the missing deployment value and verified a successful redeployment before merging.
- Codex's checks caught URL-validation and linting defects, and its dependency review identified a frontmatter-parser risk. I independently reviewed the corrections, ran tests, and manually checked behavior before accepting the work.
- I changed the proposed product plan: every open app must stay directly accessible from the taskbar, the watchlist stays text-only, and Spotify/weather setup waits until v1.1. These are agreed requirements, not completed OS features.
- I requested a publishable Markdown handbook and consolidated repository documentation so future contributors and AI sessions have a version-controlled source of truth beyond the chat.

The decision log below gives the context, reasoning, corrections, and verification behind these highlights.

## Decision log

Entries 001–005 were first recorded retrospectively on October 20, 2026. Entries are displayed in descending ID order, with the newest additions at the top and 001 at the bottom. Planning decisions were checked against the original Planning chat and the repository handbook.

### 006 — Review a Markdown-formatting failure before approving its correction

**Date / stage / status:** October 25, 2026; P1 content contracts; correction implemented and tested by Codex, independently verified by me, and merged with the registry and content-contract work.

**Starting point and request:** While building the profile contract together, I used Codex's schema example, which reused a trimmed non-empty-text rule for the Markdown body as well as the heading and introduction.

**Codex contribution:** Codex found that four regression tests failed. Validation removed leading indentation and trailing newlines from the body. Removing four leading spaces can change an intended Markdown code block into ordinary text.

**My decision or correction:** I stopped the attempted correction and asked to see the error first. I reviewed the failing tests, confirmed that intentional Markdown indentation should remain intact, and explicitly approved the fix. I also required Codex to show errors and explain their cause before making future corrections, so I can verify the problem and approve the change.

**Verification:** The new tests `preserves Markdown body whitespace that can affect rendering` and `preserves indentation in the parsed Markdown body` failed before the correction. I verified that the failures were valid before approving it. Afterward, Codex reported 94 passing content tests, along with passing lint and TypeScript checks. My independent rerun of the corrected implementation was confirmed to pass the same tests, and I manually checked that the Markdown body was preserved as intended.

**Outcome and remaining limits:** The body rule now checks for non-blank text without transforming the Markdown; heading and introduction trimming is unchanged. The review-before-fix rule is recorded in `AGENTS.md`. This correction was merged in PR #5 with the registry and content-contract work. The overall P1 task remains in progress; Markdown rendering and the remaining content-loading work are not complete.

### 005 — Move the project knowledge into the repository

**Stage:** Planning handoff and documentation organization.

**What Codex first produced:** A designed PDF handbook, with planning material and generated output spread across multiple folders. The working conversation still held much of the reasoning behind the plan.

**What I wanted instead:** I requested a publishable Markdown edition and one organized documentation root that would fit the agreed application structure. Future contributors and AI sessions need an inspectable specification that travels with the project.

**Codex contribution:** It created the Markdown handbook, consolidated the handbook editions and rough design under `docs/planning`, added the documentation index, and updated relative links. P0 then added the implementation documents and repository instructions.

**My decision and reason:** The Markdown handbook is the living source of truth. The PDF is a presentation snapshot, and the rough design is a historical reference. Keeping those roles explicit makes changes reviewable in Git and reduces the chance of a future agent following obsolete chat context.

**Verification:** The documentation reorganization checked local links and passed lint/type checks. Its outcome is visible in [the handbook commit](https://github.com/IshpreetNagi/IshpreetOS/commit/3700b46), the [documentation index](README.md), and [repository guidance](../AGENTS.md). This verifies documentation organization; it does not prove future implementations comply with every rule.

### 004 — Independently review and verify corrections before accepting them

**Stage:** Codex's P0 working implementation, corrected before the foundation commit.

Codex and its checks identified the implementation problems below. I reviewed the resulting changes, ran the tests myself, and manually checked behavior before accepting the work. The table credits Codex for finding and correcting these issues; my role was to independently review and verify the corrections before moving forward.

| Initial implementation or gap                                                                                                        | How it was caught and corrected                                                                                                                                                               | Evidence and limit                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The URL validator called `new URL()` inside a refinement, allowing malformed strings to throw before the intended validation result. | The invalid-input tests failed. Codex changed the parser to Zod's HTTP/HTTPS URL validation so errors consistently identify the configuration field.                                          | [Environment tests](../src/server/env/schema.test.ts), including the sanitized-error assertion. The failed intermediate implementation was not committed separately. |
| ESLint scanned generated Playwright report JavaScript after the first browser failure.                                               | The full gate failed on report output. Codex excluded report, result, and coverage directories while keeping test source linted.                                                              | [ESLint configuration](../eslint.config.mjs). There is no dedicated regression test for the ignore list; the full lint command verifies the current workspace.       |
| The frontmatter parser supported alternative engines, including JavaScript.                                                          | Codex inspected the dependency and constrained the validator to plain YAML delimiters before parsing. Tests cover executable frontmatter/MDX, malformed YAML, and missing closing delimiters. | [Content validator](../scripts/validate-content.mjs) and [fixture tests](../scripts/validate-content.test.ts). This was preventive review, not an observed attack.   |

**My decision and outcome:** I accepted the final implementation only after my own test runs and manual checks confirmed that it worked as intended, and the relevant CI and deployment checks passed. The corrective code and tests are in the merged foundation commit. My review included checking what the tests establish and what remains outside them; acceptance followed that verification.

### 003 — Catch a deployment configuration gap after local checks passed

**Stage:** P0 deployment review, resolved before merging.

**What Codex produced:** The new validator required `NEXT_PUBLIC_SITE_URL` for production builds. Local validation passed using an ignored `.env.local`; CI supplied a public example URL in its workflow environment.

**What I caught:** Vercel failed with `Invalid server environment: NEXT_PUBLIC_SITE_URL`, resulting in the failure of the CI deployment check when making a PR to `main`.

**What changed and why:** I configured the full site URL in Vercel as a Config value for Production and Preview, then redeployed. The deployed build needed its own configuration; an ignored local file could not supply it. I kept the validation rule in place and reported that deployment worked before merging to Codex, as well as what the issue was.

**Verification:** The existing tests named `requires an explicit origin in production`, `accepts a configured HTTPS production origin`, and `rejects an invalid site URL (%s)` cover the validator's contract. They predate this deployment report; they were not added afterward as a new fix. They cannot inspect Vercel's dashboard or environment selection. The successful redeployment was the check for that part of the system.

**Remaining lesson:** Local tests and CI are necessary but do not establish that a deployment account has the required settings. For later integrations, I need to verify each environment explicitly.

### 002 — Require an explainable, tested foundation before product features

**Stage:** P0, merged October 19, 2026.

**Starting point and request:** The repository had a generated Next.js page, starter assets and styles, and an initial test/CI scaffold. I asked Codex to implement the first Notion task: establish repository architecture, documentation, and CI before starting the OS features.

**Codex contribution:** It wrote the four implementation documents, server environment validation, content syntax checks, tests, a broader CI workflow, and a construction page. It removed starter assets and deferred the preinstalled animation and analytics packages to their planned phases.

**My decision and review:** I required tests and documentation to be part of each phase's completion criteria. After implementation, I read the documents and asked what each command actually checks. I confirmed that `check:all` covers lint, types, content syntax, unit/component tests, and a build; browser tests are separate. I reported that the checks passed and merged after the deployment issue in entry 003 was resolved.

**Verification:** The build conversation recorded 21 passing unit/component tests and one passing Chromium journey against a production server. I subsequently reported green GitHub CI and a working Vercel deployment. Git history confirms the foundation merge. The browser journey checks the page heading, metadata, main landmark, and retained light appearance under a dark system preference; it does not test the future OS.

### 001 — Change the plan where it conflicts with the intended product

**Stage:** Planning baseline, October 16, 2026; most behavior remains unimplemented.

**Request and Codex contribution:** I asked Codex to examine the project and Notion board, then question the interaction model, design, dependencies, and build sequence. It proposed defaults and highlighted tradeoffs. I reviewed those proposals instead of accepting the entire plan unchanged.

The following are specific proposals I overruled or narrowed. They are product choices, not claims that every rejected option was technically wrong.

| Codex proposal                                                              | My decision and reason                                                                                                                    | Where the decision is checked                                                                                                                                    |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Allow taskbar scrolling or an overflow switcher when space becomes tight.   | Keep every open app directly accessible. There is a known, limited app set and one instance per app; branding and date yield space first. | [Window contract](window-behavior.md#invariants) and handbook chapters 6–7. Future taskbar/layout tests are still required.                                      |
| Let individual applications request larger minimum window dimensions later. | Use shared proportional sizing rules in multi-window modes. Content must reflow or scroll within those rules.                             | [Window contract](window-behavior.md#invariants). Geometry and real-device checks belong to later phases.                                                        |
| Use modern sans-serif body text and dark charcoal instead of pure black.    | Use Times-like serif content and pure black text on cream. This is the reading experience and visual identity I want.                     | [Visual system](planning/PROJECT_HANDBOOK.md#9-visual-design-system). P0 checks black text/light appearance; final local fonts and visual tuning remain pending. |
| Include minimalist patterns among wallpaper options.                        | Keep nostalgic landscapes, XP-style imagery, and personal photography. Minimalist patterns do not fit my direction.                       | [Visual system](planning/PROJECT_HANDBOOK.md#9-visual-design-system). Final asset selection is pending.                                                          |
| Give the watchlist artwork and optional external information links.         | Keep only title, media type, and status. Extra media and links add work and clutter without serving the list's purpose.                   | [Integration contract](planning/PROJECT_HANDBOOK.md#12-external-integrations). Provider mapping and rendering tests are pending.                                 |
| Revalidate the Notion watchlist about every ten minutes.                    | Use six hours. I update it infrequently, so minute-level freshness does not justify the requests.                                         | [Caching decision](planning/PROJECT_HANDBOOK.md#caching). Cache behavior still needs integration tests.                                                          |
| Make Projects the first complete portfolio application after Settings.      | Allow About first because I am most interested in building it. Its external integrations stay in their later phase.                       | [Application order](planning/PROJECT_HANDBOOK.md#application-order). This changes sequencing, not the dependency gates.                                          |
| Design the Spotify adapter interface now while deferring implementation.    | Revisit the interface when building v1.1, since my design may change. Add no Spotify/weather setup or packages in v1.                     | [Release boundaries](planning/PROJECT_HANDBOOK.md#3-scope-and-release-boundaries) and dependency review.                                                         |

**Verification and outcome:** These decisions were consolidated into the handbook and implementation contracts. Approval of a written rule is the current evidence for the unbuilt features. Their implementation will need its own tests, device checks, and log entries.

## Maintaining this record

Add an entry when I reject or narrow a meaningful proposal, change scope, catch a defect or configuration issue, or accept a significant technical tradeoff. Do not log routine edits, every prompt, or a list of completed files.

Record the entry in the same PR as the decision or correction where practical. Keep existing entry IDs stable. Insert each new, higher-numbered entry at the top of the log, above the current newest entry; for example, 006 goes above 005. Do not renumber, shorten, or restructure earlier entries when adding a new one. Add PR, commit, test, and run links as evidence becomes available. Use the actual test name and result; do not imply that a test was added after a reported bug if it already existed.

Distinguish **my finding**, **an agent-caught correction**, **a joint decision**, and **an approved but unimplemented requirement**. State when verification is manual, owner-reported, or still pending. If no regression test is appropriate, explain the actual check rather than inventing one. I review entries written by Codex before merging them.

Copy this template for the next notable decision:

```markdown
### 007 — Specific decision or correction

**Date / stage / status:** YYYY-MM-DD; phase; proposed, implemented, or verified.

**Starting point and request:** What existed, and what I wanted changed.

**Codex contribution:** What it proposed or produced.

**My decision or correction:** What I accepted, rejected, caught, or changed, and why.
Attribute agent-caught findings explicitly.

**Verification:** Exact test/check, result, and who verified it. Say whether a
regression test was new, pre-existing, pending, or not applicable.

**Outcome and remaining limits:** What shipped and what is still unverified.
```
