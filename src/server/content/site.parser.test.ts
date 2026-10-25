// @vitest-environment node
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { stringify } from "yaml";
import { z } from "zod";
import { parseSiteYaml } from "@/server/content/site.parser";
import { siteContentFixture, siteYamlFixture } from "@/test/fixtures/site";

describe("site YAML parser", () => {
  it("converts valid YAML into validated site content", () => {
    expect(parseSiteYaml(siteYamlFixture)).toEqual(siteContentFixture);
  });

  it("validates the repository's actual site.yaml file", async () => {
    const source = await readFile(
      join(process.cwd(), "content", "site.yaml"),
      "utf8",
    );

    expect(() => parseSiteYaml(source)).not.toThrow();
  });

  it("accepts comments, Windows line endings, and a byte-order mark", () => {
    const source = "\uFEFF# Site content\r\n" + siteYamlFixture.replaceAll("\n", "\r\n");

    expect(parseSiteYaml(source)).toEqual(siteContentFixture);
  });

  it("rejects malformed YAML before schema validation", () => {
    expect(() => parseSiteYaml("title: [unterminated")).toThrow();
  });

  it("rejects duplicate top-level keys instead of silently overwriting them", () => {
    expect(() =>
      parseSiteYaml(siteYamlFixture + "title: Duplicate title\n"),
    ).toThrow(/unique/i);
  });

  it("rejects duplicate keys inside a social-link entry", () => {
    const source = siteYamlFixture +
      "  - label: First label\n    label: Duplicate label\n    url: https://example.com\n";

    expect(() => parseSiteYaml(source)).toThrow(/unique/i);
  });

  it("rejects multiple YAML documents in a single site file", () => {
    expect(() =>
      parseSiteYaml(siteYamlFixture + "---\n" + siteYamlFixture),
    ).toThrow();
  });

  it.each(["", "null", "hello", "123", "[]", "- item\n"])(
    "rejects content that is not the required site object (%s)",
    (source) => {
      expect(() => parseSiteYaml(source)).toThrow(z.ZodError);
    },
  );

  it("rejects syntactically valid YAML with missing required fields", () => {
    expect(() => parseSiteYaml("title: IshpreetOS\n")).toThrow(z.ZodError);
  });

  it("rejects syntactically valid YAML with an invalid field value", () => {
    const source = stringify({ ...siteContentFixture, email: "not-an-email" });

    expect(() => parseSiteYaml(source)).toThrow(z.ZodError);
  });

  it("rejects unexpected fields in YAML", () => {
    const source = siteYamlFixture + "decription: Misspelled field\n";

    expect(() => parseSiteYaml(source)).toThrow(z.ZodError);
  });
});
