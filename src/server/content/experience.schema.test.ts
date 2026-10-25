import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  experienceCollectionSchema,
  experienceFrontmatterSchema,
  experienceSchema,
} from "@/server/content/experience.schema";
import {
  experienceContentFixture,
  experienceFrontmatterFixture,
} from "@/test/fixtures/experience";

describe("experience schemas", () => {
  it("accepts a past role and its complete content shape", () => {
    expect(experienceFrontmatterSchema.parse(experienceFrontmatterFixture)).toEqual(experienceFrontmatterFixture);
    expect(experienceSchema.parse(experienceContentFixture)).toEqual(experienceContentFixture);
  });

  it("accepts a current role only with an explicit null end date", () => {
    const currentRole = {
      ...experienceFrontmatterFixture,
      currentPosition: true,
      endDate: null,
    };

    expect(experienceFrontmatterSchema.parse(currentRole)).toEqual(currentRole);
    expect(experienceSchema.parse({
      ...experienceContentFixture,
      currentPosition: true,
      endDate: null,
    }).endDate).toBeNull();
  });

  it.each([
    "company", "role", "location", "startDate",
    "endDate", "currentPosition", "technologies",
  ])("requires the %s field", (field) => {
    const entry: Record<string, unknown> = { ...experienceFrontmatterFixture };
    delete entry[field];

    expect(() => experienceFrontmatterSchema.parse(entry)).toThrow(z.ZodError);
  });

  it.each([
    { name: "a current role with an end date", patch: { currentPosition: true, endDate: "2026-01" } },
    { name: "a past role with a null end date", patch: { currentPosition: false, endDate: null } },
    { name: "a text current-position flag", patch: { currentPosition: "true", endDate: null } },
    { name: "a Present string instead of null", patch: { currentPosition: true, endDate: "Present" } },
  ])("rejects $name", ({ patch }) => {
    expect(() => experienceFrontmatterSchema.parse({
      ...experienceFrontmatterFixture, ...patch,
    })).toThrow(z.ZodError);
  });

  it("requires end dates on or after the start month and identifies the field", () => {
    const result = experienceFrontmatterSchema.safeParse({
      ...experienceFrontmatterFixture, endDate: "2024-12",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(expect.arrayContaining([
        expect.objectContaining({ path: ["endDate"] }),
      ]));
    }
    expect(() => experienceSchema.parse({
      ...experienceContentFixture, endDate: "2024-12",
    })).toThrow(z.ZodError);
    expect(experienceFrontmatterSchema.parse({
      ...experienceFrontmatterFixture, endDate: experienceFrontmatterFixture.startDate,
    }).endDate).toBe(experienceFrontmatterFixture.startDate);
  });

  it.each(["2025-00", "2025-13", "0000-01", "2025-1", "2025-01-01", "Present"])(
    "rejects invalid date values (%s)",
    (value) => {
      for (const field of ["startDate", "endDate"]) {
        expect(() => experienceFrontmatterSchema.parse({
          ...experienceFrontmatterFixture, [field]: value,
        })).toThrow(z.ZodError);
      }
    },
  );

  it("requires non-blank company, role, and location", () => {
    for (const field of ["company", "role", "location"]) {
      for (const value of ["", "   ", 123, null]) {
        expect(() => experienceFrontmatterSchema.parse({
          ...experienceFrontmatterFixture, [field]: value,
        })).toThrow(z.ZodError);
      }
    }
  });

  it("trims ordinary fields and technology labels, but not the responsibilities", () => {
    const body = "    code example\n\n- Responsibility one\n- Responsibility two\n  - Nested detail\n";
    const content = experienceSchema.parse({
      ...experienceContentFixture,
      company: "  Example organization  ",
      role: "  Software developer  ",
      location: "  Remote  ",
      technologies: [" TypeScript ", " React "],
      body,
    });

    expect(content.company).toBe("Example organization");
    expect(content.role).toBe("Software developer");
    expect(content.location).toBe("Remote");
    expect(content.technologies).toEqual(["TypeScript", "React"]);
    expect(content.body).toBe(body);
  });

  it("allows empty technology lists but rejects blank or duplicate entries", () => {
    expect(experienceFrontmatterSchema.parse({
      ...experienceFrontmatterFixture, technologies: [],
    }).technologies).toEqual([]);

    for (const technologies of [["React", " react "], ["React", " "], [123], "React", null]) {
      expect(() => experienceFrontmatterSchema.parse({
        ...experienceFrontmatterFixture, technologies,
      })).toThrow(z.ZodError);
    }
  });

  it("requires a non-blank body and a valid filename-derived identifier", () => {
    for (const body of ["", " \t\n", null, 123]) {
      expect(() => experienceSchema.parse({ ...experienceContentFixture, body })).toThrow(z.ZodError);
    }
    for (const slug of ["../position", "UpperCase", "position_name", ""]) {
      expect(() => experienceSchema.parse({ ...experienceContentFixture, slug })).toThrow(z.ZodError);
    }
  });

  it("rejects unknown frontmatter fields and content-field overrides", () => {
    for (const extra of [{ body: "Override" }, { slug: "override" }, { current: true }]) {
      expect(() => experienceFrontmatterSchema.parse({
        ...experienceFrontmatterFixture, ...extra,
      })).toThrow(z.ZodError);
    }
  });

  it("rejects duplicate entry identifiers without restricting multiple roles at one company", () => {
    expect(() => experienceCollectionSchema.parse([
      experienceContentFixture,
      experienceContentFixture,
    ])).toThrow(z.ZodError);

    expect(experienceCollectionSchema.parse([
      experienceContentFixture,
      { ...experienceContentFixture, slug: "another-position" },
    ])).toHaveLength(2);
  });
});
