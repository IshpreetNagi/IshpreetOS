import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutApp } from "@/apps/about/about-app";
import { ProjectsApp } from "@/apps/projects/projects-app";
import { ExperienceApp } from "@/apps/experience/experience-app";
import { SettingsApp } from "@/apps/settings/settings-app";
import { APP_COMPONENT_LOADERS } from "@/os/app-registry/component-loader";
import { APP_IDS } from "@/os/app-registry/types";

const appCases = [
  { id: "about", component: AboutApp, heading: "About" },
  { id: "projects", component: ProjectsApp, heading: "Projects" },
  { id: "experience", component: ExperienceApp, heading: "Experience" },
  { id: "settings", component: SettingsApp, heading: "Settings" },
] as const;

describe("application component loaders", () => {
  it("provides one loader for every known app and no additional apps", () => {
    expect(Object.keys(APP_COMPONENT_LOADERS).sort()).toEqual(
      [...APP_IDS].sort(),
    );
  });

  for (const { id, component, heading } of appCases) {
    it(`loads the ${id} component and renders its placeholder`, async () => {
      const Component = await APP_COMPONENT_LOADERS[id]();

      expect(Component).toBe(component);

      render(<Component />);
      expect(
        screen.getByRole("heading", { name: heading, level: 1 }),
      ).toBeInTheDocument();
    });
  }
});
