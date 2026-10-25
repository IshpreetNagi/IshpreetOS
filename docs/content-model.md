# Content model and validation

The [handbook's content model](planning/PROJECT_HANDBOOK.md#11-content-and-data-architecture) is the source of truth. P0 establishes dependencies, the content directory, and a syntax-validation command. P1 defines the full contracts, fixtures, loader map, and application registry.

## Approved sources

| Source | Responsibility | Current status |
| --- | --- | --- |
| `content/site.yaml` | Public identity, links, resume URL, and default SEO fields | P1 schema, parser, loader, and placeholder content implemented |
| `content/profile.md` | Biography heading, introduction, and long-form body | P1 schema/file |
| `content/projects/*.md` | One project per file | P1 schema/files |
| `content/experience/*.md` | One professional position per file | P1 schema/files |
| `content/credits.yaml` | Creator, source, licence, usage, and required attribution | P1 schema/file |
| Notion watchlist | Title, media type, and status | Later integration phase |

`content/README.md` explains the directory while the remaining contracts are pending. Site contact/link placeholders are explicitly marked; final public values belong to the content task. Content schemas infer TypeScript types through Zod and return serializable application view data.

## P1 site content (in progress)

- `src/server/content/site.schema.ts` defines the strict site and social-link schemas and infers `SiteContent`. Site `title` and `description` also serve as default SEO text; the base URL remains in server environment configuration.
- `src/server/content/site.parser.ts` accepts YAML text, rejects syntax errors and duplicate keys, converts the document to JavaScript data, and applies the site schema.
- `src/server/content/site.loader.ts` is guarded by `server-only`. It reads `content/site.yaml` as UTF-8 and reports read, syntax, or schema failures with the file name.
- Colocated parser tests validate representative text and the real repository file. Loader tests mock file reads and `server-only` to check loading and error messages. Those mocks do not verify Next.js's client-import protection.
- `scripts/validate-content-contracts.ts` runs the same site parser outside Next.js through the development dependency `tsx`. The `content:validate` command runs the existing recursive syntax checker followed by this contract check; either failure produces a nonzero exit status. Command-level tests run the real entry point against temporary content directories, without altering the repository file.
- The homepage is not connected to this loader yet. Development startup and standalone production builds do not yet invoke the validation command automatically; that wiring remains P1 work. `check:all`, the CI content-validation job, and the real-file unit test already check the site contract.

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

The contract stage then requires `content/site.yaml`, parses it through `parseSiteYaml`, and validates its required fields, text, email, web URLs, and social links. It reports site-file failures and exits with status 1. Other content contracts, dates, and project/experience semantics remain P1 work. Successful site validation must not be presented as validation of those pending contracts.

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
