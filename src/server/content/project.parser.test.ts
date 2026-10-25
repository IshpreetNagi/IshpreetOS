import { describe, expect, it } from "vitest";
import { stringify } from "yaml";
import { z } from "zod";
import { parseProjectMarkdown } from "@/server/content/project.parser";
import {
  projectContentFixture,
  projectFrontmatterFixture,
  projectMarkdownFixture,
} from "@/test/fixtures/project";

function projectSource(frontmatter: unknown, body = "") {
  return "---\n" + stringify(frontmatter) + "---\n" + body;
}

describe("project Markdown parser", () => {
  it("combines validated frontmatter, filename identifier, and unmodified notes", () => {
    expect(parseProjectMarkdown(projectMarkdownFixture, "example-project")).toEqual(projectContentFixture);
  });

  it("accepts a project file with no optional Markdown notes", () => {
    expect(parseProjectMarkdown(projectSource(projectFrontmatterFixture), "example-project").body).toBe("");
  });

  it("preserves bullets, nested indentation, and code indentation", () => {
    const body = "    code block\n\n- First note\n  - Nested note\n";

    expect(parseProjectMarkdown(projectSource(projectFrontmatterFixture, body), "example-project").body).toBe(body);
  });

  it("rejects an invalid filename-derived identifier", () => {
    expect(() => parseProjectMarkdown(projectMarkdownFixture, "../project")).toThrow(z.ZodError);
  });

  it("rejects unknown frontmatter and invalid project fields", () => {
    for (const extra of [{ body: "Override" }, { name: "" }, { liveUrl: "javascript:alert(1)" }]) {
      expect(() => parseProjectMarkdown(projectSource({
        ...projectFrontmatterFixture, ...extra,
      }), "example-project")).toThrow(z.ZodError);
    }
  });

  it("uses the shared YAML safety checks", () => {
    expect(() => parseProjectMarkdown(
      "---javascript\n({ name: 'Do not evaluate' })\n---\nBody",
      "example-project",
    )).toThrow(/plain --- YAML/);

    expect(() => parseProjectMarkdown(
      "---\nname: One\nname: Two\n---\nBody",
      "example-project",
    )).toThrow(/unique/i);
  });
});
