import { parseMarkdown } from "@/server/content/markdown.parser";
import {
  projectFrontmatterSchema,
  projectSchema,
} from "@/server/content/project.schema";
import type { ProjectContent } from "@/server/content/project.schema";

// The future file loader supplies the slug derived from the Markdown filename.
export function parseProjectMarkdown(source: string, slug: string): ProjectContent {
  const parsed = parseMarkdown(source);
  const frontmatter = projectFrontmatterSchema.parse(parsed.frontmatter);

  return projectSchema.parse({
    ...frontmatter,
    slug,
    body: parsed.body,
  });
}
