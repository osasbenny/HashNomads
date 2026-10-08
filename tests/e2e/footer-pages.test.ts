import { expect, test } from "@playwright/test";

const publicDestinations = [
  ["/marketplace", "Own the machine"],
  ["/facilities", "Infrastructure"],
  ["/calculator", "Model the numbers"],
  ["/about", "Hardware ownership"],
  ["/security", "Trust requires"],
  ["/how-it-works", "From equipment"],
  ["/roadmap", "Build the foundation"],
  ["/documentation", "Understand the platform"],
  ["/support", "Get help"],
  ["/api-reference", "Documented endpoints"],
  ["/status", "Platform status"],
  ["/terms", "Terms of Service"],
  ["/privacy", "Your data"],
  ["/risk-disclosure", "Bitcoin mining"],
  ["/kyc-requirements", "Identity verification"],
] as const;

test("V2 footer links reach their dedicated routes", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  const expected: Record<string, string> = {
    "ASIC Marketplace": "/marketplace",
    "Hosting Facilities": "/facilities",
    "Profitability Calculator": "/calculator",
    "Customer Portal": "/portal",
    "About HashNomads": "/about",
    "Security & Compliance": "/security",
    "How It Works": "/how-it-works",
    Roadmap: "/roadmap",
    Documentation: "/documentation",
    "Support Center": "/portal/support",
    "API Reference": "/api-reference",
    "Status Page": "/status",
    "Terms of Service": "/terms",
    "Privacy Policy": "/privacy",
    "Risk Disclosure": "/risk-disclosure",
    "KYC Requirements": "/kyc-requirements",
  };
  for (const [label, target] of Object.entries(expected)) {
    await expect(footer.getByRole("link", { name: label, exact: true })).toHaveAttribute(
      "href",
      target,
    );
  }
  await expect(
    footer.getByRole("link", { name: "Cactus Digital Media" }),
  ).toHaveAttribute("href", "https://cactusdigitalmedia.ng");
  await expect(footer.getByText(/Copyright © \d{4} HashNomads/)).toBeVisible();
});

for (const [path, heading] of publicDestinations) {
  test(`Dedicated V2 page ${path} renders`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    await expect(page.locator("footer")).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
}

test("New legal and help routes work at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/privacy", "/terms", "/kyc-requirements", "/support", "/roadmap"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      route,
    ).toBe(true);
  }
});

test("Customer portal support remains authentication gated", async ({ page }) => {
  await page.goto("/portal/support");
  await expect(page).toHaveURL(/\/login$/);
});
