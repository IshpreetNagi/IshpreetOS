import { describe, expect, it, vi } from "vitest";
import { parseMarkdown } from "@/server/content/markdown.parser";
import {
  profileBodyFixture,
  profileFrontmatterFixture,
  profileMarkdownFixture,
} from "@/test/fixtures/profile";

describe("shared Markdown parser", () => {
  it("separates YAML frontmatter from the Markdown body", () => {
    const parsed = parseMarkdown(profileMarkdownFixture);

    expect(parsed.frontmatter).toEqual(profileFrontmatterFixture);
    expect(parsed.body).toBe(profileBodyFixture);
  });

  it("normalizes Windows line endings and removes a leading byte-order mark", () => {
    const source = "\uFEFF" + profileMarkdownFixture.replaceAll("\n", "\r\n");

    expect(parseMarkdown(source)).toEqual(parseMarkdown(profileMarkdownFixture));
  });

  it.each(["", "# No frontmatter", "----\nheading: Example\n---\nBody"])(
    "requires a plain YAML opening delimiter (%s)",
    (source) => {
      expect(() => parseMarkdown(source)).toThrow(/plain --- YAML/);
    },
  );

  it("rejects a missing closing delimiter", () => {
    expect(() => parseMarkdown("---\nheading: Example\n")).toThrow(/closing/);
  });

  it("rejects a closing delimiter with extra characters", () => {
    expect(() =>
      parseMarkdown("---\nheading: Example\n---invalid\n---\nBody"),
    ).toThrow(/closing plain ---/);
  });

  it.each(["javascript", "js", "json", "toml"])(
    "blocks the %s frontmatter engine before it can run",
    (engine) => {
      const execute = vi.fn();
      vi.stubGlobal("__ishpreetFrontmatterExecution", execute);

      try {
        const source = "---" + engine +
          "\n({ heading: globalThis.__ishpreetFrontmatterExecution() })\n---\nBody";

        expect(() => parseMarkdown(source)).toThrow(/plain --- YAML/);
        expect(execute).not.toHaveBeenCalled();
      } finally {
        vi.unstubAllGlobals();
      }
    },
  );

  it("rejects malformed YAML frontmatter", () => {
    expect(() =>
      parseMarkdown("---\nheading: [unterminated\n---\nBody"),
    ).toThrow();
  });

  it("rejects duplicate YAML keys", () => {
    expect(() =>
      parseMarkdown("---\nheading: First\nheading: Second\n---\nBody"),
    ).toThrow(/unique/i);
  });

  it("preserves body indentation, tables, task lists, and horizontal rules", () => {
    const body = "    indented code\n\n| Item | Status |\n| --- | --- |\n| A | Ready |\n\n- [x] Done\n\n---\n";
    const source = "---\nheading: Example\n---\n" + body;

    expect(parseMarkdown(source).body).toBe(body);
  });
});
