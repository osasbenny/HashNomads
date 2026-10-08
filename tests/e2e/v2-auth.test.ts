import { expect, test } from "@playwright/test";

test("V2 signup creates an authenticated PostgreSQL-backed customer session", async ({
  page,
}) => {
  const email = `v2-user-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.com`;

  await page.goto("/signup");
  await expect(
    page.getByRole("heading", { name: "Create Your Account" }),
  ).toBeVisible();

  await page.getByPlaceholder("John Doe").fill("HashNomads Test Customer");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("••••••••").fill("Synthetic-Login-Only-2026!");
  await page.getByRole("combobox").selectOption("CA");
  const authResponses: Array<{ path: string; status: number }> = [];
  page.on("response", (response) => {
    if (response.url().includes("/api/auth/")) {
      authResponses.push({
        path: new URL(response.url()).pathname,
        status: response.status(),
      });
    }
  });
  await page.getByRole("button", { name: "Create Account" }).click();
  await page.waitForTimeout(600);
  const check = await page.request.get("/api/auth/get-session");
  const checked = await check.json().catch(() => null);
  const messages = await page.locator(".text-error-400").allTextContents();
  console.log("V2_REGISTRATION_DIAGNOSTIC", JSON.stringify({
    route: new URL(page.url()).pathname,
    authResponses,
    sessionStatus: check.status(),
    hasSession: Boolean(checked?.user?.id),
    errors: messages.map((x) => x.slice(0, 160)),
  }));

  await expect(page).toHaveURL(/\/portal$/);
  await expect(
    page.getByRole("heading", { name: "Overview", exact: true }),
  ).toBeVisible();

  const profile = await page.request.get("/api/v2/profile");
  expect(profile.status()).toBe(200);
  const data = (await profile.json()).profile;
  expect(data.email).toBe(email);
  expect(data.full_name).toBe("HashNomads Test Customer");
  expect(data.country).toBe("CA");
  expect(data.kyc_status).toBe("pending");

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Overview", exact: true }),
  ).toBeVisible();
  const persisted = await page.request.get("/api/v2/profile");
  expect(persisted.status()).toBe(200);
  expect((await persisted.json()).profile.email).toBe(email);
});

test("V2 registration validates the actual 12-character server password rule", async ({
  page,
}) => {
  await page.goto("/signup");
  await page.getByPlaceholder("John Doe").fill("Test Customer");
  await page.getByPlaceholder("you@example.com").fill("example@example.com");
  await page.getByPlaceholder("••••••••").fill("too-short");
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByText("Password must be at least 12 characters")).toBeVisible();
  await expect(page).toHaveURL(/\/signup$/);
});

test("V2 protected portal requires an authenticated session", async ({ page }) => {
  await page.goto("/portal/wallets");
  await expect(page).toHaveURL(/\/login$/);
  const result = await page.request.get("/api/v2/profile");
  expect(result.status()).toBe(401);
});
