// @vitest-environment node
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { stringify } from "yaml";
import { siteContentFixture, siteYamlFixture } from "@/test/fixtures/site";

const execFileAsync = promisify(execFile);
const projectRoot = process.cwd();
const require = createRequire(import.meta.url);
const tsxCommand = require.resolve("tsx/cli");
const validator = join(projectRoot, "scripts", "validate-content-contracts.ts");
const tsconfig = join(projectRoot, "tsconfig.json");

describe("content-contract validation command", () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), "ishpreetos-contracts-"));
    await mkdir(join(directory, "content"));
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  function runValidator() {
    // Use the real runner and parser, but read content from an isolated directory.
    return execFileAsync(
      process.execPath,
      [tsxCommand, "--tsconfig", tsconfig, validator],
      { cwd: directory, timeout: 10_000 },
    );
  }

  it("exits successfully when the site content satisfies its schema", async () => {
    await writeFile(join(directory, "content", "site.yaml"), siteYamlFixture);

    const result = await runValidator();

    expect(result.stdout).toContain("Site content schema valid: content/site.yaml");
    expect(result.stderr).toBe("");
  }, 15_000);

  it("exits with code 1 and identifies a missing site file", async () => {
    await expect(runValidator()).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining("content/site.yaml"),
    });
  }, 15_000);

  it("exits with code 1 for malformed YAML", async () => {
    await writeFile(
      join(directory, "content", "site.yaml"),
      "title: [unterminated",
    );

    await expect(runValidator()).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining("Site content validation failed for content/site.yaml:"),
    });
  }, 15_000);

  it("exits with code 1 for duplicate YAML keys", async () => {
    await writeFile(
      join(directory, "content", "site.yaml"),
      siteYamlFixture + "title: Duplicate title\n",
    );

    await expect(runValidator()).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringMatching(/content\/site\.yaml[\s\S]*unique/i),
    });
  }, 15_000);

  it("exits with code 1 and identifies a missing required field", async () => {
    const content: Record<string, unknown> = { ...siteContentFixture };
    delete content.email;
    await writeFile(join(directory, "content", "site.yaml"), stringify(content));

    await expect(runValidator()).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringMatching(/content\/site\.yaml[\s\S]*email/),
    });
  }, 15_000);

  it.each([
    {
      name: "an invalid email",
      content: { ...siteContentFixture, email: "not-an-email" },
      field: "email",
    },
    {
      name: "a disallowed URL protocol",
      content: { ...siteContentFixture, resumeUrl: "javascript:alert(1)" },
      field: "resumeUrl",
    },
    {
      name: "an unexpected field",
      content: { ...siteContentFixture, decription: "Misspelled field" },
      field: "decription",
    },
  ])("exits with code 1 for $name", async ({ content, field }) => {
    await writeFile(join(directory, "content", "site.yaml"), stringify(content));

    await expect(runValidator()).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining(field),
    });
  }, 15_000);
});
