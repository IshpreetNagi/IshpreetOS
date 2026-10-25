import type { ComponentType } from "react";
import type { AppId } from "@/os/app-registry/types";

export type AppComponentLoader = () => Promise<ComponentType>;

export const APP_COMPONENT_LOADERS: Record<AppId, AppComponentLoader> = {
  about: async () => {
    const { AboutApp } = await import("@/apps/about/about-app");
    return AboutApp;
  },
  projects: async () => {
    const { ProjectsApp } = await import("@/apps/projects/projects-app");
    return ProjectsApp;
  },
  experience: async () => {
    const { ExperienceApp } = await import("@/apps/experience/experience-app");
    return ExperienceApp;
  },
  settings: async () => {
    const { SettingsApp } = await import("@/apps/settings/settings-app");
    return SettingsApp;
  },
};
