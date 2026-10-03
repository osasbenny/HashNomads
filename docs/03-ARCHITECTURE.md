# HashNomads V1 — System Architecture

## Architecture goals
Traceability, provider portability, non-custodial reward flow, strong tenant isolation, financial precision, deterministic sandboxing and operational observability.

## Logical architecture
```text
Browser
  │
  ├── Public Web
  ├── Customer Portal
  └── Admin Console
          │
          ▼
     Application/API
          │
  ┌───────┼──────────────────────────────────────┐
  │       │       │        │        │            │
Identity Orders Ownership Deployment Billing   Support
  │       │       │        │        │            │
  └───────┴───────┴────────┴────────┴────────────┘
          │
          ├── PostgreSQL
          ├── Queue/Jobs
          ├── Cache/Rate Limit
          └── Audit/Event Log
                  │
       Integration Adapter Layer
   ┌────────┬────────┬────────┬──────────┐
   KYC    Payment   Pool   Facility   Notifications
   └────────┴────────┴────────┴──────────┘
```

## Deployment shape
Prefer a monorepo:
```text
apps/
  web/              # public + customer portal
  admin/            # operations UI (may share Next app initially)
  worker/           # durable async jobs
packages/
  domain/           # state machines, calculations, invariants
  db/               # schema/migrations/repositories
  integrations/     # provider interfaces + adapters
  ui/               # design system
  config/            # typed configuration
  testkit/           # fixtures/sandbox utilities
```
A single web application may host public/customer/admin routes in V1 if authorization boundaries remain explicit. Domain code must not depend on UI framework code.

## Provider interfaces
Define contracts for:
- `KycProvider`
- `PaymentProvider`
- `MiningPoolProvider`
- `MinerTelemetryProvider`
- `FacilityProvider`
- `NotificationProvider`
- `MarketDataProvider`

Each gets a deterministic sandbox adapter and later one or more production adapters.

## Event model
Important transitions emit domain events: customer KYC changed, payment confirmed, miner assigned, deployment changed, telemetry stale, miner offline, reward reported, invoice issued/overdue, wallet changed, incident opened/resolved. Jobs consume events idempotently.

## Data provenance
Telemetry/reward records carry `source_provider`, `source_reference`, `observed_at`, `ingested_at`, and environment. Customer UI displays freshness. Raw provider payloads may be retained selectively/redacted according to privacy/security policy.

## Reward flow
Preferred production model:
```text
ASIC → Mining Pool → Customer-controlled BTC wallet
             │
             └→ Pool API → HashNomads reporting ledger
```
HashNomads reporting must not imply custody when it merely mirrors provider data.

## Sandbox
`APP_ENV=sandbox` (or equivalent) selects sandbox adapters. Sandbox IDs are namespaced. Sandbox cannot call production payout/mining mutations. UI shows a persistent sandbox indicator.

## Reliability
- Retry transient provider failures with bounded exponential backoff.
- Dead-letter failed async jobs.
- Circuit-break/degrade external integrations where useful.
- Health checks distinguish app/database/queue/provider status.
- Stale telemetry is a first-class state.

## Financial precision
Store fiat monetary amounts in minor units or fixed precision with currency. Store BTC amounts as satoshis where possible; conversions retain explicit rate source/time. Never use JavaScript floating point for authoritative financial totals.

## Authorization
Roles: customer, support, operations, finance_compliance, admin. Permissions are capability-based. Customer resource ownership is verified server-side on every protected query/mutation.

## Environments
Local → CI/Test → Sandbox/Staging → Production. Production activation is blocked until Phase 2 and compliance gates are satisfied.
