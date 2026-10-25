// @vitest-environment node
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { stringify } from "yaml";
import { loadSiteContent } from "@/server/content/site.loader";
import { siteContentFixture, siteYamlFixture } from "@/test/fixtures/site";

// Next.js enforces this boundary; ordinary Vitest does not run as a server component.
// This mock lets us test the loader, not the client-import protection itself.
vi.mock("server-only", () => ({}));
vi.mock("node:fs/promises", () => ({ readFile: vi.fn() }));

describe("site content loader", () => {
  beforeEach(() => {
    vi.mocked(readFile).mockReset();
  });

  it("reads content/site.yaml as UTF-8 and returns validated data", async () => {
    vi.mocked(readFile).mockResolvedValue(siteYamlFixture);

    await expect(loadSiteContent()).resolves.toEqual(siteContentFixture);
    expect(readFile).toHaveBeenCalledExactlyOnceWith(
      join(process.cwd(), "content", "site.yaml"),
      "utf8",
    );
  });

  it("identifies the file when reading fails", async () => {
    vi.mocked(readFile).mockRejectedValue(new Error("ENOENT: file not found"));

    await expect(loadSiteContent()).rejects.toThrow(
      "Failed to load content/site.yaml: ENOENT: file not found",
    );
  });

  it("identifies the file when YAML syntax is malformed", async () => {
    vi.mocked(readFile).mockResolvedValue("title: [unterminated");

    await expect(loadSiteContent()).rejects.toThrow(
      "Failed to load content/site.yaml:",
    );
  });

  it("identifies the file and duplicate-key problem", async () => {
    vi.mocked(readFile).mockResolvedValue(
      siteYamlFixture + "title: Duplicate title\n",
    );

    await expect(loadSiteContent()).rejects.toThrow(
      /Failed to load content\/site\.yaml:[\s\S]*unique/i,
    );
  });

  it("identifies the file and invalid schema field", async () => {
    vi.mocked(readFile).mockResolvedValue(
      stringify({ ...siteContentFixture, email: "not-an-email" }),
    );

    const loading = loadSiteContent();

    await expect(loading).rejects.toThrow("Failed to load content/site.yaml:");
    await expect(loading).rejects.toThrow("email");
  });

  it("handles a rejection that is not an Error object", async () => {
    vi.mocked(readFile).mockRejectedValue("unexpected rejection");

    await expect(loadSiteContent()).rejects.toThrow(
      "Failed to load content/site.yaml: Unknown content error",
    );
  });
});
