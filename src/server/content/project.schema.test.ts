import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  projectCollectionSchema,
  projectFrontmatterSchema,
  projectSchema,
} from "@/server/content/project.schema";
import {
  projectContentFixture,
  projectFrontmatterFixture,
} from "@/test/fixtures/project";

describe("project schemas", () => {
  it("accepts a completed project and its full content shape", () => {
    expect(projectFrontmatterSchema.parse(projectFrontmatterFixture)).toEqual(projectFrontmatterFixture);
    expect(projectSchema.parse(projectContentFixture)).toEqual(projectContentFixture);
  });

  it("accepts an in-progress project without a completion date", () => {
    const project: Record<string, unknown> = { ...projectFrontmatterFixture, status: "in-progress" };
    delete project.completionDate;

    expect(projectFrontmatterSchema.parse(project)).toEqual(project);
  });

  it.each([
    "name", "description", "status", "completionDate",
    "technologies", "githubUrl", "screenshot", "order",
  ])("requires the completed project's %s field", (field) => {
    const project: Record<string, unknown> = { ...projectFrontmatterFixture };
    delete project[field];

    expect(() => projectFrontmatterSchema.parse(project)).toThrow(z.ZodError);
  });

  it("rejects a completion date on an in-progress project", () => {
    expect(() => projectFrontmatterSchema.parse({
      ...projectFrontmatterFixture, status: "in-progress",
    })).toThrow(z.ZodError);
  });

  it.each(["planned", "archived", "", null])("rejects an unsupported status (%s)", (status) => {
    expect(() => projectFrontmatterSchema.parse({ ...projectFrontmatterFixture, status })).toThrow(z.ZodError);
  });

  it.each(["2026-00", "2026-13", "0000-01", "2026-1", "2026-10-25", "Present"])(
    "rejects an invalid completion month (%s)",
    (completionDate) => {
      expect(() => projectFrontmatterSchema.parse({ ...projectFrontmatterFixture, completionDate })).toThrow(z.ZodError);
    },
  );

  it("trims ordinary text but keeps Markdown notes unchanged", () => {
    const body = "    indented code\n\n- First note\n  - Nested note\n";
    const parsed = projectSchema.parse({
      ...projectContentFixture,
      name: "  Example project  ",
      description: "  Description  ",
      body,
    });

    expect(parsed.name).toBe("Example project");
    expect(parsed.description).toBe("Description");
    expect(parsed.body).toBe(body);
  });

  it("allows omitted live links, empty technology lists, and no additional notes", () => {
    expect(projectSchema.parse({
      ...projectContentFixture, technologies: [], body: "",
    })).not.toHaveProperty("liveUrl");
  });

  it.each(["", "   "])("rejects blank names and descriptions (%j)", (value) => {
    for (const field of ["name", "description"]) {
      expect(() => projectFrontmatterSchema.parse({
        ...projectFrontmatterFixture, [field]: value,
      })).toThrow(z.ZodError);
    }
  });

  it.each(["not-a-url", "", "javascript:alert(1)", "file:///private", "ftp://example.com"])(
    "rejects invalid repository and live links (%s)",
    (value) => {
      for (const field of ["githubUrl", "liveUrl"]) {
        expect(() => projectFrontmatterSchema.parse({
          ...projectFrontmatterFixture, [field]: value,
        })).toThrow(z.ZodError);
      }
    },
  );

  it("accepts HTTP/HTTPS links and validates every technology label", () => {
    expect(projectFrontmatterSchema.parse({
      ...projectFrontmatterFixture,
      githubUrl: "http://github.com/example/project",
      liveUrl: "https://example.com",
      technologies: [" React ", " TypeScript "],
    }).technologies).toEqual(["React", "TypeScript"]);

    for (const technologies of [["React", ""], ["React", " react "], [123], "React", null]) {
      expect(() => projectFrontmatterSchema.parse({
        ...projectFrontmatterFixture, technologies,
      })).toThrow(z.ZodError);
    }
  });

  it.each([
    "/images/projects/../private.png",
    "/images/projects/%2e%2e/private.png",
    "/images/projects//example.png",
    "/images/projects/example.png?query=1",
    "/images/projects/example.png#fragment",
    "/images/projects/example.png\u0000",
    "/images/projects/example.txt",
    "/images/profile/example.png",
    "https://example.com/example.png",
    "public/images/projects/example.png",
    "/images/projects\\example.png",
  ])("rejects an invalid screenshot path (%s)", (src) => {
    expect(() => projectFrontmatterSchema.parse({
      ...projectFrontmatterFixture,
      screenshot: { ...projectFrontmatterFixture.screenshot, src },
    })).toThrow(z.ZodError);
  });

  it("requires screenshot alt text and rejects unknown screenshot fields", () => {
    for (const screenshot of [
      { src: "/images/projects/example.webp" },
      { src: "/images/projects/example.webp", alt: "   " },
      { ...projectFrontmatterFixture.screenshot, unknown: true },
    ]) {
      expect(() => projectFrontmatterSchema.parse({
        ...projectFrontmatterFixture, screenshot,
      })).toThrow(z.ZodError);
    }
  });

  it.each([-1, 0.5, Infinity, NaN, "1"])("rejects an invalid display order (%s)", (order) => {
    expect(() => projectFrontmatterSchema.parse({ ...projectFrontmatterFixture, order })).toThrow(z.ZodError);
  });

  it("rejects unknown frontmatter fields and content-field overrides", () => {
    for (const extra of [{ slug: "override" }, { body: "Override" }, { decription: "Typo" }]) {
      expect(() => projectFrontmatterSchema.parse({
        ...projectFrontmatterFixture, ...extra,
      })).toThrow(z.ZodError);
    }
  });

  it("validates filename-derived identifiers", () => {
    for (const slug of ["../project", "UpperCase", "project_name", ""]) {
      expect(() => projectSchema.parse({ ...projectContentFixture, slug })).toThrow(z.ZodError);
    }
  });

  it("rejects duplicate project identifiers and display orders", () => {
    expect(() => projectCollectionSchema.parse([
      projectContentFixture,
      { ...projectContentFixture, order: 1 },
    ])).toThrow(z.ZodError);

    expect(() => projectCollectionSchema.parse([
      projectContentFixture,
      { ...projectContentFixture, slug: "another-project" },
    ])).toThrow(z.ZodError);

    expect(projectCollectionSchema.parse([
      projectContentFixture,
      { ...projectContentFixture, slug: "another-project", order: 1 },
    ])).toHaveLength(2);
  });
});
