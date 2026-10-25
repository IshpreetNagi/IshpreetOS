import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  profileFrontmatterSchema,
  profileSchema,
} from "@/server/content/profile.schema";
import {
  profileContentFixture,
  profileFrontmatterFixture,
} from "@/test/fixtures/profile";

describe("profile schemas", () => {
  it("accepts the frontmatter and complete profile shapes", () => {
    expect(profileFrontmatterSchema.parse(profileFrontmatterFixture)).toEqual(
      profileFrontmatterFixture,
    );
    expect(profileSchema.parse(profileContentFixture)).toEqual(profileContentFixture);
  });

  it.each(["heading", "introduction"])("requires %s", (field) => {
    const frontmatter: Record<string, unknown> = { ...profileFrontmatterFixture };
    delete frontmatter[field];

    expect(() => profileFrontmatterSchema.parse(frontmatter)).toThrow(z.ZodError);
  });

  it.each(["heading", "introduction"])("rejects invalid %s values", (field) => {
    for (const value of ["", "   ", 123, true, null, {}, []]) {
      expect(() =>
        profileFrontmatterSchema.parse({ ...profileFrontmatterFixture, [field]: value }),
      ).toThrow(z.ZodError);
    }
  });

  it("trims heading and introduction text", () => {
    expect(profileFrontmatterSchema.parse({
      heading: "  About Ishpreet  ",
      introduction: "  A short profile introduction.  ",
    })).toEqual(profileFrontmatterFixture);
  });

  it("rejects unknown frontmatter fields, including a body override", () => {
    for (const extra of [{ body: "Injected body" }, { headingTypo: "Example" }]) {
      expect(() =>
        profileFrontmatterSchema.parse({ ...profileFrontmatterFixture, ...extra }),
      ).toThrow(z.ZodError);
    }
  });

  it("requires a non-blank Markdown body", () => {
    for (const body of [undefined, null, 123, "", " \t\n"]) {
      expect(() => profileSchema.parse({ ...profileFrontmatterFixture, body })).toThrow(
        z.ZodError,
      );
    }
  });

  it("preserves Markdown body whitespace that can affect rendering", () => {
    const body = "    indented code\n\nA paragraph.\n";

    expect(profileSchema.parse({ ...profileFrontmatterFixture, body }).body).toBe(body);
  });

  it("rejects unexpected fields on the complete profile", () => {
    expect(() => profileSchema.parse({ ...profileContentFixture, extra: true })).toThrow(
      z.ZodError,
    );
  });
});
