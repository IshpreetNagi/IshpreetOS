// @vitest-environment node
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateContentDirectory } from "./validate-content.mjs";

describe("content syntax validation", () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "ishpreetos-content-"));
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("validates nested Markdown frontmatter and YAML mappings", async () => {
    await mkdir(join(directory, "projects"));
    await writeFile(join(directory, "projects", "demo.md"), "---\ntitle: Demo\n---\n# Demo\n");
    await writeFile(join(directory, "site.yaml"), "title: IshpreetOS\n");
    expect(await validateContentDirectory(directory)).toEqual({
      files: ["projects/demo.md", "site.yaml"], errors: [],
    });
  });

  it.each([
    ["broken.yaml", "title: [unterminated"],
    ["duplicate.yaml", "title: One\ntitle: Two\n"],
    ["array.yaml", "- not\n- a mapping\n"],
    ["broken.md", "---\ntitle: [unterminated\n---\n# Demo\n"],
    ["array.md", "---\n- not\n- a mapping\n---\n# Demo\n"],
    ["unclosed.md", "---\ntitle: Demo\n"],
    ["executable.md", "---javascript\n({ title: 'Never execute' })\n---\n"],
    ["executable.mdx", "# MDX is excluded\n"],
  ])("reports invalid content in %s", async (filename, source) => {
    await writeFile(join(directory, filename), source);
    const result = await validateContentDirectory(directory);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain(filename);
  });

  it("reports all invalid files instead of stopping at the first", async () => {
    await writeFile(join(directory, "one.yaml"), "title: [");
    await writeFile(join(directory, "two.yaml"), "title: [");
    expect((await validateContentDirectory(directory)).errors).toHaveLength(2);
  });

  it("accepts Windows line endings and a Unicode byte-order mark", async () => {
    await writeFile(join(directory, "windows.md"), "\uFEFF---\r\ntitle: Demo\r\n---\r\n# Demo\r\n");
    expect((await validateContentDirectory(directory)).errors).toEqual([]);
  });
});
