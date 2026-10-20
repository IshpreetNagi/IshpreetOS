import { z } from "zod";

const httpUrl = z.url({ protocol: /^https?$/ });

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: httpUrl.optional(),
}).superRefine((environment, context) => {
  if (environment.NODE_ENV === "production" && !environment.NEXT_PUBLIC_SITE_URL) {
    context.addIssue({
      code: "custom",
      path: ["NEXT_PUBLIC_SITE_URL"],
      message: "Required for production builds",
    });
  }
}).transform((environment) => ({
  ...environment,
  NEXT_PUBLIC_SITE_URL: environment.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
}));

export type ServerEnvironment = z.infer<typeof environmentSchema>;

// Pure parsing stays testable. The server-only entry point reads process.env.
export function parseServerEnvironment(input: Record<string, string | undefined>) {
  const result = environmentSchema.safeParse(input);

  if (!result.success) {
    const fields = [...new Set(result.error.issues.map((issue) => issue.path.join(".")))];
    // Report field names only; provider secrets must never appear in error output.
    throw new Error(`Invalid server environment: ${fields.join(", ")}. Check .env.example.`);
  }

  return result.data;
}
