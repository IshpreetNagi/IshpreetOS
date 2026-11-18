# Portfolio content

This directory contains the Markdown and YAML sources described in the [content model](../docs/content-model.md).

P0 established syntax validation. P1 has introduced placeholder `site.yaml` and `profile.md` files. Both have schemas, parsers, server-only loaders, and startup/build contract validation. The homepage uses site content, whose contact and link values are temporary examples. Profile, project, and experience test fixtures are implemented, along with project and experience schemas and parsers. About integration, project and experience loaders and content files, their command validation, the credit contract, and Markdown rendering remain pending. Final portfolio copy is a separate content task.

Do not place credentials, provider configuration, application state, or uploaded assets here. Portfolio images belong in `public/images`; selectable wallpapers belong together in `public/wallpapers` when those assets are introduced.
