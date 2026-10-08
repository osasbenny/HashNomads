import { expect, test } from "@playwright/test";

for (const width of [320, 375, 390, 430, 768]) {
  test(`mobile hamburger icon is visible and navigation works at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.goto("/");

    const menu = page.getByRole("button", { name: "Open navigation menu" });
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute("aria-expanded", "false");

    const icon = menu.locator("svg");
    const size = await icon.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const parent = element.parentElement!;
      return {
        width: rect.width,
        height: rect.height,
        stroke: getComputedStyle(element).stroke,
        padding: getComputedStyle(parent).padding,
      };
    });
    expect(
      size.width,
      "hamburger SVG must not collapse inside padded button",
    ).toBeGreaterThanOrEqual(19);
    expect(size.height).toBeGreaterThanOrEqual(19);
    expect(size.padding).toBe("0px");
    expect(size.stroke).not.toBe("none");

    await menu.click();
    const close = page.getByRole("button", { name: "Close navigation menu" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    await expect(close.locator("svg")).toBeVisible();
    await expect(close.locator("svg")).toHaveCSS("width", "20px");
    await expect(page.locator("#hashnomads-mobile-menu")).toBeVisible();
    await close.click();
    await expect(page.locator("#hashnomads-mobile-menu")).toHaveCount(0);
    await expect(menu).toHaveAttribute("aria-expanded", "false");

    await menu.click();
    await page
      .locator("#hashnomads-mobile-menu")
      .getByRole("link", { name: "Miners" })
      .click();
    await expect(page).toHaveURL(/#miners$/);
    await expect(page.locator("#hashnomads-mobile-menu")).toHaveCount(0);
  });
}
