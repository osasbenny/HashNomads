import { describe, expect, it } from "vitest";
import {
  can,
  requireOwner,
  parseFixed,
  formatFixed,
  scenario,
  transitionMiner,
  telemetryFreshness,
} from "../../packages/domain/src";
import {
  BTCPaySandboxAdapter,
  CryptomusAdapter,
  BitPayAdapter,
} from "../fixtures/payments";
import { environmentSchema } from "../../packages/config/src";
describe("financial precision", () => {
  it("round-trips amounts above safe JS integer limits", () => {
    expect(formatFixed(parseFixed("9007199254740993.01"))).toBe(
      "9007199254740993.01",
    );
  });
  it("rejects exponents, negatives, and excess precision", () => {
    for (const x of ["1e8", "-1", "1.001", "NaN"])
      expect(() => parseFixed(x)).toThrow();
  });
  it("calculates a scenario in integer cents", () => {
    expect(
      scenario({
        hashrateTH: "234",
        powerW: "3510",
        hashpriceUsdPerPHDay: "50",
        electricityUsdPerKwh: "0.065",
        uptimePercent: "100",
        poolFeePercent: "2",
        serviceUsdPerMonth: "15",
      }),
    ).toEqual({
      grossMinor: 35100n,
      poolFeeMinor: 702n,
      electricityMinor: 16426n,
      serviceMinor: 1500n,
      netMinor: 16472n,
    });
  });
  it("rejects invalid percentage", () =>
    expect(() =>
      scenario({
        hashrateTH: "234",
        powerW: "3510",
        hashpriceUsdPerPHDay: "50",
        electricityUsdPerKwh: "0.065",
        uptimePercent: "101",
        poolFeePercent: "2",
        serviceUsdPerMonth: "15",
      }),
    ).toThrow());
});
describe("authorization and lifecycle", () => {
  it("keeps support out of finance and fleet", () => {
    expect(can("support", "finance:manage")).toBe(false);
    expect(can("support", "fleet:manage")).toBe(false);
    expect(can("finance_compliance", "fleet:manage")).toBe(false);
  });
  it("hides resources belonging to another customer", () =>
    expect(() => requireOwner("alice", "bob")).toThrow("NOT_FOUND"));
  it("rejects inventory directly becoming active", () =>
    expect(() => transitionMiner("inventory", "active")).toThrow());
  it("permits the documented assignment step", () =>
    expect(transitionMiner("inventory", "assigned")).toBe("assigned"));
  it("does not confuse stale data with authoritative offline", () => {
    expect(telemetryFreshness(new Date(0), new Date(600000), false)).toBe(
      "stale",
    );
    expect(telemetryFreshness(new Date(590000), new Date(600000), false)).toBe(
      "offline",
    );
  });
  it("requires complete account configuration for production", () => {
    expect(
      environmentSchema.safeParse({ HASHNOMADS_ENV: "production" }).success,
    ).toBe(false);
    expect(
      environmentSchema.safeParse({
        HASHNOMADS_ENV: "production",
        DATABASE_URL: "postgresql://localhost/test",
        BETTER_AUTH_URL: "https://hashnomads.vercel.app",
        BETTER_AUTH_SECRET: "x".repeat(32),
      }).success,
    ).toBe(true);
  });
});
describe("sandbox payment contract", () => {
  const adapter = new BTCPaySandboxAdapter(
      "unit-test-secret-with-at-least-32-characters",
    ),
    now = new Date("2026-10-05T12:00:00Z");
  it("creates deterministic unique invoice references and exact BTC amount", async () => {
    const input = {
      idempotencyKey: "order-1",
      accountingAmountMinor: 480000n,
      asset: "BTC" as const,
      network: "bitcoin" as const,
      now,
    };
    const a = await adapter.createInvoice(input);
    expect(a).toEqual(await adapter.createInvoice(input));
    expect(a.amountAtomic).toBe(4800000n);
    expect(a.receivingReference).toMatch(/^sandbox-only:/);
    expect(
      (await adapter.createInvoice({ ...input, idempotencyKey: "order-2" }))
        .ref,
    ).not.toBe(a.ref);
  });
  it("rejects unsupported network", async () =>
    expect(
      adapter.createInvoice({
        idempotencyKey: "x",
        accountingAmountMinor: 1n,
        asset: "USDT",
        network: "ethereum",
        now,
      }),
    ).rejects.toThrow());
  const event = {
    eventId: "event-1",
    invoiceRef: "SIM-BTCPAY-test",
    environment: "sandbox",
    status: "confirmed",
    amountAtomic: "4800000",
    asset: "BTC",
    network: "bitcoin",
    timestamp: now.getTime(),
  };
  it("verifies raw signed events", () => {
    const raw = JSON.stringify(event);
    expect(adapter.verifyWebhook(raw, adapter.sign(raw), now).eventId).toBe(
      "event-1",
    );
  });
  it("rejects tampering and stale event replay", () => {
    const raw = JSON.stringify(event);
    expect(() =>
      adapter.verifyWebhook(
        raw,
        adapter.sign(raw),
        new Date(now.getTime() + 300001),
      ),
    ).toThrow();
    expect(() =>
      adapter.verifyWebhook(raw + " ", adapter.sign(raw), now),
    ).toThrow();
    expect(() => adapter.verifyWebhook(raw, "invalid", now)).toThrow();
  });
  it("rejects production mixing even with a valid signature", () => {
    const raw = JSON.stringify({ ...event, environment: "production" });
    expect(() => adapter.verifyWebhook(raw, adapter.sign(raw), now)).toThrow();
  });
  it("keeps production gateways disabled", async () => {
    await expect(new CryptomusAdapter().createInvoice()).rejects.toThrow(
      "PRODUCTION_PROVIDER_DISABLED",
    );
    await expect(new BitPayAdapter().createInvoice()).rejects.toThrow(
      "PRODUCTION_PROVIDER_DISABLED",
    );
  });
});
