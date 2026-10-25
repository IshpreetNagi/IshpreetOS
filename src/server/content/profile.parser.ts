import { parseMarkdown } from "@/server/content/markdown.parser";
import {
  profileFrontmatterSchema,
  profileSchema,
} from "@/server/content/profile.schema";
import type { ProfileContent } from "@/server/content/profile.schema";

export function parseProfileMarkdown(source: string): ProfileContent {
  const parsed = parseMarkdown(source);

  const frontmatter = profileFrontmatterSchema.parse(parsed.frontmatter);

  return profileSchema.parse({
    ...frontmatter,
    body: parsed.body,
  });
}
