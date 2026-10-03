# HashNomads V1 — API & Integration Strategy

## API principles
Typed contracts, explicit versioning, server-side authorization, idempotency for mutations, pagination, stable errors and provenance for external data.

## Representative routes
```text
GET    /api/v1/catalog/asics
GET    /api/v1/facilities
POST   /api/v1/calculator/scenario
POST   /api/v1/kyc/session
POST   /api/v1/orders
GET    /api/v1/orders/:id
POST   /api/v1/orders/:id/checkout
GET    /api/v1/payments/:id
POST   /api/v1/payments/:id/refresh
GET    /api/v1/payments/:id/settlement
GET    /api/v1/miners
GET    /api/v1/miners/:id/telemetry
GET    /api/v1/rewards
GET    /api/v1/invoices
POST   /api/v1/invoices/:id/checkout
GET    /api/v1/wallets
POST   /api/v1/wallets
POST   /api/v1/wallets/:id/verify
POST   /api/v1/wallets/:id/activate
POST   /api/v1/wallets/:id/deactivate
POST   /api/v1/support/cases
```
Admin routes use separate protected namespace/permissions.

## Webhooks
`/api/webhooks/{provider}` must verify raw-body signature/timestamp as required, persist unique provider event ID, be safely idempotent, enqueue domain processing and use correlation IDs without leaking secrets. Browser redirects never establish paid state.

## Crypto Payment Provider
Provider-neutral interface. Proposed first production adapter: **BitPay**, subject to merchant approval and jurisdiction/commercial/compliance review. Sandbox supports representative BTC, Lightning, USDC and USDT scenarios; production assets/networks are capability/config driven.

```ts
interface CryptoPaymentProvider {
  capabilities(): Promise<PaymentCapabilities>;
  createInvoice(input: CreateCryptoInvoiceInput): Promise<CryptoInvoice>;
  getInvoice(providerInvoiceRef: string): Promise<CryptoInvoice>;
  verifyWebhook(input: RawWebhookInput): Promise<VerifiedProviderEvent>;
  getPaymentStatus(providerInvoiceRef: string): Promise<PaymentStatus>;
  getSettlement?(providerInvoiceRef: string): Promise<SettlementRecord[]>;
  requestRefund?(input: RefundRequest): Promise<ProviderChangeRequest>;
}
```

Provider adapter must expose accounting currency, payment asset/network, requested crypto amount when available, locked rate/expiry, provider invoice ID, payment/transaction references, settlement asset/amount/fees/status. Never assume every provider supports every asset, refund or settlement feature.

## MiningPoolProvider
Provider-neutral workers/hashrate/rewards/payments and optional payout-destination change request. Pool payout changes may require provider-side approval and are never assumed instantaneous.

## Wallet API boundary
Wallet endpoints register/manage **public payout destinations only**. They must never accept seed phrases, mnemonics, private keys, keystore files or signing secrets. Network-aware address validation is required. Activation/change requires configured step-up authentication and audit. Future self-custody wallet cryptography must live client/device-side behind a separate approved design.

## MinerTelemetryProvider
Separate direct/facility telemetry from pool telemetry. Do not infer temperature/fan/power from hashrate.

## MarketDataProvider
BTC reference price and mining-network/hashprice inputs. Every quote stores source/time; calculator supports manual assumptions if unavailable.

## KycProvider
Create verification session, query status, process webhook; application stores minimum required metadata.

## FacilityProvider
Sandbox covers capacity/status/deployment request/status/facility telemetry where offered. Phase 2 determines real API/SFTP/manual integration.

## NotificationProvider
Email first; optional SMS/WhatsApp later for high-value alerts subject to consent/provider policy.

## Payment reconciliation jobs
Scheduled/triggered jobs compare internal payment state with provider invoices, transactions and settlements. Divergence creates a finance exception rather than silently mutating history. Webhook + polling/reconciliation provides defense against missed provider events.

## Error envelope and rate limits
Stable code, safe message, correlation ID, optional field errors; no stack traces/secrets. Strict limits for auth, KYC, wallet changes, checkout/refunds/admin mutations; telemetry uses caching/pagination.
