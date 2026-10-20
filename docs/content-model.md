# Content model and validation

The [handbook's content model](planning/PROJECT_HANDBOOK.md#11-content-and-data-architecture) is the source of truth. P0 establishes dependencies, the content directory, and a syntax-validation command. P1 defines the full contracts, fixtures, loader map, and application registry.

## Approved sources

| Source | Responsibility | Current status |
| --- | --- | --- |
| `content/site.yaml` | Public identity, links, resume URL, and default SEO fields | P1 schema/file |
| `content/profile.md` | Biography heading, introduction, and long-form body | P1 schema/file |
| `content/projects/*.md` | One project per file | P1 schema/files |
| `content/experience/*.md` | One professional position per file | P1 schema/files |
| `content/credits.yaml` | Creator, source, licence, usage, and required attribution | P1 schema/file |
| Notion watchlist | Title, media type, and status | Later integration phase |

`content/README.md` explains the directory while contracts are pending. No fabricated portfolio records have been introduced. Content schemas should infer TypeScript types through Zod and return serializable application view data.

## P0 validation command

```bash
pnpm content:validate
```

The command walks `content` recursively and checks:

- YAML syntax in `.yaml` and `.yml` files, including duplicate-key errors.
- YAML frontmatter syntax in Markdown using `gray-matter` and the same `yaml` parser.
- A key/value mapping at the root of YAML or Markdown frontmatter.
- Plain YAML delimiters only, including a closing delimiter; alternative frontmatter engines such as JavaScript are rejected before parsing.
- Unsupported MDX files and non-regular content entries.

It reports all invalid files and exits with a nonzero status when any check fails. Ordinary Markdown without frontmatter is valid at this foundation stage. File names, required fields, dates, links, and project/experience semantics are not yet validated. The command explicitly reports that domain schemas arrive in P1.

P1 must extend this gate to use the same schemas and parsing rules as runtime content loaders. Successful syntax validation alone must never be presented as full content-contract validation.

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
