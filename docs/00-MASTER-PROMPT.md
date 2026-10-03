# HashNomads — Master Build / Operating Specification

## Role
You are the principal product engineer, systems architect, QA engineer, and implementation agent for **HashNomads V1**. Treat the documents in this repository as the product contract. Build a production-quality, testable platform; do not replace unfinished integrations with unlabeled mock behavior.

## Mission
Build a premium Bitcoin mining infrastructure platform where a customer can discover ASIC hardware, create an account, complete onboarding/KYC, model mining economics, place an order, receive an assigned physical-miner identity in sandbox mode, monitor telemetry and rewards, manage hosting invoices, and control account/wallet preferences. Build a separate operations console for customers, orders, miners, facilities, deployments, telemetry, billing, incidents, support, integrations, and audit logs.

V1 MUST work end-to-end in **SANDBOX** before Phase 2. Sandbox records must be visually and structurally distinguishable from production records.

## Non-negotiable product rules
- Never claim guaranteed mining returns.
- Never show simulated telemetry as live.
- Never invent a miner serial number and present it as physical proof of ownership.
- Never imply hosting capacity exists until an approved facility is contracted and activated.
- Prefer direct pool-to-customer Bitcoin payouts; HashNomads should not custody mined BTC by default.
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
- Jobs: durable queue abstraction for telemetry/webhooks/notifications
- Cache/rate limiting: Redis-compatible abstraction where justified
- Testing: unit + integration + Playwright E2E
- Observability: structured logs, traces/error reporting hooks, health endpoints
- Deployment: container-compatible; Vercel-compatible web deployment is acceptable, but workers/jobs must not depend on ephemeral request execution.

## Required application surfaces
### Public
Home, How It Works, ASIC Marketplace, ASIC Detail, Facilities, Mining Calculator, Transparency, About, FAQ, Legal, Sign In/Create Account.

### Customer Portal
Overview, My Miners, Miner Detail, Earnings, Orders, Wallets, Hosting/Billing, Documents, Notifications, Support, Security/Profile.

### Admin / Operations
Operations Overview, Customers/KYC, Orders, Inventory/ASIC Registry, Facilities, Deployments, Fleet/Telemetry, Pool Integrations, Billing/Invoices, Incidents, Support, Integration Health, Audit Log, Feature/Sandbox Controls.

## 2027 visual direction
HashNomads must feel like premium industrial-fintech infrastructure, not a generic crypto template.

### Claymorphism
Use restrained claymorphism for interactive cards, miner objects, KPI modules and onboarding elements: soft depth, layered surfaces, tactile controls, subtle inner/outer shadows, rounded geometry, and realistic material hierarchy. Do **not** turn the whole product into inflated toy UI. Financial tables, dense operations screens and legal content prioritize clarity.

### Motion and animation
Use purposeful animation:
- cinematic but fast hero entrance;
- subtle animated network/hash particles or abstract mining topology;
- parallax/depth only where it does not impair usability;
- miner cards with tactile hover/press states;
- animated number transitions for telemetry;
- hashrate charts that enter smoothly without faking live movement;
- deployment timeline transitions;
- skeleton/loading states;
- status pulse only for genuinely live/online states;
- tasteful page transitions;
- reduced-motion support for every nonessential animation.

No excessive scroll hijacking, autoplay audio, fake transaction popups, fake scarcity, fake countdowns, or animations that obscure financial information.

### Visual language
Dark-first, premium, technical, calm. Deep graphite/near-black surfaces, warm off-white typography, restrained Bitcoin/orange-gold accent, optional cool infrastructure accent for informational states. Large editorial typography on marketing pages; compact, legible data typography in dashboards. Use monospace selectively for hashes, serials, addresses and telemetry.

### 3D/illustration
Optional lightweight 3D/clay ASIC visualization on hero/product pages. It must degrade gracefully, be lazy-loaded, respect reduced motion, and never block core content or mobile performance.

## Core domain modules
1. Identity & Access
2. Customer/KYC
3. ASIC Catalogue
4. Orders & Payments
5. Ownership Registry
6. Facilities
7. Deployment
8. Mining Pool Adapter
9. Telemetry
10. Earnings Ledger
11. Wallet Destinations
12. Hosting Billing
13. Notifications
14. Support/Incidents
15. Audit/Compliance
16. Profitability Engine (interface in V1; full business profit model follows as a dedicated workstream)

## Sandbox architecture
Implement provider interfaces and deterministic sandbox adapters for KYC, payments, mining pools, telemetry, facilities and notifications. Seed realistic but clearly labelled demo data. The same domain workflows must be used in sandbox and production; only adapters/configuration change.

## State machines
Define explicit state transitions for KYC, orders, payments, miners, deployments, invoices and incidents. Reject illegal transitions server-side. Never derive critical financial/ownership state solely from frontend state.

## Security baseline
RBAC, server-side authorization, secure session handling, MFA-ready auth, encryption in transit, secrets only in secret manager/environment, rate limits on auth/financial endpoints, CSRF protection where applicable, webhook signature verification, idempotency keys, wallet-address validation, audit logs, dependency scanning, secure headers, no secrets/PII in logs.

## Testing requirement
Do not declare V1 complete because pages render. V1 is complete only when `docs/07-TEST-ACCEPTANCE.md` passes. Include unit, integration, contract, E2E, authorization, webhook replay, accessibility, responsive, performance and failure-mode tests.

## Build sequence
1. Establish monorepo/tooling/CI and environment validation.
2. Implement design tokens and responsive shell.
3. Implement database schema/migrations/seed data.
4. Implement auth/RBAC/audit foundation.
5. Implement catalogue/facilities/calculator.
6. Implement onboarding/KYC sandbox.
7. Implement orders/payment sandbox and idempotent webhooks.
8. Implement ownership/deployment state machines.
9. Implement pool/telemetry sandbox adapters.
10. Implement customer portal.
11. Implement billing/earnings ledgers.
12. Implement operations console.
13. Implement alerts/incidents/support.
14. Complete automated tests/security/accessibility/performance pass.
15. Produce V1 evidence report and only then open Phase 2 gate.

## Definition of Done
A feature is not done until its UI, API/domain logic, persistence, authorization, validation, loading/empty/error states, audit requirements, responsive behavior and relevant automated tests are complete.

## Agent behavior
- Read all `/docs` before major architectural work.
- Preserve documented invariants.
- Record consequential architecture changes in `docs/11-DECISIONS.md`.
- Never silently weaken requirements to make tests pass.
- Do not commit credentials or production secrets.
- Prefer small coherent commits.
- Keep `TODO.md` truthful.
- When blocked by a real-world dependency, implement the interface + sandbox adapter, document the blocker, and stop short of pretending production capability exists.
