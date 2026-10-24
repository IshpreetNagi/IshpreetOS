import type { AppId } from "@/os/app-registry/types";
import { getAppByRoute } from "@/os/app-registry/lookup";

export type AppNavigationTarget =
  | {
      appId: Exclude<AppId, "settings">;
    }
  | {
      appId: "settings";
      section?: "privacy";
    };

const ROUTE_ALIASES: {
  route: string;
  target: AppNavigationTarget;
}[] = [
  {
    route: "/privacy",
    target: {
      appId: "settings",
      section: "privacy",
    },
  },
];

export function resolveAppRoute(
  value: unknown,
): AppNavigationTarget | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const alias = ROUTE_ALIASES.find((entry) => entry.route === value);

  if (alias) {
    return alias.target;
  }

  const app = getAppByRoute(value);

  if (!app) {
    return undefined;
  }

  return { appId: app.id };
}
