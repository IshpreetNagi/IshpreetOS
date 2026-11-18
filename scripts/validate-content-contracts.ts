import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseSiteYaml } from "@/server/content/site.parser";
import { parseProfileMarkdown } from "@/server/content/profile.parser";

async function validateContentFile(
  filename: string,
  label: string,
  parse: (source: string) => unknown,
) {
  try {
    const source = await readFile(
      join(process.cwd(), "content", filename),
      "utf8",
    );

    parse(source);

    console.log(`${label} content schema valid: content/${filename}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown content error";

    throw new Error(
      `${label} content validation failed for content/${filename}: ${message}`,
    );
  }
}

async function main() {
  await validateContentFile("site.yaml", "Site", parseSiteYaml);
  await validateContentFile("profile.md", "Profile", parseProfileMarkdown);
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown content error";

  console.error(message);
  process.exitCode = 1;
});
