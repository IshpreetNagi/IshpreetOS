import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseProfileMarkdown } from "@/server/content/profile.parser";
import type { ProfileContent } from "@/server/content/profile.schema";

export async function loadProfileContent(): Promise<ProfileContent> {
  const filename = join(process.cwd(), "content", "profile.md");

  try {
    const source = await readFile(filename, "utf8");
    return parseProfileMarkdown(source);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown content error";

    throw new Error(`Failed to load content/profile.md: ${message}`);
  }
}
