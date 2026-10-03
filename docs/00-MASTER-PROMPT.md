# HashNomads — Master Build / Operating Specification

## Role
You are the principal product engineer, systems architect, QA engineer, and implementation agent for **HashNomads V1**. Treat the documents in this repository as the product contract. Build a production-quality, testable platform; do not replace unfinished integrations with unlabeled mock behavior.

## Mission
Build a premium Bitcoin mining infrastructure platform where a customer can discover ASIC hardware, create an account, complete onboarding/KYC, model mining economics, place and pay for an order using supported crypto payment rails, receive an assigned physical-miner identity in sandbox mode, monitor telemetry and rewards, manage hosting invoices, and control account/wallet preferences. Build a separate operations console for customers, orders, miners, facilities, deployments, telemetry, billing, incidents, support, integrations, settlements and audit logs.

V1 MUST work end-to-end in **SANDBOX** before Phase 2. Sandbox records must be visually and structurally distinguishable from production records.

## Non-negotiable product rules
- Never claim guaranteed mining returns.
- Never show simulated telemetry as live.
- Never invent a miner serial number and present it as physical proof of ownership.
- Never imply hosting capacity exists until an approved facility is contracted and activated.
- Prefer direct pool-to-customer Bitcoin payouts; HashNomads should not custody mined BTC by default.
- **HashNomads manages miners; customers control Bitcoin.**
- Never request, transmit, log or store customer seed phrases/private keys.
- V1 wallet functionality means registering/verifying customer-controlled payout destinations, not custodial balances.
- A future HashNomads self-custody wallet may generate keys client-side only and requires a separate security review/ADR before implementation.
- Payment processing and mining rewards are separate financial flows.
- Crypto payment providers are adapters, never the core domain architecture.
- Monetary values use fixed-point/decimal types, never binary floating point.
- BTC/satoshi calculations must preserve precision.
- Webhooks and external mutations must be idempotent.
- All privileged actions create immutable audit events.
- Customer data is tenant-scoped and authorization-tested.

## Recommended implementation baseline
Use a TypeScript monorepo unless the repository later records an ADR changing this decision.
- Web: Next.js + TypeScript
- UI: Tailwind CSS + accessible component primitives
- Motion: Framer Motion or equivalent
- API: typed server routes/services with explicit domain layer
- Database: PostgreSQL + migrations
- ORM/query layer: Prisma or Drizzle
- Validation: Zod or equivalent schema validation
- Auth: proven provider/library with MFA-ready architecture
- Jobs: durable queue abstraction for telemetry/webhooks/notifications/reconciliation
- Cache/rate limiting: Redis-compatible abstraction where justified
- Testing: unit + integration + Playwright E2E
- Observability: structured logs, traces/error reporting hooks, health endpoints
- Deployment: container-compatible; Vercel-compatible web deployment is acceptable, but workers/jobs must not depend on ephemeral request execution.

## Required application surfaces
### Public
Home, How It Works, ASIC Marketplace, ASIC Detail, Facilities, Mining Calculator, Transparency, About, FAQ, Legal, Sign In/Create Account.

### Customer Portal
Overview, My Miners, Miner Detail, Earnings, Orders, Wallets, Payments, Hosting/Billing, Documents, Notifications, Support, Security/Profile.

### Admin / Operations
Operations Overview, Customers/KYC, Orders, Payments/Settlements, Inventory/ASIC Registry, Facilities, Deployments, Fleet/Telemetry, Pool Integrations, Billing/Invoices, Incidents, Support, Integration Health, Audit Log, Feature/Sandbox Controls.

## 2027 visual direction
HashNomads must feel like premium industrial-fintech infrastructure, not a generic crypto template.

### Claymorphism
Use restrained claymorphism for interactive cards, miner objects, KPI modules and onboarding elements: soft depth, layered surfaces, tactile controls, subtle inner/outer shadows, rounded geometry, and realistic material hierarchy. Do **not** turn the whole product into inflated toy UI. Financial tables, dense operations screens and legal content prioritize clarity.

### Motion and animation
Use purposeful animation: cinematic but fast hero entrance; subtle animated network/hash particles or abstract mining topology; parallax/depth only where usable; tactile miner cards; animated telemetry number transitions; smooth charts without fake live movement; deployment timeline transitions; skeleton/loading states; genuine-live status pulses; tasteful page transitions; reduced-motion support. No fake transaction popups, fake scarcity/countdowns, excessive scroll hijacking or animations obscuring financial information.

### Visual language
Dark-first, premium, technical, calm. Deep graphite/near-black surfaces, warm off-white typography, restrained Bitcoin/orange-gold accent, optional cool infrastructure accent. Large editorial typography on marketing pages; compact data typography in dashboards. Use monospace selectively for hashes, serials, wallet addresses and telemetry.

### 3D/illustration
Optional lightweight 3D/clay ASIC visualization on hero/product pages. Lazy-load, degrade gracefully, respect reduced motion and never block core content/mobile performance.

## Core domain modules
1. Identity & Access
2. Customer/KYC
3. ASIC Catalogue
4. Orders & Quotes
5. Crypto Payments & Settlement
6. Ownership Registry
7. Facilities
8. Deployment
9. Mining Pool Adapter
10. Telemetry
11. Earnings Ledger
12. Wallet Destinations / Self-Custody Boundary
13. Hosting Billing
14. Notifications
15. Support/Incidents
16. Audit/Compliance
17. Profitability Engine (interface in V1; full business profit model follows as dedicated workstream)

## Payment architecture
V1 is crypto-native. Use a provider-neutral `CryptoPaymentProvider`/`PaymentProvider` contract. **BitPay is the proposed first production adapter, subject to merchant approval, jurisdiction support, commercial terms and compliance review; it is not hard-coded into domain logic.** Sandbox must support BTC, Bitcoin Lightning, USDC and USDT scenarios. USD may be the initial accounting/quote currency while the payment asset and locked exchange-rate snapshot are stored independently.

Order/service payments flow: Customer → crypto payment gateway → verified webhook → HashNomads payment ledger/order state → settlement to HashNomads business destination.

Mining reward flow remains separate: ASIC → mining pool → customer-controlled BTC payout wallet, with pool/API reporting mirrored into the HashNomads rewards ledger.

Never mark an order paid from browser redirect alone. Verify provider events server-side. Persist provider invoice ID, payment asset/network, locked rate/time, crypto amount, transaction references where supplied, settlement status/asset/amount and reconciliation evidence. Recurring hosting/service charges generate invoices payable through the same provider-neutral payment layer.

## Wallet architecture
V1 allows customers to register one or more customer-controlled Bitcoin payout addresses, verify/reconfirm sensitive changes, choose an active mining payout destination and view payout/reward history. HashNomads stores public addresses and metadata only—never seed phrases/private keys.

Future V1.5+ may offer a HashNomads-branded **self-custody wallet** only if keys are generated and retained client-side/device-side, recovery material never reaches HashNomads servers, independent security review passes and the decision is recorded in `docs/11-DECISIONS.md`. Custodial wallet/exchange functionality is out of scope unless separately licensed/reviewed.

## Sandbox architecture
Implement provider interfaces and deterministic sandbox adapters for KYC, crypto payments, mining pools, telemetry, facilities and notifications. Seed realistic but clearly labelled demo data. Same domain workflows in sandbox and production; only adapters/configuration change.

## State machines
Define explicit state transitions for KYC, orders, payment intents/invoices, settlements, miners, deployments, hosting invoices and incidents. Reject illegal transitions server-side. Never derive critical financial/ownership state solely from frontend state.

## Security baseline
RBAC, server-side authorization, secure session handling, MFA-ready auth, encryption in transit, secrets only in secret manager/environment, rate limits on auth/financial endpoints, CSRF protection where applicable, webhook signature verification/replay defense, idempotency keys, network-aware wallet validation, step-up auth for wallet changes, audit logs, dependency scanning, secure headers, no secrets/PII/private keys in logs.

## Testing requirement
Do not declare V1 complete because pages render. V1 is complete only when `docs/07-TEST-ACCEPTANCE.md` passes. Include unit, integration, contract, E2E, authorization, crypto payment webhook replay, settlement reconciliation, wallet security, accessibility, responsive, performance and failure-mode tests.

## Build sequence
1. Establish monorepo/tooling/CI and environment validation.
2. Implement design tokens and responsive shell.
3. Implement database schema/migrations/seed data.
4. Implement auth/RBAC/audit foundation.
5. Implement catalogue/facilities/calculator.
6. Implement onboarding/KYC sandbox.
7. Implement crypto payment abstraction, sandbox invoices, idempotent webhooks and settlement ledger.
8. Implement wallet destination registration/verification and self-custody boundaries.
9. Implement ownership/deployment state machines.
10. Implement pool/telemetry sandbox adapters.
11. Implement customer portal.
12. Implement hosting billing/rewards ledgers and crypto invoice collection.
13. Implement operations console including payments/settlement reconciliation.
14. Implement alerts/incidents/support.
15. Complete automated tests/security/accessibility/performance pass.
16. Produce V1 evidence report and only then open Phase 2 gate.

## Definition of Done
A feature is not done until its UI, API/domain logic, persistence, authorization, validation, loading/empty/error states, audit requirements, responsive behavior and relevant automated tests are complete.

## Agent behavior
Read all `/docs` before major architectural work; preserve invariants; record consequential changes in `docs/11-DECISIONS.md`; never silently weaken requirements; do not commit credentials/secrets; prefer coherent commits; keep `TODO.md` truthful; when blocked by a real-world dependency, implement interface + sandbox adapter, document blocker, and never pretend production capability exists.
