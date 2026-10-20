import { test, expect } from "@playwright/test";

test("project placeholder renders with its metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("IshpreetOS");
  await expect(page.getByRole("heading", { name: "IshpreetOS", level: 1 })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  await expect(page.locator("body")).toHaveCSS("color", "rgb(0, 0, 0)");
});
