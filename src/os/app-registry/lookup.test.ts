import { describe, expect, it } from "vitest";
import { getAppById, isAppId, getAppByRoute } from "@/os/app-registry/lookup";
import { APP_REGISTRY } from "@/os/app-registry/registry";

const validIds = ["about", "projects", "experience", "settings"] as const;
const validRoutes = [
  { route: "/about", id: "about" },
  { route: "/projects", id: "projects" },
  { route: "/experience", id: "experience" },
  { route: "/settings", id: "settings" },
] as const;

const invalidIds = [
  "spotify",
  "About",
  "/about",
  "",
  "toString",
  "__proto__",
  123,
  true,
  null,
  undefined,
  {},
  [],
];

const invalidRoutes = [
  "/spotify",
  "/About",
  "/privacy",
  "about",
  "",
  "toString",
  "__proto__",
  123,
  true,
  null,
  undefined,
  {},
  [],
];

describe("isAppId", () => {
  it("accepts every known application ID", () => {
    for (const id of validIds) {
      expect(isAppId(id)).toBe(true);
    }
  });

  it("rejects unknown IDs and non-string values", () => {
    for (const value of invalidIds) {
      expect(isAppId(value)).toBe(false);
    }
  });
});

describe("getAppById", () => {
  it("returns the matching registry entry for every known ID", () => {
    for (const id of validIds) {
      expect(getAppById(id)).toBe(APP_REGISTRY[id]);
    }
  });

  it("returns undefined for invalid input", () => {
    for (const value of invalidIds) {
      expect(getAppById(value)).toBeUndefined();
    }
  });
});

describe("getAppByRoute", () => {
  it("returns the matching registry entry for every known application route", () => {
    for (const { route, id } of validRoutes) {
      expect(getAppByRoute(route)).toBe(APP_REGISTRY[id]);
    }
  });

  it("returns undefined for invalid input", () => {
    for (const value of invalidRoutes) {
      expect(getAppByRoute(value)).toBeUndefined();
    }
  });
});
