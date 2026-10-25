import { z } from "zod";

const nonEmptyText = z.string().trim().min(1);

export const profileFrontmatterSchema = z.strictObject({
  heading: nonEmptyText,
  introduction: nonEmptyText,
});

export const profileSchema = profileFrontmatterSchema.extend({
  body: z.string().refine((body) => body.trim().length > 0, {
    message: "Markdown body must not be blank",
  }),
});

export type ProfileContent = z.infer<typeof profileSchema>;
