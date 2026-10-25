import type { AppDefinition, AppId } from "@/os/app-registry/types";

export const APP_REGISTRY: Record<AppId, AppDefinition> = {
  about: {
    id: "about",
    title: "About",
    route: "/about",
    iconKey: "about",
    desktopOrder: 1,
    showOnDesktop: true,
    metadata: {
      title: "About Ishpreet | IshpreetOS",
      description: "Learn about Ishpreet, his background, and his interests.",
    },
  },
  projects: {
    id: "projects",
    title: "Projects",
    route: "/projects",
    iconKey: "projects",
    desktopOrder: 2,
    showOnDesktop: true,
    metadata: {
      title: "Ishpreet's Projects | IshpreetOS",
      description:
        "Learn about Ishpreet's projects over his developer journey.",
    },
  },
  experience: {
    id: "experience",
    title: "Experience",
    route: "/experience",
    iconKey: "experience",
    desktopOrder: 3,
    showOnDesktop: true,
    metadata: {
      title: "Ishpreet's Experience | IshpreetOS",
      description: "Learn about Ishpreet's various experiences as a developer.",
    },
  },
  settings: {
    id: "settings",
    title: "Settings",
    route: "/settings",
    iconKey: "settings",
    desktopOrder: 4,
    showOnDesktop: true,
    metadata: {
      title: "Settings | IshpreetOS",
      description: "Customize your experience of IshpreetOS.",
    },
  },
};
