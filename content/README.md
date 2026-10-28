# Portfolio content

This directory contains the Markdown and YAML sources described in the [content model](../docs/content-model.md).

P0 established syntax validation. P1 has introduced placeholder `site.yaml` and `profile.md` files. Site content has a schema, parser, server-only loader, homepage integration, and startup/build contract validation; its contact and link values are temporary examples, not final public details. Profile, project, and experience schemas, parsers, and test fixtures are implemented. Their loaders and command integration, real project/experience files, the credit contract, and Markdown rendering remain pending. Final portfolio copy is a separate content task.

Do not place credentials, provider configuration, application state, or uploaded assets here. Portfolio images belong in `public/images`; selectable wallpapers belong together in `public/wallpapers` when those assets are introduced.
