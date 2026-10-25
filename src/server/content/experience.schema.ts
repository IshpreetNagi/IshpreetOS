import { z } from "zod";
import {
  contentMonthSchema,
  contentSlugSchema,
  markdownBodySchema,
  nonBlankTextSchema,
  technologiesSchema,
} from "@/server/content/content.rules";

const experienceBaseSchema = z.strictObject({
  company: nonBlankTextSchema,
  role: nonBlankTextSchema,
  location: nonBlankTextSchema,
  startDate: contentMonthSchema,
  technologies: technologiesSchema,
});

const currentExperienceSchema = experienceBaseSchema.extend({
  currentPosition: z.literal(true),
  endDate: z.null(),
});

const pastExperienceSchema = experienceBaseSchema.extend({
  currentPosition: z.literal(false),
  endDate: contentMonthSchema,
});

function datesInOrder(entry: { startDate: string; endDate: string | null }) {
  return entry.endDate === null || entry.endDate >= entry.startDate;
}

const dateOrderError = {
  message: "End month cannot precede start month",
  path: ["endDate"],
};

export const experienceFrontmatterSchema = z.discriminatedUnion("currentPosition", [
  currentExperienceSchema,
  pastExperienceSchema,
]).refine(datesInOrder, dateOrderError);

const experienceContentFields = {
  slug: contentSlugSchema,
  body: markdownBodySchema,
};

export const experienceSchema = z.discriminatedUnion("currentPosition", [
  currentExperienceSchema.extend(experienceContentFields),
  pastExperienceSchema.extend(experienceContentFields),
]).refine(datesInOrder, dateOrderError);

export const experienceCollectionSchema = z.array(experienceSchema).superRefine((entries, ctx) => {
  const slugs = new Set<string>();
  entries.forEach((entry, index) => {
    if (slugs.has(entry.slug)) {
      ctx.addIssue({ code: "custom", path: [index, "slug"], message: "Duplicate experience identifier" });
    }
    slugs.add(entry.slug);
  });
});

export type ExperienceFrontmatter = z.infer<typeof experienceFrontmatterSchema>;
export type ExperienceContent = z.infer<typeof experienceSchema>;
