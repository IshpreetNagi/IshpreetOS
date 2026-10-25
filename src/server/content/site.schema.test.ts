import { describe, expect, it } from "vitest";
import { z } from "zod";
import { siteSchema } from "@/server/content/site.schema";

const validSite = {
  title: "IshpreetOS",
  description: "A personal operating system on the web",
  displayName: "Ishpreet",
  location: "Toronto",
  email: "ishpreetnagi@gmail.com",
  resumeUrl: "https://example.com/resume.pdf",
  socialLinks: [
    {
      label: "GitHub",
      url: "https://github.com/example",
    },
  ],
};

describe("site schema", () => {
  it("accepts valid site content", () => {
    expect(siteSchema.parse(validSite)).toEqual(validSite);
  });

  it.each([
    "title",
    "description",
    "displayName",
    "location",
    "email",
    "resumeUrl",
    "socialLinks",
  ])("requires the %s field", (field) => {
    const content: Record<string, unknown> = { ...validSite };
    delete content[field];

    expect(() => siteSchema.parse(content)).toThrow(z.ZodError);
  });

  it.each(["title", "description", "displayName", "location"])(
    "rejects empty or whitespace-only %s",
    (field) => {
      for (const value of ["", "   ", "\t\n"]) {
        expect(() =>
          siteSchema.parse({ ...validSite, [field]: value }),
        ).toThrow(z.ZodError);
      }
    },
  );

  it.each([
    "title",
    "description",
    "displayName",
    "location",
    "email",
    "resumeUrl",
  ])("rejects non-string values for %s", (field) => {
    for (const value of [123, true, null, {}, []]) {
      expect(() =>
        siteSchema.parse({ ...validSite, [field]: value }),
      ).toThrow(z.ZodError);
    }
  });

  it.each(["", "not-an-email", "name@", "@example.com", "name example.com"])(
    "rejects an invalid email (%s)",
    (email) => {
      expect(() => siteSchema.parse({ ...validSite, email })).toThrow(
        z.ZodError,
      );
    },
  );

  it.each([
    "",
    "not-a-url",
    "/resume.pdf",
    "javascript:alert(1)",
    "file:///private/resume.pdf",
    "ftp://example.com/resume.pdf",
  ])("rejects invalid or disallowed web URLs (%s)", (url) => {
    expect(() =>
      siteSchema.parse({ ...validSite, resumeUrl: url }),
    ).toThrow(z.ZodError);

    expect(() =>
      siteSchema.parse({
        ...validSite,
        socialLinks: [{ label: "GitHub", url }],
      }),
    ).toThrow(z.ZodError);
  });

  it("rejects a socialLinks value that is not an array", () => {
    for (const socialLinks of ["GitHub", {}, null, 123, true]) {
      expect(() => siteSchema.parse({ ...validSite, socialLinks })).toThrow(
        z.ZodError,
      );
    }
  });

  it("rejects malformed social-link entries", () => {
    const invalidLinks = [
      {},
      { label: "GitHub" },
      { url: "https://example.com" },
      { label: "", url: "https://example.com" },
      { label: "   ", url: "https://example.com" },
      { label: 123, url: "https://example.com" },
      { label: "GitHub", url: 123 },
      "GitHub",
      null,
    ];

    for (const link of invalidLinks) {
      expect(() =>
        siteSchema.parse({ ...validSite, socialLinks: [link] }),
      ).toThrow(z.ZodError);
    }
  });

  it("checks every social link, not only the first entry", () => {
    expect(() =>
      siteSchema.parse({
        ...validSite,
        socialLinks: [
          ...validSite.socialLinks,
          { label: "Another link", url: "not-a-url" },
        ],
      }),
    ).toThrow(z.ZodError);
  });

  it("rejects unexpected site fields, including misspelled field names", () => {
    expect(() =>
      siteSchema.parse({ ...validSite, decription: "A misspelled field" }),
    ).toThrow(z.ZodError);
  });

  it("rejects unexpected fields inside a social link", () => {
    expect(() =>
      siteSchema.parse({
        ...validSite,
        socialLinks: [{ ...validSite.socialLinks[0], extra: "unexpected" }],
      }),
    ).toThrow(z.ZodError);
  });

  it("identifies the invalid social-link field in its validation error", () => {
    const result = siteSchema.safeParse({
      ...validSite,
      socialLinks: [{ label: "GitHub", url: "not-a-url" }],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ["socialLinks", 0, "url"] }),
        ]),
      );
    }
  });

  it("allows an empty social-links list", () => {
    const content = { ...validSite, socialLinks: [] };

    expect(siteSchema.parse(content)).toEqual(content);
  });

  it("accepts both HTTP and HTTPS web links", () => {
    const content = {
      ...validSite,
      resumeUrl: "http://example.com/resume.pdf",
      socialLinks: [
        { label: "HTTP link", url: "http://example.com" },
        { label: "HTTPS link", url: "https://example.com" },
      ],
    };

    expect(siteSchema.parse(content)).toEqual(content);
  });

  it("trims surrounding whitespace from text and social-link labels", () => {
    const content = {
      ...validSite,
      title: `  ${validSite.title}  `,
      description: `  ${validSite.description}  `,
      displayName: `  ${validSite.displayName}  `,
      location: `  ${validSite.location}  `,
      socialLinks: validSite.socialLinks.map((link) => ({
        ...link,
        label: `  ${link.label}  `,
      })),
    };

    expect(siteSchema.parse(content)).toEqual(validSite);
  });
});
