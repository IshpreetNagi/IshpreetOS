import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";
import { parseDocument } from "yaml";
import { z } from "zod";

const mappingSchema = z.record(z.string(), z.unknown());

/** @param {string} source */
function parseYamlMapping(source) {
  const document = parseDocument(source);
  if (document.errors.length > 0) {
    throw new Error(document.errors.map((error) => error.message).join("; "));
  }
  const value = document.toJS();
  if (!mappingSchema.safeParse(value).success) {
    throw new Error("YAML and frontmatter must contain a key/value mapping");
  }
  return value;
}

/** @param {string} source */
function validateMarkdown(source) {
  const normalized = source.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n");
  if (normalized.startsWith("---") && normalized[3] !== "-") {
    const openingLine = normalized.split("\n", 1)[0];
    // gray-matter also supports executable JS engines; only plain YAML is allowed.
    if (!/^---[\t ]*$/.test(openingLine)) {
      throw new Error("Frontmatter must use plain --- YAML delimiters");
    }
    if (!/^---[\t ]*$/m.test(normalized.slice(openingLine.length + 1))) {
      throw new Error("Frontmatter is missing its closing --- delimiter");
    }
  }
  matter(normalized, { engines: { yaml: parseYamlMapping } });
}

/**
 * P0 syntax gate. P1 adds domain schemas and shared runtime content loaders.
 * @param {string} contentRoot
 */
export async function validateContentDirectory(contentRoot) {
  /** @type {string[]} */
  const files = [];
  /** @type {string[]} */
  const errors = [];

  /** @param {string} directory */
  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const filename = join(directory, entry.name);
      const displayPath = relative(contentRoot, filename).replaceAll("\\", "/");
      if (entry.isDirectory()) {
        await visit(filename);
        continue;
      }
      if (!entry.isFile()) {
        errors.push(`${displayPath}: content must be a regular file`);
        continue;
      }
      const extension = extname(entry.name).toLowerCase();
      if (extension === ".mdx") {
        errors.push(`${displayPath}: MDX is not supported; use Markdown`);
        continue;
      }
      if (![".md", ".yaml", ".yml"].includes(extension)) continue;
      files.push(displayPath);
      try {
        const source = await readFile(filename, "utf8");
        if (extension === ".md") {
          validateMarkdown(source);
        } else {
          parseYamlMapping(source);
        }
      } catch (error) {
        errors.push(`${displayPath}: ${error instanceof Error ? error.message : "Invalid content"}`);
      }
    }
  }

  await visit(contentRoot);
  return { files, errors };
}

async function main() {
  const contentRoot = fileURLToPath(new URL("../content/", import.meta.url));
  const { files, errors } = await validateContentDirectory(contentRoot);
  if (errors.length > 0) {
    console.error(`Content validation failed:\n${errors.join("\n")}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Content syntax valid: ${files.length} Markdown/YAML file(s). Domain schemas arrive in P1.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : "Content validation failed");
    process.exitCode = 1;
  });
}
