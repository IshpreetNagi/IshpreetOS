import { stringify } from "yaml";
import type {
  ExperienceContent,
  ExperienceFrontmatter,
} from "@/server/content/experience.schema";

// Representative test data, not a claim about Ishpreet's employment.
export const experienceFrontmatterFixture = {
  company: "Example organization",
  role: "Software developer",
  location: "Remote",
  startDate: "2025-01",
  currentPosition: false,
  endDate: "2026-01",
  technologies: ["TypeScript", "React"],
} satisfies ExperienceFrontmatter;

export const experienceBodyFixture =
  "- Built application features.\n- Reviewed changes.\n  - Added regression tests.\n";

export const experienceMarkdownFixture =
  "---\n" + stringify(experienceFrontmatterFixture) + "---\n" + experienceBodyFixture;

export const experienceContentFixture: ExperienceContent = {
  ...experienceFrontmatterFixture,
  slug: "example-position",
  body: experienceBodyFixture,
};
