import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";
import { loadSiteContent } from "@/server/content/site.loader";
import { siteContentFixture } from "@/test/fixtures/site";

// Keep file access and the server-only module outside this page unit test.
vi.mock("@/server/content/site.loader", () => ({
  loadSiteContent: vi.fn(),
}));

describe("Home", () => {
  beforeEach(() => {
    vi.mocked(loadSiteContent).mockReset();
  });

  it("renders the loaded title and description with a main landmark", async () => {
    const site = {
      ...siteContentFixture,
      title: "Configured portfolio title",
      description: "This introduction comes from validated content.",
    };
    vi.mocked(loadSiteContent).mockResolvedValue(site);

    // Resolve the async function, then test its returned markup.
    render(await Home());

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: site.title, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(site.description)).toBeInTheDocument();
    expect(
      screen.getByText("Under construction. Come back soon."),
    ).toBeInTheDocument();
    expect(loadSiteContent).toHaveBeenCalledTimes(1);
  });

  it("propagates a content-loading failure instead of rendering fallback content", async () => {
    const error = new Error("Failed to load content/site.yaml");
    vi.mocked(loadSiteContent).mockRejectedValue(error);

    await expect(Home()).rejects.toBe(error);
  });
});
