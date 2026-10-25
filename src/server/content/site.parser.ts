import { parseDocument } from "yaml";
import { siteSchema } from "@/server/content/site.schema";
import type { SiteContent } from "@/server/content/site.schema";

export function parseSiteYaml(source: string): SiteContent {
  const document = parseDocument(source);

  if (document.errors.length > 0) {
    const message = document.errors.map((error) => error.message).join("; ");

    throw new Error(message);
  }
  return siteSchema.parse(document.toJS());
}
