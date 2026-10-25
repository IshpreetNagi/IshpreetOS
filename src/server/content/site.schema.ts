import { z } from "zod";

const nonEmptyText = z.string().trim().min(1);
const webUrl = z.url({ protocol: /^https?$/ });

const socialLinkSchema = z.strictObject({
  label: nonEmptyText,
  url: webUrl,
});

export const siteSchema = z.strictObject({
  title: nonEmptyText,
  description: nonEmptyText,
  displayName: nonEmptyText,
  location: nonEmptyText,
  email: z.email(),
  resumeUrl: webUrl,
  socialLinks: z.array(socialLinkSchema),
});

export type SiteContent = z.infer<typeof siteSchema>;
