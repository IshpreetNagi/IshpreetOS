import { describe, expect, it } from "vitest";
import { APP_REGISTRY } from "@/os/app-registry/registry";
import { APP_IDS } from "@/os/app-registry/types";

describe("application registry", () => {
  it("defines exactly the four approved application IDs", () => {
    expect([...APP_IDS].sort()).toEqual([
      "about",
      "experience",
      "projects",
      "settings",
    ]);
  });

  it("contains one entry for every known ID and no additional apps", () => {
    expect(Object.keys(APP_REGISTRY).sort()).toEqual([...APP_IDS].sort());
  });

  it("keeps each entry's ID consistent with its registry key", () => {
    for (const [key, app] of Object.entries(APP_REGISTRY)) {
      expect(app.id).toBe(key);
    }
  });

  it("uses the canonical route for each application ID", () => {
    for (const app of Object.values(APP_REGISTRY)) {
      expect(app.route).toBe(`/${app.id}`);
    }
  });

  it("does not assign the same route to multiple apps", () => {
    const routes = Object.values(APP_REGISTRY).map((app) => app.route);

    expect(new Set(routes).size).toBe(routes.length);
  });

  it("gives desktop-visible apps finite and distinct desktop orders", () => {
    const desktopApps = Object.values(APP_REGISTRY).filter(
      (app) => app.showOnDesktop,
    );
    const orders = desktopApps.map((app) => app.desktopOrder);

    for (const order of orders) {
      expect(Number.isFinite(order)).toBe(true);
    }

    expect(new Set(orders).size).toBe(orders.length);
  });

  it("provides a non-blank display title and icon key for every app", () => {
    for (const app of Object.values(APP_REGISTRY)) {
      expect(app.title).toMatch(/\S/);
      expect(app.iconKey).toMatch(/\S/);
    }
  });

  it("provides a non-blank metadata title and description for every app", () => {
    for (const app of Object.values(APP_REGISTRY)) {
      expect(app.metadata.title).toMatch(/\S/);
      expect(app.metadata.description).toMatch(/\S/);
    }
  });
});
