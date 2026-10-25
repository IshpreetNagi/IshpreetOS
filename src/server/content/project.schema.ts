import { z } from "zod";
import {
  contentMonthSchema,
  contentSlugSchema,
  nonBlankTextSchema,
  technologiesSchema,
  webUrlSchema,
} from "@/server/content/content.rules";

const screenshotPathSchema = z.string().trim().refine((src) => {
  const segments = src.split("/").slice(1);
  return src.startsWith("/images/projects/")
    && !/[\\%?#]/.test(src)
    && [...src].every((character) => character.charCodeAt(0) >= 32)
    && segments.every((segment) => segment !== "" && segment !== "." && segment !== "..")
    && /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(src);
}, {
  message: "Expected a local image under /images/projects/ without path traversal",
});

const projectBaseSchema = z.strictObject({
  name: nonBlankTextSchema,
  description: nonBlankTextSchema,
  technologies: technologiesSchema,
  githubUrl: webUrlSchema,
  liveUrl: webUrlSchema.optional(),
  screenshot: z.strictObject({
    src: screenshotPathSchema,
    alt: nonBlankTextSchema,
  }),
  order: z.number().int().nonnegative(),
});

const completedProjectSchema = projectBaseSchema.extend({
  status: z.literal("completed"),
  completionDate: contentMonthSchema,
});

// Strict keys also reject a completionDate on an in-progress project.
const inProgressProjectSchema = projectBaseSchema.extend({
  status: z.literal("in-progress"),
});

export const projectFrontmatterSchema = z.discriminatedUnion("status", [
  completedProjectSchema,
  inProgressProjectSchema,
]);

const projectContentFields = {
  slug: contentSlugSchema,
  // Additional notes are optional in the file, represented by an empty string.
  body: z.string(),
};

export const projectSchema = z.discriminatedUnion("status", [
  completedProjectSchema.extend(projectContentFields),
  inProgressProjectSchema.extend(projectContentFields),
]);

export const projectCollectionSchema = z.array(projectSchema).superRefine((projects, ctx) => {
  const slugs = new Set<string>();
  const orders = new Set<number>();

  projects.forEach((project, index) => {
    if (slugs.has(project.slug)) {
      ctx.addIssue({ code: "custom", path: [index, "slug"], message: "Duplicate project identifier" });
    }
    if (orders.has(project.order)) {
      ctx.addIssue({ code: "custom", path: [index, "order"], message: "Project orders must be unique" });
    }
    slugs.add(project.slug);
    orders.add(project.order);
  });
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type ProjectContent = z.infer<typeof projectSchema>;
