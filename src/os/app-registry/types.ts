export const APP_IDS = ["about", "projects", "experience", "settings"] as const;

export type AppId = (typeof APP_IDS)[number];

export type AppDefinition = {
  id: AppId;
  title: string; // What visitors see
  route: `/${AppId}`; // the URL path for each AppId only
  iconKey: string; // The label used to find it's icon
  desktopOrder: number; // where the icon belongs on the desktop, icon's order on the list
  showOnDesktop: boolean; // whether it gets a desktop icon
  metadata: {
    // page title and description for search results and sharing
    title: string;
    description: string;
  };
};
