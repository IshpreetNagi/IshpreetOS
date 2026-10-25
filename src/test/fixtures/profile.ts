import { stringify } from "yaml";
import type { ProfileContent } from "@/server/content/profile.schema";

export const profileFrontmatterFixture = {
  heading: "About Ishpreet",
  introduction: "A short profile introduction.",
};

export const profileBodyFixture = "# Biography\n\nA longer profile paragraph.\n";

export const profileMarkdownFixture =
  "---\n" + stringify(profileFrontmatterFixture) + "---\n" + profileBodyFixture;

export const profileContentFixture: ProfileContent = {
  ...profileFrontmatterFixture,
  body: profileBodyFixture,
};
