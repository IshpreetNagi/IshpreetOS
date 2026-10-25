import matter from "gray-matter";
import { parseDocument } from "yaml";

export function parseMarkdown(source: string): {
  frontmatter: unknown;
  body: string;
} {
  const normalized = source.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n");

  const lines = normalized.split("\n");

  if (!/^---[\t ]*$/.test(lines[0])) {
    throw new Error("Markdown must start with plain --- YAML frontmatter");
  }

  const closingLine = lines.slice(1).find((line) => line.startsWith("---"));

  if (!closingLine || !/^---[\t ]*$/.test(closingLine)) {
    throw new Error("Frontmatter requires a closing plain --- delimiter");
  }

  const parsed = matter(normalized, {
    engines: {
      yaml: (yamlSource: string) => {
        const document = parseDocument(yamlSource);

        if (document.errors.length > 0) {
          throw new Error(
            document.errors.map((error) => error.message).join("; "),
          );
        }

        return document.toJS();
      },
    },
  });

  return {
    frontmatter: parsed.data,
    body: parsed.content,
  };
}
