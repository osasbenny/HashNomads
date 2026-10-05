# HashNomads

> Own the machine. We run the infrastructure.

HashNomads is a Bitcoin mining infrastructure platform designed to let customers purchase and own identifiable ASIC miners, deploy them with approved hosting partners, monitor mining performance, manage hosting obligations, and receive mining-pool rewards to customer-controlled Bitcoin wallets.

## Project status

**Phase 1 — V1 Platform Specification & Build**

The first implementation savepoint now includes a runnable public application, persisted sandbox account authentication, PostgreSQL schema/migrations/seed, domain/payment contract foundations and automated validation. **V1 is not complete and the Phase 2 gate is closed.** See `docs/14-STARTER-SAVEPOINT.md` for exact scope and outstanding work.

This repository begins documentation-first. No production hosting capacity, miner inventory, customer earnings, or payout capability should be represented as live until the corresponding infrastructure and contracts exist.

## Product principles

1. **Real ownership** — customer miner ownership is represented by an identifiable physical unit/serial number once deployed.
2. **Non-custodial by default** — where pool/provider capabilities allow, mining rewards should flow from the pool to a customer-controlled wallet rather than through HashNomads custody.
3. **Evidence over claims** — hashrate, uptime, deployment, ownership, fees, and rewards must be backed by source data and audit trails.
4. **Infrastructure-agnostic** — pool, ASIC vendor, KYC, payment, and hosting integrations sit behind adapters.
5. **Sandbox before production** — V1 supports a clearly labelled simulation mode until physical infrastructure is contracted.
6. **No guaranteed returns** — profitability estimates are scenarios, never promises.

## Documentation index

- [`docs/00-MASTER-PROMPT.md`](docs/00-MASTER-PROMPT.md) — authoritative build brief for engineering agents
- [`docs/01-PRD.md`](docs/01-PRD.md) — product requirements
- [`docs/02-DESIGN-SYSTEM.md`](docs/02-DESIGN-SYSTEM.md) — 2027 visual/interaction system
- [`docs/03-ARCHITECTURE.md`](docs/03-ARCHITECTURE.md) — system architecture and boundaries
- [`docs/04-DATA-MODEL.md`](docs/04-DATA-MODEL.md) — core entities and invariants
- [`docs/05-API-INTEGRATIONS.md`](docs/05-API-INTEGRATIONS.md) — API contracts and adapter strategy
- [`docs/06-SECURITY-COMPLIANCE.md`](docs/06-SECURITY-COMPLIANCE.md) — security, KYC and compliance gates
- [`docs/07-TEST-ACCEPTANCE.md`](docs/07-TEST-ACCEPTANCE.md) — V1 test strategy and Definition of Done
- [`docs/08-ROADMAP.md`](docs/08-ROADMAP.md) — phased delivery plan
- [`docs/09-OPERATIONS.md`](docs/09-OPERATIONS.md) — operating model and incident states
- [`docs/10-PHASE-2-GATE.md`](docs/10-PHASE-2-GATE.md) — requirements before hosting-partner negotiations
- [`docs/11-DECISIONS.md`](docs/11-DECISIONS.md) — architecture/product decision log
- [`TODO.md`](TODO.md) — execution checklist

## V1 surfaces

- Public website and ASIC catalogue
- Mining profitability calculator (scenario-based)
- Authentication and customer onboarding
- KYC sandbox/provider adapter
- Checkout/order sandbox/provider adapter
- ASIC ownership registry
- Facility/deployment model
- Mining telemetry and pool adapter
- Customer dashboard
- Hosting billing and invoice ledger
- Notifications/support states
- Admin/operations console
- Audit log

## V1 golden path

`Visitor → Account → KYC → ASIC → Facility → Estimate → Checkout → Order → Miner assignment → Deployment → Telemetry → Mining rewards → Hosting invoice → Customer dashboard`

V1 must also test failure paths: rejected KYC, duplicate webhooks, invalid wallet addresses, failed payment, miner offline/overheating, stale telemetry, provider outage, billing mismatch, unauthorized access, and idempotent retries.

## Important

HashNomads V1 is not permission to accept live hosted-mining orders. Production activation requires legal/compliance review, signed infrastructure agreements, verified capacity, production payment/KYC configuration, operational readiness, and completion of the Phase 2 gate.

## Run locally

Requires Node.js 22+ (validated on Node 24) and PostgreSQL 17+. Docker is optional if PostgreSQL is already available.

1. Run `npm ci`.
2. Copy `.env.example` to `.env`; set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `SANDBOX_WEBHOOK_SECRET`. Generate each secret independently with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Keep `.env` local.
3. If using Docker, set `POSTGRES_PASSWORD` in your shell, align it with `DATABASE_URL`, then run `docker compose up -d`. Database binding is loopback-only. Do not use the example password outside an isolated local sandbox.
4. Run `npm run db:generate`, `npm run db:migrate`, and `npm run db:seed`.
5. Run `npm run dev`; open http://localhost:3000.

For a production-mode **sandbox** build: `npm run build` then `npm run start`. Node runtime mode does not activate real payments, facilities or miners. `HASHNOMADS_ENV` must remain `sandbox`.

Validation: `npm run format:check`, `npm run typecheck`, `npm test`, `npm run test:integration`, `npm audit --audit-level=high`, `npm run build`, `npx playwright install chromium`, `npm run test:e2e`. Integration and account E2E tests require the migrated, seeded sandbox DB. Integration tests append synthetic audit evidence; use a dedicated test database. CI provisions its own PostgreSQL service.

## Current routes

`/`, `/marketplace`, `/marketplace/s21-pro`, `/facilities`, `/calculator`, `/how-it-works`, `/transparency`, `/about`, `/faq`, `/legal`, `/account`, `/api/auth/*`, `/api/v1/health`.

Accounts are persisted, but customer profile/KYC and transactional portal workflows are pending. Use synthetic account details. The schema, adapter boundaries, or a polished public page must not be interpreted as a completed backend lifecycle. The requested footer includes an automatically updating copyright year and Cactus Digital Media design credit.
