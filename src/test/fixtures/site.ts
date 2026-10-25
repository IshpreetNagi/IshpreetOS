import { stringify } from "yaml";
import type { SiteContent } from "@/server/content/site.schema";

export const siteContentFixture: SiteContent = {
  title: "IshpreetOS",
  description: "A personal operating system on the web.",
  displayName: "Ishpreet",
  location: "Toronto",
  email: "ishpreet@example.com",
  resumeUrl: "https://example.com/resume.pdf",
  socialLinks: [
    { label: "GitHub", url: "https://github.com/example" },
  ],
};

export const siteYamlFixture = stringify(siteContentFixture);
