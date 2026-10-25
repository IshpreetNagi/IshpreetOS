import { describe, expect, it } from "vitest";
import { stringify } from "yaml";
import { z } from "zod";
import { parseExperienceMarkdown } from "@/server/content/experience.parser";
import {
  experienceContentFixture,
  experienceFrontmatterFixture,
  experienceMarkdownFixture,
} from "@/test/fixtures/experience";

function experienceSource(frontmatter: unknown, body: string) {
  return "---\n" + stringify(frontmatter) + "---\n" + body;
}

describe("experience Markdown parser", () => {
  it("combines validated frontmatter, filename identifier, and responsibilities", () => {
    expect(parseExperienceMarkdown(experienceMarkdownFixture, "example-position")).toEqual(experienceContentFixture);
  });

  it("preserves bullets, nested lists, blank lines, and intentional indentation", () => {
    const body = "    code example\n\n- First responsibility\n- Second responsibility\n  - Nested detail\n\n- [x] Completed work\n";
    const source = experienceSource(experienceFrontmatterFixture, body);

    expect(parseExperienceMarkdown(source, "example-position").body).toBe(body);
  });

  it("accepts a current position and keeps endDate null for the display layer", () => {
    const source = experienceSource({
      ...experienceFrontmatterFixture, currentPosition: true, endDate: null,
    }, "- Current responsibilities\n");

    expect(parseExperienceMarkdown(source, "current-position")).toMatchObject({
      currentPosition: true,
      endDate: null,
    });
  });

  it("rejects a blank responsibilities body and frontmatter body overrides", () => {
    expect(() => parseExperienceMarkdown(
      experienceSource(experienceFrontmatterFixture, " \n\t"),
      "example-position",
    )).toThrow(z.ZodError);

    expect(() => parseExperienceMarkdown(experienceSource({
      ...experienceFrontmatterFixture, body: "Injected responsibilities",
    }, "- Real responsibilities\n"), "example-position")).toThrow(z.ZodError);
  });

  it("rejects inconsistent dates and invalid filename-derived identifiers", () => {
    expect(() => parseExperienceMarkdown(experienceSource({
      ...experienceFrontmatterFixture, endDate: "2024-01",
    }, "- Responsibilities\n"), "example-position")).toThrow(z.ZodError);

    expect(() => parseExperienceMarkdown(experienceMarkdownFixture, "../position")).toThrow(z.ZodError);
  });

  it("uses the shared frontmatter safety checks", () => {
    expect(() => parseExperienceMarkdown(
      "---javascript\n({ company: 'Do not evaluate' })\n---\nBody",
      "example-position",
    )).toThrow(/plain --- YAML/);

    expect(() => parseExperienceMarkdown(
      "---\ncompany: First\ncompany: Second\n---\nBody",
      "example-position",
    )).toThrow(/unique/i);
  });
});
