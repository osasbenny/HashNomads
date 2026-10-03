# HashNomads V1 — System Architecture

## Architecture goals
Traceability, provider portability, non-custodial reward flow, crypto-native commerce, strong tenant isolation, financial precision, deterministic sandboxing and operational observability.

## Logical architecture
```text
Browser
  ├── Public Web
  ├── Customer Portal
  └── Admin Console
          │
          ▼
     Application/API
          │
  ┌───────┼────────────────────────────────────────────────┐
Identity Orders Payments Ownership Deployment Billing Wallets Support
  └───────┴────────────────────────────────────────────────┘
          │
          ├── PostgreSQL
          ├── Queue/Jobs
          ├── Cache/Rate Limit
          └── Audit/Event Log
                  │
       Integration Adapter Layer
   ┌───────┬────────────┬────────┬──────────┬─────────────┐
   KYC  Crypto Payment  Pool   Facility   Notifications  Market Data
```

## Deployment shape
Prefer monorepo: `apps/web`, `apps/admin`, `apps/worker`, with `packages/domain`, `db`, `integrations`, `ui`, `config`, `testkit`. Domain code must not depend on UI framework code.

## Provider interfaces
Define `KycProvider`, `PaymentProvider`/`CryptoPaymentProvider`, `MiningPoolProvider`, `MinerTelemetryProvider`, `FacilityProvider`, `NotificationProvider`, `MarketDataProvider`. Each receives deterministic sandbox adapter and later production adapters.

## Two distinct value flows
### Commerce/payment flow
```text
Customer
  → HashNomads quote/order/hosting invoice
  → Crypto Payment Provider
  → blockchain/payment network
  → verified provider webhook
  → HashNomads Payment + Settlement Ledger
  → HashNomads business settlement destination
```
HashNomads records accounting currency independently from payment asset. Provider invoice, rate lock/expiry, network, tx references, settlement and reconciliation are traceable. Proposed first production adapter is BitPay, subject to approval; provider substitution must not require domain rewrite.

### Mining reward flow
```text
Customer-owned ASIC → Mining Pool → Customer-controlled BTC wallet
                            │
                            └→ Pool API → HashNomads reporting ledger
```
The flows must never be conflated. HashNomads receiving payment for hardware/hosting does not mean it should custody mining rewards.

## Wallet boundary
V1 `WalletDestination` is a public payout address record, not a hosted balance or private-key vault. No seed/private key may cross the application API. A future self-custody wallet must isolate cryptographic key generation/storage to the client/device and undergo separate threat modeling/security approval.

## Event model
Important transitions emit domain events: KYC changed, payment invoice created/confirmed/expired/refunded, settlement reported/reconciled, miner assigned, deployment changed, telemetry stale/offline, reward reported/paid, payout destination changed, hosting invoice issued/overdue/paid, incident opened/resolved. Consumers are idempotent.

## Data provenance
Telemetry/reward/payment/settlement records carry source provider/reference, observed/event timestamps and environment. Customer UI displays freshness. Provider payload retention is selective/redacted.

## Sandbox
Sandbox adapters simulate crypto invoice creation, rate locking, webhook signatures/events, settlement, pool rewards and telemetry. Sandbox IDs are namespaced; production financial/mining mutations are impossible from sandbox; UI has persistent indicator.

## Reliability
Bounded exponential retry, dead-letter queue, provider degradation/circuit breaking where useful, component/provider health checks and first-class stale states. Payment webhooks are replay-safe and reconciliation jobs detect missing/divergent settlements.

## Financial precision
Fiat/accounting amounts use minor units or fixed precision plus currency. BTC uses satoshis where possible. Stablecoin/token amounts use asset-specific integer precision. Every conversion stores explicit source/rate/timestamp. Never use JavaScript floating point for authoritative totals.

## Authorization
Roles: customer, support, operations, finance_compliance, admin. Capability-based permissions; resource ownership checked server-side. Wallet changes, refunds and settlement adjustments are privileged/audited operations.

## Environments
Local → CI/Test → Sandbox/Staging → Production. Production activation blocked until Phase 2/compliance gates are satisfied.
