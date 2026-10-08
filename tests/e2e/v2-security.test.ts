import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { existsSync } from "node:fs";

test("customer reads remain scoped when another customer's identifier is supplied", async ({
  browser,
  baseURL,
}) => {
  test.skip(
    Boolean(process.env.PLAYWRIGHT_BASE_URL),
    "Tenant fixtures require the isolated test database.",
  );
  if (existsSync(".env")) process.loadEnvFile(".env");
  const db = new PrismaClient();
  const contexts = await Promise.all([
    browser.newContext(),
    browser.newContext(),
  ]);
  const userIds: string[] = [];
  const customers: string[] = [];
  try {
    for (const [index, context] of contexts.entries()) {
      const response = await context.request.post(
        baseURL + "/api/auth/sign-up/email",
        {
          headers: { Origin: baseURL! },
          data: {
            name: `Tenant ${index}`,
            email: `tenant-${index}-${Date.now()}@example.com`,
            password: "Tenant-Isolation-Password-2026!",
          },
        },
      );
      expect(response.status()).toBe(200);
      const { user } = await response.json();
      userIds.push(user.id);
      const customer = await db.customer.create({
        data: { userId: user.id, legalName: user.name, country: "US" },
      });
      customers.push(customer.id);
      await db.notification.create({
        data: {
          customerId: customer.id,
          kind: "account",
          message: `Private tenant ${index} notification`,
        },
      });
    }
    for (const [index, context] of contexts.entries()) {
      const query = encodeURIComponent(
        JSON.stringify({
          table: "notifications",
          operation: "read",
          filters: [{ field: "customer_id", value: customers[1 - index] }],
        }),
      );
      const response = await context.request.get(
        baseURL + "/api/v2/data?q=" + query,
      );
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data).toHaveLength(1);
      expect(body.data[0].message).toBe(`Private tenant ${index} notification`);
      const profiles = encodeURIComponent(
        JSON.stringify({
          table: "profiles",
          operation: "read",
          filters: [{ field: "id", value: userIds[1 - index] }],
        }),
      );
      expect(
        (
          await (
            await context.request.get(baseURL + "/api/v2/data?q=" + profiles)
          ).json()
        ).data,
      ).toEqual([]);
    }
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
    await db.notification.deleteMany({
      where: { customerId: { in: customers } },
    });
    await db.customer.deleteMany({ where: { id: { in: customers } } });
    await db.user.deleteMany({ where: { id: { in: userIds } } });
    await db.$disconnect();
  }
});

test("authenticated customers cannot fabricate financial, KYC, wallet or ownership records", async ({
  page,
}) => {
  test.skip(
    Boolean(process.env.PLAYWRIGHT_BASE_URL),
    "Mutation probes run only against the isolated test database.",
  );
  await page.goto("/signup");
  const origin = new URL(page.url()).origin;
  const signup = await page.request.post("/api/auth/sign-up/email", {
    headers: { Origin: origin },
    data: {
      name: "M0 Boundary Validation",
      email: `m0-boundary-${Date.now()}@example.com`,
      password: "Boundary-Validation-Password-2026!",
    },
  });
  expect(signup.status()).toBe(200);
  for (const [table, operation, payload] of [
    ["orders", "update", { status: "paid" }],
    ["payment_intents", "update", { status: "confirmed" }],
    [
      "crypto_invoices",
      "insert",
      { receiving_address: "bc1-invented-address" },
    ],
    ["asic_units", "insert", { serial_number: "INVENTED-123" }],
    ["ownership_assignments", "insert", { user_id: "another-customer" }],
    ["wallet_destinations", "insert", { is_verified: true, is_active: true }],
  ] as const) {
    expect(
      (
        await page.request.post("/api/v2/data", {
          headers: { Origin: origin },
          data: { table, operation, payload, filters: [] },
        })
      ).status(),
      table,
    ).toBe(409);
  }
  for (const field of ["role", "kyc_status", "email"]) {
    expect(
      (
        await page.request.post("/api/v2/data", {
          headers: { Origin: origin },
          data: {
            table: "profiles",
            operation: "update",
            payload: {
              full_name: "M0 Boundary Validation",
              country: "US",
              [field]: "verified",
            },
            filters: [],
          },
        })
      ).status(),
      field,
    ).toBe(403);
  }
  expect((await page.request.get("/api/v1/operations/overview")).status()).toBe(
    403,
  );
  const profile = await page.request.get("/api/v2/profile");
  expect((await profile.json()).profile.kyc_status).not.toBe("verified");
  await page.goto("/portal/documents");
  await expect(
    page.getByText("Documents will appear here when issued to your account."),
  ).toBeVisible();
  await expect(
    page.getByText("KYC Verification Record", { exact: true }),
  ).toHaveCount(0);
  await page.goto("/portal/notifications");
  await expect(page.getByText("No notifications yet.")).toBeVisible();
  await expect(
    page.getByText("System Maintenance", { exact: true }),
  ).toHaveCount(0);
});

test("V2 Prisma API denies unauthenticated customer and admin data", async ({
  page,
}) => {
  await page.goto("/");
  const query = encodeURIComponent(
    JSON.stringify({ table: "profiles", operation: "read", filters: [] }),
  );
  expect((await page.request.get("/api/v2/data?q=" + query)).status()).toBe(
    401,
  );
  const admin = encodeURIComponent(
    JSON.stringify({ table: "asic_units", operation: "read", filters: [] }),
  );
  expect((await page.request.get("/api/v2/data?q=" + admin)).status()).toBe(
    401,
  );
});

test("V2 browser payment confirmation cannot bypass server authorization", async ({
  page,
}) => {
  await page.goto("/");
  const origin = new URL(page.url()).origin;
  const response = await page.request.post("/api/v2/data", {
    headers: { Origin: origin },
    data: {
      table: "orders",
      operation: "update",
      filters: [],
      payload: { status: "paid", paid_at: new Date().toISOString() },
    },
  });
  expect(response.status()).toBe(401);
});

test("V2 financial operations deny malicious cross-origin mutations", async ({
  page,
}) => {
  await page.goto("/");
  const response = await page.request.post("/api/v2/data", {
    headers: { Origin: "https://attacker.example" },
    data: {
      table: "wallet_destinations",
      operation: "update",
      filters: [],
      payload: { status: "active" },
    },
  });
  expect(response.status()).toBe(403);
});
