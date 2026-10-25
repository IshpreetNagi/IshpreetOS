import { stringify } from "yaml";
import type {
  ProjectContent,
  ProjectFrontmatter,
} from "@/server/content/project.schema";

export const projectFrontmatterFixture = {
  name: "Example project",
  description: "A representative project for contract tests.",
  status: "completed",
  completionDate: "2026-10",
  technologies: ["TypeScript", "React"],
  githubUrl: "https://github.com/example/project",
  screenshot: {
    src: "/images/projects/example.webp",
    alt: "Example project screenshot",
  },
  order: 0,
} satisfies ProjectFrontmatter;

export const projectBodyFixture = "- Project note\n  - Nested project note\n";

export const projectMarkdownFixture =
  "---\n" + stringify(projectFrontmatterFixture) + "---\n" + projectBodyFixture;

export const projectContentFixture: ProjectContent = {
  ...projectFrontmatterFixture,
  slug: "example-project",
  body: projectBodyFixture,
};
