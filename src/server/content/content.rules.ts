import { z } from "zod";

export const nonBlankTextSchema = z.string().trim().min(1);
export const webUrlSchema = z.url({ protocol: /^https?$/ });

export const contentMonthSchema = z.string().regex(
  /^(?!0000)\d{4}-(0[1-9]|1[0-2])$/,
  "Expected a valid month in YYYY-MM format",
);

export const contentSlugSchema = z.string().regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "Expected a lowercase, hyphen-separated filename identifier",
);

// Check blankness without changing meaningful Markdown whitespace.
export const markdownBodySchema = z.string().refine(
  (body) => body.trim().length > 0,
  { message: "Markdown body must not be blank" },
);

export const technologiesSchema = z.array(nonBlankTextSchema).refine(
  (names) => new Set(names.map((name) => name.toLowerCase())).size === names.length,
  { message: "Technology names must be unique" },
);
