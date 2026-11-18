// @vitest-environment node
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadProfileContent } from "@/server/content/profile.loader";
import {
  profileContentFixture,
  profileFrontmatterFixture,
  profileMarkdownFixture,
} from "@/test/fixtures/profile";
import { stringify } from "yaml";

vi.mock("server-only", () => ({}));
vi.mock("node:fs/promises", () => ({ readFile: vi.fn() }));

describe("profile content loader", () => {
  beforeEach(() => {
    vi.mocked(readFile).mockReset();
  });

  it("reads the profile as UTF-8 and returns validated data", async () => {
    vi.mocked(readFile).mockResolvedValue(profileMarkdownFixture);

    await expect(loadProfileContent()).resolves.toEqual(profileContentFixture);

    expect(readFile).toHaveBeenCalledExactlyOnceWith(
      join(process.cwd(), "content", "profile.md"),
      "utf8",
    );
  });

  it("identifies the profile file when reading fails", async () => {
    vi.mocked(readFile).mockRejectedValue(new Error("ENOENT: file not found"));

    await expect(loadProfileContent()).rejects.toThrow(
      "Failed to load content/profile.md: ENOENT: file not found",
    );
  });

  it("identifies the profile file and invalid field when validation fails", async () => {
    vi.mocked(readFile).mockResolvedValue(
      "---\nheading: About\n---\nA profile body.\n",
    );

    const loading = loadProfileContent();

    await expect(loading).rejects.toThrow("Failed to load content/profile.md:");
    await expect(loading).rejects.toThrow("introduction");
  });

  it("identifies the profile file when YAML frontmatter is malformed", async () => {
    vi.mocked(readFile).mockResolvedValue(
      "---\nheading: [unterminated\n---\nA profile body.\n",
    );

    const loading = loadProfileContent();

    await expect(loading).rejects.toThrow("Failed to load content/profile.md:");
    await expect(loading).rejects.toThrow(/flow sequence/i);
  });

  it("identifies the profile file when frontmatter is missing", async () => {
    vi.mocked(readFile).mockResolvedValue("A biography without frontmatter.\n");

    await expect(loadProfileContent()).rejects.toThrow(
      "Failed to load content/profile.md: Markdown must start with plain --- YAML frontmatter",
    );
  });

  it("identifies the profile file and duplicate frontmatter key", async () => {
    const frontmatter =
      stringify(profileFrontmatterFixture) + "heading: Duplicate heading\n";
    vi.mocked(readFile).mockResolvedValue(
      "---\n" + frontmatter + "---\nA profile body.\n",
    );

    const loading = loadProfileContent();

    await expect(loading).rejects.toThrow("Failed to load content/profile.md:");
    await expect(loading).rejects.toThrow(/unique/i);
  });

  it("handles a rejection that is not an Error object", async () => {
    vi.mocked(readFile).mockRejectedValue("unexpected rejection");

    await expect(loadProfileContent()).rejects.toThrow(
      "Failed to load content/profile.md: Unknown content error",
    );
  });
});
