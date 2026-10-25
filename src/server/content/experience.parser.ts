import { parseMarkdown } from "@/server/content/markdown.parser";
import {
  experienceFrontmatterSchema,
  experienceSchema,
} from "@/server/content/experience.schema";
import type { ExperienceContent } from "@/server/content/experience.schema";

export function parseExperienceMarkdown(source: string, slug: string): ExperienceContent {
  const parsed = parseMarkdown(source);
  const frontmatter = experienceFrontmatterSchema.parse(parsed.frontmatter);

  return experienceSchema.parse({
    ...frontmatter,
    slug,
    body: parsed.body,
  });
}
