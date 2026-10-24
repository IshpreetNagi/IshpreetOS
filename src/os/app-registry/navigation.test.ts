import { describe, expect, it } from "vitest";
import { resolveAppRoute } from "@/os/app-registry/navigation";

const routeCases = [
  { route: "/about", appId: "about" },
  { route: "/projects", appId: "projects" },
  { route: "/experience", appId: "experience" },
  { route: "/settings", appId: "settings" },
] as const;

describe("resolveAppRoute", () => {
  it("resolves every main route to its app without a section", () => {
    for (const { route, appId } of routeCases) {
      expect(resolveAppRoute(route)).toEqual({ appId });
    }
  });

  it("resolves Privacy to the privacy section of Settings", () => {
    expect(resolveAppRoute("/privacy")).toEqual({
      appId: "settings",
      section: "privacy",
    });
  });

  it("returns undefined for unknown routes and app IDs without a slash", () => {
    const invalidRoutes = [
      "",
      "/",
      "/spotify",
      "/About",
      "/Privacy",
      "about",
      "settings",
      "privacy",
      "toString",
      "__proto__",
    ];

    for (const route of invalidRoutes) {
      expect(resolveAppRoute(route)).toBeUndefined();
    }
  });

  it("returns undefined for non-string input", () => {
    const invalidValues = [123, true, null, undefined, {}, [], { route: "/privacy" }];

    for (const value of invalidValues) {
      expect(resolveAppRoute(value)).toBeUndefined();
    }
  });
});
