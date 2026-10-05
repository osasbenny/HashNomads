import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("About navigation, theme persistence and chat contact actions", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("switch", { name: "Light theme" }).click();
  await expect(page.getByRole("switch")).toBeChecked();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About us", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Ownership,",
  );
  await page.reload();
  await expect(page.getByRole("switch")).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Open HashNomads chat" }).click();
  const dialog = page.getByRole("dialog", { name: "How can we help?" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: "info@hashnomads.com" }),
  ).toHaveAttribute("href", "mailto:info@hashnomads.com");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open HashNomads chat" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open HashNomads chat" }).click();
  await dialog.getByRole("link", { name: "Send an enquiry" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(dialog).not.toBeVisible();
  expect(errors).toEqual([]);
});

test("light theme remains accessible and responsive across public pages", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("switch", { name: "Light theme" }).click();
  for (const route of [
    "/",
    "/about",
    "/marketplace",
    "/facilities",
    "/calculator",
    "/account",
    "/contact",
  ]) {
    await page.goto(route);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
      route,
    ).toEqual([]);
  }
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/about");
    await page
      .locator(".about-image img")
      .evaluate((image: HTMLImageElement) => image.decode());
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    if (width <= 1200)
      await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page
        .getByRole("navigation")
        .getByRole("link", { name: "About us", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Open HashNomads chat" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    expect(
      await dialog.evaluate(
        (element) => element.getBoundingClientRect().right <= innerWidth,
      ),
    ).toBe(true);
    await page.keyboard.press("Escape");
  }
  await page.getByRole("switch", { name: "Light theme" }).click();
  await page.reload();
  await expect(page.getByRole("switch")).not.toBeChecked();
});
