// @vitest-environment node
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { stringify } from "yaml";
import { z } from "zod";
import { parseProfileMarkdown } from "@/server/content/profile.parser";
import {
  profileBodyFixture,
  profileContentFixture,
  profileFrontmatterFixture,
  profileMarkdownFixture,
} from "@/test/fixtures/profile";

function profileSource(frontmatter: unknown, body = profileBodyFixture) {
  return "---\n" + stringify(frontmatter) + "---\n" + body;
}

describe("profile Markdown parser", () => {
  it("returns typed profile data from valid Markdown", () => {
    expect(parseProfileMarkdown(profileMarkdownFixture)).toEqual(profileContentFixture);
  });

  it("validates the repository's actual profile file", async () => {
    const source = await readFile(join(process.cwd(), "content", "profile.md"), "utf8");

    expect(() => parseProfileMarkdown(source)).not.toThrow();
  });

  it.each([
    { name: "missing fields", frontmatter: {} },
    { name: "missing introduction", frontmatter: { heading: "About" } },
    { name: "missing heading", frontmatter: { introduction: "Introduction" } },
    { name: "an array instead of an object", frontmatter: [] },
    { name: "text instead of an object", frontmatter: "text" },
  ])(
    "rejects frontmatter with $name",
    ({ frontmatter }) => {
      expect(() => parseProfileMarkdown(profileSource(frontmatter))).toThrow(z.ZodError);
    },
  );

  it("rejects an unknown frontmatter field", () => {
    expect(() => parseProfileMarkdown(profileSource({
      ...profileFrontmatterFixture,
      body: "Frontmatter must not override the Markdown body",
    }))).toThrow(z.ZodError);
  });

  it("rejects a blank body even when the frontmatter is valid", () => {
    expect(() => parseProfileMarkdown(profileSource(profileFrontmatterFixture, " \n\t")))
      .toThrow(z.ZodError);
  });

  it("preserves indentation in the parsed Markdown body", () => {
    const body = "    indented code\n\nA paragraph.\n";

    expect(parseProfileMarkdown(profileSource(profileFrontmatterFixture, body)).body)
      .toBe(body);
  });
});
