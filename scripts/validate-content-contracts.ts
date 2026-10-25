import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseSiteYaml } from "@/server/content/site.parser";

async function main() {
  const filename = join(process.cwd(), "content", "site.yaml");
  const source = await readFile(filename, "utf8");

  parseSiteYaml(source);

  console.log("Site content schema valid: content/site.yaml");
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown content error";

  console.error(
    "Site content validation failed for content/site.yaml:",
    message,
  );

  process.exitCode = 1;
});
