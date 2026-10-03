# HashNomads V1 — API & Integration Strategy

## API principles
Typed contracts, explicit versioning, server-side authorization, idempotency for mutations, pagination for collections, stable error envelopes and source provenance for externally derived data.

## Representative routes
```text
GET    /api/v1/catalog/asics
GET    /api/v1/catalog/asics/:id
GET    /api/v1/facilities
POST   /api/v1/calculator/scenario
GET    /api/v1/me
POST   /api/v1/kyc/session
GET    /api/v1/kyc/status
POST   /api/v1/orders
GET    /api/v1/orders/:id
POST   /api/v1/orders/:id/checkout
GET    /api/v1/miners
GET    /api/v1/miners/:id
GET    /api/v1/miners/:id/telemetry
GET    /api/v1/rewards
GET    /api/v1/invoices
POST   /api/v1/wallets
PATCH  /api/v1/wallets/:id
POST   /api/v1/support/cases
```
Admin routes live under a separate protected namespace and permission model.

## Webhooks
`/api/webhooks/{provider}` must:
1. read/verify provider signature using raw body where required;
2. reject invalid timestamp/signature;
3. persist unique provider event ID;
4. return safely on duplicate delivery;
5. enqueue domain processing;
6. log correlation ID without sensitive payload leakage.

## MiningPoolProvider contract
Capabilities should be discoverable because pools differ.
```ts
interface MiningPoolProvider {
  capabilities(): PoolCapabilities;
  getWorkers(accountRef: string): Promise<Worker[]>;
  getWorkerHashrate(workerRef: string, range: TimeRange): Promise<HashratePoint[]>;
  getRewards(accountRef: string, range: TimeRange): Promise<RewardRecord[]>;
  getPayments(accountRef: string): Promise<PoolPayment[]>;
  configurePayoutDestination?(input: PayoutDestinationInput): Promise<ProviderChangeRequest>;
}
```
Production payout changes may require provider-side approval and must never be assumed instantaneous.

## MinerTelemetryProvider
Separate direct/facility telemetry from pool telemetry. Temperature/fan/power values must not be inferred from pool hashrate.

## MarketDataProvider
Provides BTC reference price and mining-network/hashprice inputs for calculators. Every quote stores source/time. Calculator remains usable with manual assumptions when market data is unavailable.

## PaymentProvider
Provider-agnostic checkout, payment status, refund/adjustment references and signed webhooks. Production provider selection follows jurisdiction/business approval.

## KycProvider
Create verification session, query status, process webhook. Application stores minimum required metadata rather than duplicating sensitive identity evidence.

## FacilityProvider
V1 sandbox contract covers facility capacity/status, deployment request/status and facility telemetry if offered. Phase 2 determines actual operator API/SFTP/manual integration.

## NotificationProvider
Email first; optional SMS/WhatsApp later for high-value operational alerts subject to consent and provider policy.

## Error envelope
Return stable machine-readable code, human-safe message, correlation ID and optional field errors. Never expose stack traces/provider secrets.

## Rate limits
Stricter limits for auth, KYC session creation, wallet changes, checkout, admin mutations and calculator abuse. Read-heavy telemetry endpoints use caching/pagination.
