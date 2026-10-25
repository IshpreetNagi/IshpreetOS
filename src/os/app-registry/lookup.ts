import { APP_IDS } from "@/os/app-registry/types";
import type { AppDefinition, AppId } from "@/os/app-registry/types";
import { APP_REGISTRY } from "@/os/app-registry/registry";

export function isAppId(value: unknown): value is AppId {
  return typeof value === "string" && APP_IDS.some((appId) => appId === value);
}

export function getAppById(value: unknown): AppDefinition | undefined {
  if (!isAppId(value)) {
    return undefined;
  }

  return APP_REGISTRY[value];
}

export function getAppByRoute(value: unknown): AppDefinition | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  return Object.values(APP_REGISTRY).find((app) => app.route === value);
}
