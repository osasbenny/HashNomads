import { test, expect } from "@playwright/test";
test("approved V2 homepage and miner journey render without client errors", async ({page}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("We Manage the");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("You Control the");
  await expect(page.getByRole("link", { name: "Start Mining" })).toBeVisible();
  await page.getByRole("link", { name: "Browse Miners" }).click();
  await expect(page).toHaveURL(/#miners$/);
  await expect(page.locator(".site-header")).toHaveCount(0);
  expect(errors).toEqual([]);
});
for (const width of [360, 390, 768, 1024, 1440]) {
  test(`V2 pages have no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/login", "/signup"]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), route).toBe(true);
    }
  });
}
test("mobile V2 navigation remains usable with reduced motion", async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  await page.locator("nav").getByRole("button").last().click();
  await expect(page.getByRole("link", {name:"Get Started"}).last()).toBeVisible();
  await page.getByRole("link", {name:"Get Started"}).last().click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("heading", {level:1})).toHaveText("Create Your Account");
});
test("account survives refresh and logout revokes session", async ({
  page,
}) => {
  const email = `sandbox-${Date.now()}@example.com`;
  await page.goto("/account");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page.getByLabel("Name", { exact: true }).fill("Sandbox Test");
  await page.getByLabel("Email address").fill(email);
  await page
    .getByLabel("Password", { exact: true })
    .fill("Synthetic-Test-Only-2026!");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .last()
    .click();
  await expect(
    page.getByRole("heading", { name: "Welcome, Sandbox Test." }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText(email, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toHaveCount(2);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Back to your infrastructure." }),
  ).toBeVisible();
});
