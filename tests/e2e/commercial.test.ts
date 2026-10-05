import { test, expect } from "@playwright/test";
import { createHmac, createHash, randomUUID, randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
import { existsSync } from "node:fs";
function totp(secret: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const c of secret.replace(/=+$/, ""))
    bits += alphabet.indexOf(c.toUpperCase()).toString(2).padStart(5, "0");
  const bytes = Buffer.from(
    (bits.match(/.{8}/g) ?? []).map((b) => parseInt(b, 2)),
  );
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const digest = createHmac("sha1", bytes).update(counter).digest();
  const offset = digest[digest.length - 1] & 15;
  return ((digest.readUInt32BE(offset) & 0x7fffffff) % 1000000)
    .toString()
    .padStart(6, "0");
}
test("private admin invitation is single-use and inbox requires MFA", async ({
  page,
}) => {
  test.skip(
    Boolean(process.env.PLAYWRIGHT_BASE_URL),
    "Administrator provisioning is tested only in the isolated local/CI database.",
  );
  if (existsSync(".env")) process.loadEnvFile(".env");
  const db = new PrismaClient();
  const id = randomUUID(),
    token = randomBytes(32).toString("hex"),
    password = "Administrator-Validation-Password-2026!";
  try {
    expect(
      await db.user.findUnique({ where: { email: "admin@hashnomads.com" } }),
    ).toBeNull();
    await db.user.create({
      data: {
        id,
        email: "admin@hashnomads.com",
        name: "Admin Validation",
        role: "admin",
      },
    });
    await db.account.create({
      data: {
        id: randomUUID(),
        userId: id,
        accountId: id,
        providerId: "credential",
        password: await hashPassword(randomBytes(32).toString("hex")),
      },
    });
    await db.verification.create({
      data: {
        id: randomUUID(),
        identifier: `admin-setup:${createHash("sha256").update(token).digest("hex")}`,
        value: id,
        expiresAt: new Date(Date.now() + 600000),
      },
    });
    await page.goto("/admin-setup#" + token);
    await page.getByLabel("New administrator password").fill(password);
    await page.getByLabel("Confirm password").fill(password);
    await page
      .getByRole("button", { name: "Set administrator password" })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "Your administrator password is set.",
    );
    const origin = new URL(page.url()).origin;
    expect(
      (
        await page.request.post("/api/v1/admin-setup", {
          headers: { Origin: origin },
          data: { token, password },
        })
      ).status(),
    ).toBe(400);
    const login = await page.request.post("/api/auth/sign-in/email", {
      headers: { Origin: origin },
      data: { email: "admin@hashnomads.com", password },
    });
    expect(login.status()).toBe(200);
    await page.goto("/operations");
    await expect(
      page.getByRole("heading", { name: "Secure your administrator account." }),
    ).toBeVisible();
    expect(
      (await page.request.get("/api/v1/operations/subscriptions")).status(),
    ).toBe(403);
    const enable = await page.request.post("/api/auth/two-factor/enable", {
      headers: { Origin: origin },
      data: { password },
    });
    expect(enable.status()).toBe(200);
    const setup = await enable.json();
    const secret = new URL(setup.totpURI).searchParams.get("secret")!;
    expect(
      (
        await page.request.post("/api/auth/two-factor/verify-totp", {
          headers: { Origin: origin },
          data: { code: totp(secret) },
        })
      ).status(),
    ).toBe(200);
    const enquiry = await db.siteEnquiry.create({
      data: {
        name: "Admin Inbox Validation",
        email: "inbox-validation@example.com",
        topic: "hardware",
        message: "A local verification enquiry.",
        consentVersion: "2026-10-05",
      },
    });
    try {
      await page.goto("/operations");
      await expect(
        page.getByRole("heading", { name: "Customer enquiries." }),
      ).toBeVisible();
      expect(
        (await page.request.get("/api/v1/operations/subscriptions")).status(),
      ).toBe(200);
      const changed = await page.request.patch("/api/v1/operations/enquiries", {
        headers: { Origin: origin },
        data: { id: enquiry.id, status: "handled" },
      });
      expect(changed.status()).toBe(200);
      expect(
        (await db.siteEnquiry.findUniqueOrThrow({ where: { id: enquiry.id } }))
          .status,
      ).toBe("handled");
    } finally {
      await db.siteEnquiry.delete({ where: { id: enquiry.id } });
    }
  } finally {
    await db.verification.deleteMany({ where: { value: id } });
    await db.user.deleteMany({ where: { id } });
    await db.$disconnect();
  }
});
const routes = [
  "/",
  "/marketplace",
  "/marketplace/s21-pro",
  "/facilities",
  "/account",
  "/how-it-works",
  "/about",
  "/faq",
  "/legal",
  "/transparency",
  "/contact",
  "/resources",
];
test("public content contains no demo language or invented prices", async ({
  page,
}) => {
  for (const route of routes) {
    await page.goto(route);
    const text = await page.locator("body").innerText();
    expect(text, route).not.toMatch(
      /sandbox|simulat|\bmock\b|\bdemo\b|fixture|evaluation account|under implementation/i,
    );
    expect(text, route).not.toContain("$4,800");
  }
  await page.goto("/facilities");
  await expect(
    page.getByRole("heading", { name: "Texas", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("$0.062/kWh", { exact: true })).toBeVisible();
});
test("enquiry is saved, consent is required and foreign origins are rejected", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(
    page.getByRole("link", { name: "info@hashnomads.com" }).first(),
  ).toHaveAttribute("href", "mailto:info@hashnomads.com");
  await page.getByLabel("Name", { exact: true }).fill("Commercial Validation");
  await page
    .getByLabel("Email address", { exact: true })
    .fill(`commercial-${Date.now()}@example.com`);
  await page
    .getByLabel("Your requirements")
    .fill("Please discuss S21 Pro hardware and Texas hosting options.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("heading", { name: "Thank you for reaching out." }),
  ).toBeVisible();
  const base = new URL(page.url()).origin;
  const invalid = await page.request.post("/api/v1/enquiries", {
    headers: { Origin: base },
    data: {
      name: "QA",
      email: "qa@example.com",
      topic: "general",
      message: "A validation message.",
      consent: false,
      website: "",
    },
  });
  expect(invalid.status()).toBe(400);
  const foreign = await page.request.post("/api/v1/enquiries", {
    headers: { Origin: "https://unrelated.example" },
    data: {},
  });
  expect(foreign.status()).toBe(403);
});
test("newsletter saves consent and supports explicit unsubscribe", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByLabel("Email address", { exact: true })
    .fill(`subscription-${Date.now()}@example.com`);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Subscription saved." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Manage your subscription" }).click();
  await page.getByRole("button", { name: "Unsubscribe", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText(
    "You have been unsubscribed.",
  );
});
test("admin data and setup cannot be accessed without authorization", async ({
  page,
}) => {
  await page.goto("/operations");
  await expect(page).toHaveURL(/\/account$/);
  expect(
    (await page.request.get("/api/v1/operations/subscriptions")).status(),
  ).toBe(403);
  const response = await page.request.post("/api/v1/admin-setup", {
    headers: { Origin: new URL(page.url()).origin },
    data: { token: "0".repeat(64), password: "Invalid-Setup-Password-2026!" },
  });
  expect([400, 429]).toContain(response.status());
});
test("account profile, password and two-factor challenge persist", async ({
  page,
}) => {
  const email = `security-${Date.now()}@example.com`;
  const initial = "Initial-Account-Password-2026!",
    changed = "Changed-Account-Password-2026!";
  await page.goto("/account");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page.getByLabel("Name", { exact: true }).fill("Security Validation");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(initial);
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .last()
    .click();
  await expect(
    page.getByRole("heading", { name: "Welcome, Security Validation." }),
  ).toBeVisible();
  await page.getByText("Profile & password", { exact: true }).click();
  await page.getByLabel("Your name", { exact: true }).fill("Updated Account");
  await page.getByRole("button", { name: "Save name" }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome, Updated Account." }),
  ).toBeVisible();
  await page.getByLabel("Current password", { exact: true }).fill(initial);
  await page.getByLabel("New password", { exact: true }).fill(changed);
  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Your account has been updated.",
  );
  const origin = new URL(page.url()).origin;
  const enable = await page.request.post("/api/auth/two-factor/enable", {
    headers: { Origin: origin },
    data: { password: changed },
  });
  expect(enable.status()).toBe(200);
  const setup = await enable.json();
  const secret = new URL(setup.totpURI).searchParams.get("secret")!;
  const verified = await page.request.post("/api/auth/two-factor/verify-totp", {
    headers: { Origin: origin },
    data: { code: totp(secret) },
  });
  expect(verified.status()).toBe(200);
  await page.reload();
  await expect(
    page.getByText("Two-factor authentication · Enabled", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(changed);
  await page
    .getByRole("button", { name: "Sign in", exact: true })
    .last()
    .click();
  await expect(page).toHaveURL(/\/account\/verify$/);
  await page
    .getByLabel("Authenticator code", { exact: true })
    .fill(totp(secret));
  await page
    .getByRole("button", { name: "Verify sign-in", exact: true })
    .click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(
    page.getByRole("heading", { name: "Welcome, Updated Account." }),
  ).toBeVisible();
});
