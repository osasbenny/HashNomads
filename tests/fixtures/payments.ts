import { createHmac, timingSafeEqual } from "node:crypto";
export type PaymentAsset = "BTC" | "USDC" | "USDT";
export type PaymentNetwork = "bitcoin" | "lightning" | "ethereum";
export interface InvoiceInput {
  idempotencyKey: string;
  accountingAmountMinor: bigint;
  asset: PaymentAsset;
  network: PaymentNetwork;
  now: Date;
}
export interface CryptoInvoice {
  ref: string;
  environment: "sandbox";
  asset: PaymentAsset;
  network: PaymentNetwork;
  amountAtomic: bigint;
  rateUsdMinor: bigint;
  rateSource: string;
  lockedAt: Date;
  expiresAt: Date;
  receivingReference: string;
}
export interface VerifiedPaymentEvent {
  eventId: string;
  invoiceRef: string;
  environment: "sandbox";
  status: "confirmed" | "failed";
  amountAtomic: string;
  asset: PaymentAsset;
  network: PaymentNetwork;
  timestamp: number;
}
export interface CryptoPaymentProvider {
  id: string;
  capabilities(): readonly { asset: PaymentAsset; network: PaymentNetwork }[];
  createInvoice(input: InvoiceInput): Promise<CryptoInvoice>;
  verifyWebhook(
    raw: string,
    signature: string,
    now: Date,
  ): VerifiedPaymentEvent;
}
// Contract-compatible HashNomads sandbox contract, NOT the production BTCPay webhook protocol.
export class BTCPaySandboxAdapter implements CryptoPaymentProvider {
  readonly id = "btcpay-sandbox";
  constructor(private readonly secret: string) {
    if (secret.length < 32) throw new Error("WEAK_WEBHOOK_SECRET");
  }
  capabilities() {
    return [
      { asset: "BTC", network: "bitcoin" },
      { asset: "BTC", network: "lightning" },
    ] as const;
  }
  async createInvoice(input: InvoiceInput): Promise<CryptoInvoice> {
    if (
      !this.capabilities().some(
        (c) => c.asset === input.asset && c.network === input.network,
      )
    )
      throw new Error("UNSUPPORTED_PAYMENT_RAIL");
    if (input.accountingAmountMinor <= 0n || !input.idempotencyKey)
      throw new Error("INVALID_INVOICE");
    const ref = `SIM-BTCPAY-${createHmac("sha256", this.secret).update(input.idempotencyKey).digest("hex").slice(0, 24)}`;
    const rateUsdMinor = 10000000n; // Fixed sandbox assumption: $100,000/BTC; not a live rate.
    return {
      ref,
      environment: "sandbox",
      asset: input.asset,
      network: input.network,
      amountAtomic:
        (input.accountingAmountMinor * 100000000n + rateUsdMinor - 1n) /
        rateUsdMinor,
      rateUsdMinor,
      rateSource: "deterministic-sandbox",
      lockedAt: input.now,
      expiresAt: new Date(input.now.getTime() + 15 * 60000),
      receivingReference: `sandbox-only:${ref}`,
    };
  }
  sign(raw: string) {
    return createHmac("sha256", this.secret).update(raw).digest("hex");
  }
  verifyWebhook(
    raw: string,
    signature: string,
    now: Date,
  ): VerifiedPaymentEvent {
    const expected = Buffer.from(this.sign(raw), "hex");
    if (
      !/^[a-f0-9]{64}$/.test(signature) ||
      !timingSafeEqual(expected, Buffer.from(signature, "hex"))
    )
      throw new Error("INVALID_SIGNATURE");
    const e = JSON.parse(raw) as VerifiedPaymentEvent;
    if (
      e.environment !== "sandbox" ||
      !e.eventId ||
      !e.invoiceRef?.startsWith("SIM-BTCPAY-") ||
      !Number.isSafeInteger(e.timestamp) ||
      Math.abs(now.getTime() - e.timestamp) > 300000
    )
      throw new Error("INVALID_EVENT");
    if (
      !["confirmed", "failed"].includes(e.status) ||
      e.asset !== "BTC" ||
      !["bitcoin", "lightning"].includes(e.network) ||
      !/^\d+$/.test(e.amountAtomic)
    )
      throw new Error("INVALID_EVENT");
    return e;
  }
}
export class DisabledProductionAdapter {
  constructor(readonly id: "btcpay" | "cryptomus" | "bitpay") {}
  capabilities() {
    return [];
  }
  async createInvoice(): Promise<never> {
    throw new Error("PRODUCTION_PROVIDER_DISABLED");
  }
}
export class BTCPayAdapter extends DisabledProductionAdapter {
  constructor() {
    super("btcpay");
  }
}
export class CryptomusAdapter extends DisabledProductionAdapter {
  constructor() {
    super("cryptomus");
  }
}
export class BitPayAdapter extends DisabledProductionAdapter {
  constructor() {
    super("bitpay");
  }
}
