import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseSiteYaml } from "@/server/content/site.parser";
import type { SiteContent } from "@/server/content/site.schema";

export async function loadSiteContent(): Promise<SiteContent> {
  const filename = join(process.cwd(), "content", "site.yaml");

  try {
    const source = await readFile(filename, "utf8");
    return parseSiteYaml(source);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown content error";

    throw new Error(`Failed to load content/site.yaml: ${message}`);
  }
}
