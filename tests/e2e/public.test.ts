import { test, expect } from "@playwright/test";
test("public journey connects hardware, assumptions and disclosures", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Own the machine.",
  );
  await page
    .getByRole("link", { name: "Explore hardware", exact: true })
    .click();
  await page.getByRole("link", { name: "Explore specifications" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Antminer S21 Pro",
  );
  await page.getByRole("link", { name: "Model this ASIC" }).click();
  await page.getByLabel("Assumed uptime").fill("100");
  await expect(page.locator(".result-number")).toHaveText("$164.72");
  await page.getByLabel("Electricity tariff").fill("0.150");
  await expect(page.locator(".result-number")).toHaveText("$-50.10");
  await page.getByRole("button", { name: "Reset" }).click();
  await page
    .getByRole("link", { name: "Transparency & risk", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "No guaranteed returns" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
for (const width of [360, 390, 768, 1024, 1440]) {
  test(`responsive routes have no overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/marketplace",
      "/marketplace/s21-pro",
      "/facilities",
      "/calculator",
      "/account",
      "/transparency",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        route,
      ).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });
}
test("mobile navigation and reduced-motion fallback", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Calculator" })
    .click();
  await expect(page).toHaveURL(/calculator/);
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeVisible();
});
test("sandbox account survives refresh and logout revokes session", async ({
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
  await page.getByRole("button", { name: "Create sandbox account" }).click();
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
