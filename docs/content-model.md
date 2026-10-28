# Content model and validation

The [handbook's content model](planning/PROJECT_HANDBOOK.md#11-content-and-data-architecture) is the source of truth. P0 establishes dependencies, the content directory, and a syntax-validation command. P1 defines the full contracts, fixtures, loader map, and application registry.

## Approved sources

| Source | Responsibility | Current status |
| --- | --- | --- |
| `content/site.yaml` | Public identity, links, resume URL, and default SEO fields | P1 schema, parser, loader, and placeholder content implemented |
| `content/profile.md` | Biography heading, introduction, and long-form body | P1 schema, parsers, and placeholder content implemented; loader pending |
| `content/projects/*.md` | One project per file | P1 schemas, parser, and test fixtures implemented; content files/loaders pending |
| `content/experience/*.md` | One professional position per file | P1 schemas, parser, and test fixtures implemented; content files/loaders pending |
| `content/credits.yaml` | Creator, source, licence, usage, and required attribution | P1 schema, file, and loader pending |
| Notion watchlist | Title, media type, and status | Later integration phase |

`content/README.md` explains the directory while the remaining contracts are pending. Site contact/link placeholders are explicitly marked; final public values belong to the content task. Content schemas infer TypeScript types through Zod and return serializable application view data.

## P1 site content (in progress)

- `src/server/content/site.schema.ts` defines the strict site and social-link schemas and infers `SiteContent`. Site `title` and `description` also serve as default SEO text; the base URL remains in server environment configuration.
- `src/server/content/site.parser.ts` accepts YAML text, rejects syntax errors and duplicate keys, converts the document to JavaScript data, and applies the site schema.
- `src/server/content/site.loader.ts` is guarded by `server-only`. It reads `content/site.yaml` as UTF-8 and reports read, syntax, or schema failures with the file name.
- Colocated parser tests validate representative text and the real repository file. Loader tests mock file reads and `server-only` to check loading and error messages. Those mocks do not verify Next.js's client-import protection.
- `scripts/validate-content-contracts.ts` runs the same site parser outside Next.js through the development dependency `tsx`. The `content:validate` command runs the existing recursive syntax checker followed by this contract check; either failure produces a nonzero exit status. Command-level tests run the real entry point against temporary content directories, without altering the repository file.
- The homepage loads its title and description through the site loader. `pnpm dev` and `pnpm build` run `pnpm content:validate` before starting Next.js, so invalid site content blocks startup or the build. This validation runs at command startup, not continuously on every content edit. `check:all`, the CI content-validation job, and the real-file unit test also check the site contract. Content-derived page metadata remains pending.

## Profile Markdown contract (in progress)

`markdown.parser.ts` separates plain YAML frontmatter from the body and rejects missing/malformed delimiters, alternative frontmatter engines, invalid YAML, and duplicate keys. `profile.parser.ts` validates the frontmatter separately, then combines it with the body through the complete profile schema. This rejects unexpected frontmatter fields, including attempts to supply a separate `body` field.

Heading and introduction text is trimmed. The Markdown body must contain non-whitespace text, but its original indentation and surrounding whitespace are preserved because they can affect rendering. Regression tests cover this distinction. The profile loader, rendering, and profile-specific command validation are not connected yet.

## Project and experience contracts (in progress)

Both use the shared Markdown parser, strict frontmatter schemas, and schema-inferred view types. The parsers accept a separate lowercase, hyphen-separated `slug` that the future loaders will derive from the filename; authors do not repeat it in frontmatter. Unknown fields and attempts to override `slug` or `body` in frontmatter are rejected.

### Projects

- Required metadata: `name`, `description`, `status`, `technologies`, `githubUrl`, `screenshot`, and non-negative integer `order`.
- Status is `completed` or `in-progress`. Completed projects require `completionDate` in valid `YYYY-MM` format; in-progress projects must omit it.
- `liveUrl` is optional. Repository and live links allow HTTP/HTTPS only; optional does not mean an empty string is valid.
- Screenshots require a non-blank `alt` and a local image `src` under `/images/projects/`. Traversal, encoded paths, backslashes, queries, fragments, and unsupported image extensions are rejected. File existence and final asset selection are not checked by the schema.
- Additional Markdown notes may be empty; when present their whitespace is preserved.
- Collection validation rejects duplicate slugs and duplicate display orders. Sorting by `order` will be applied by the collection loader.

### Experience

- Required metadata: `company`, `role`, `location`, `startDate`, `currentPosition`, `endDate`, and `technologies`.
- `currentPosition` is an explicit boolean. `true` requires `endDate: null`; `false` requires a valid `YYYY-MM` end month on or after the start month. The display layer will show a current role as start month–Present; the word Present is not stored in the date field.
- Responsibilities live in the required, non-blank Markdown body. Bullet markers, line breaks, nested list indentation, and code indentation are preserved, not flattened into a paragraph. Rendering as semantic lists and CSS marker customization belong to the renderer, which is not connected yet.
- Collection validation rejects duplicate slugs but permits multiple roles at the same company. Newest-first ordering will be applied by the collection loader.

Ordinary text fields and technology labels are trimmed. Technology arrays may be empty, but their entries must be non-blank and unique, ignoring case. Dates stay strings, and all bodies preserve Markdown whitespace. Loaders, real content files, command integration for these contracts, and rendered-list checks remain pending.

## Validation command

```bash
pnpm content:validate
```

The syntax stage walks `content` recursively and checks:

- YAML syntax in `.yaml` and `.yml` files, including duplicate-key errors.
- YAML frontmatter syntax in Markdown using `gray-matter` and the same `yaml` parser.
- A key/value mapping at the root of YAML or Markdown frontmatter.
- Plain YAML delimiters only, including a closing delimiter; alternative frontmatter engines such as JavaScript are rejected before parsing.
- Unsupported MDX files and non-regular content entries.

The syntax stage reports all invalid files and exits with a nonzero status when any check fails. Ordinary Markdown without frontmatter is valid at this foundation stage. Its legacy success message refers to the syntax stage only.

The contract stage then requires `content/site.yaml`, parses it through `parseSiteYaml`, and validates its required fields, text, email, web URLs, and social links. It reports site-file failures and exits with status 1. Profile, project, and experience schemas already validate their contracts in unit tests, including the project/experience date rules, but they are not connected to this command yet. Successful site validation must not be presented as command validation of those other contracts.

## Dependency roles

| Package | Role |
| --- | --- |
| `zod` | Runtime schemas and inferred types |
| `gray-matter` | Markdown frontmatter parsing |
| `yaml` | YAML parsing for configuration/content |
| `react-markdown` | Safe Markdown rendering, introduced with application content |
| `remark-gfm` | Tables and task lists in Markdown rendering |

The renderer packages are the explicitly approved initial content dependencies. P0 installs them but does not introduce a renderer ahead of its content contracts. Raw HTML and MDX remain disabled in the planned rendering pipeline.

## Loading and failure behavior

Small local content will be read and validated on the server when preparing the desktop. Applications receive typed data rather than fetching local files every time they open. Invalid local content must fail development/build checks loudly. Malformed external data must produce controlled unavailable results.

External integrations remain lazy and may not block desktop loading. Their credentials do not belong in content files. Store public images in their approved asset folders and strip EXIF/location metadata from personal photography.
