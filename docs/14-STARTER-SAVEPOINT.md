# HashNomads — Savepoint 1: foundation and public experience

Date: 2026-10-05. Environment: **SANDBOX**. **V1 acceptance is NOT complete. Phase 2 gate is CLOSED.**

This is the initial implementation milestone requested by the owner. It is not `13-V1-IMPLEMENTATION-REPORT.md`, which remains reserved for the completed V1 acceptance handoff.

## Implemented architecture

- npm-workspace TypeScript monorepo; `apps/web` contains Next.js App Router public pages and account/auth routes.
- `packages/domain`: immutable reference catalogue/facilities, exact integer money/scenario math, role permissions, tenant-owner predicate, miner transitions, telemetry freshness.
- `packages/config`: validated sandbox-only server configuration. No fallback auth/webhook secrets.
- `packages/db`: Prisma client, PostgreSQL schema, two migrations and idempotent seed. Core identity, customer/KYC, commerce, payments/settlements, ASIC/ownership/deployment, telemetry, wallet destinations, reward reporting, billing, support/incidents, integration/audit and jobs entities exist. Tables alone are not implemented services.
- `packages/integrations`: provider-neutral invoice contract; deterministic BTCPay-oriented sandbox invoice generator/raw HMAC verifier; fail-closed production BTCPay/Cryptomus/BitPay boundaries.
- Better Auth persists account/password-hash/session state in PostgreSQL. Default role is customer; role input is not writable during signup. Session refresh and logout are browser-tested.
- Semantic dark design tokens, local Manrope font, clay surfaces, lazy React Three Fiber illustrative ASIC, demand rendering, mobile/reduced-motion fallback, footer copyright year refresh and requested design credit.

Public reference prices/facilities are shared fixtures, not live supplier prices or real partners. S21 Pro nominal 234 TH/s / 3510 W / 15 J/TH specifications link to BITMAIN. No physical inventory is advertised; seeded units have `SIM-` identities.

## Capability classification

| Capability | Status | Boundary |
| --- | --- | --- |
| Public homepage/how-it-works/about/FAQ/transparency/legal draft | SANDBOX-READY | Legal text is a development shell; not production agreements |
| Hardware/detail/facility UI | SANDBOX-READY | Shared documented fixtures; persisted APIs/admin editing pending |
| Exact-money mining scenario calculator | SANDBOX-READY | Manual assumptions; no live price/network feed; excludes hardware/taxes/unspecified costs |
| PostgreSQL schema/migrations/seed | SANDBOX-READY | Local real PostgreSQL validated; service workflows pending |
| Account signup/signin/session/logout baseline | SANDBOX-READY | Synthetic accounts only; verification/recovery/MFA/step-up pending |
| Role/tenant predicates | SANDBOX-READY | Unit-tested foundation; full API enforcement pending |
| Sandbox invoice/signature contract | SANDBOX-READY | Unit contract only; not a payment engine, webhook endpoint, or live BTCPay protocol |
| Live payment/KYC/pool/facility/notifications | BLOCKED BY EXTERNAL DEPENDENCY | Protocol implementation, approved configurations and commercial/compliance activation needed |
| Onboarding/profile/consents/KYC workflows | NOT IMPLEMENTED | Schema only |
| Order/crypto checkout/webhook persistence/replay deduplication/reconciliation | NOT IMPLEMENTED | Schema and adapter contract only |
| Wallet validation/verification/step-up/activation | NOT IMPLEMENTED | Public-destination schema only; no key storage or custodial wallet |
| Assignment/deployment lifecycle service | NOT IMPLEMENTED | Schema and transition function only |
| Telemetry/pool/reward ingestion and jobs worker | NOT IMPLEMENTED | Schema/freshness primitive only |
| Hosting billing/payment/refund/adjustment services | NOT IMPLEMENTED | Schema/precision primitive only |
| Customer portal and admin operations console | NOT IMPLEMENTED | Account entry only |
| Full V1 security/failure/golden-path acceptance | NOT IMPLEMENTED | Initial tests do not cover pending workflows |
| Reviewed production hosting/legal/operations capability | BLOCKED BY EXTERNAL DEPENDENCY | No capacity claims or live sales |

No platform capability is classified PRODUCTION-READY at this initial savepoint.

## Validation actually executed

Host: Windows x64, Node 24.13.1. Real isolated local PostgreSQL 17.9 (port 55432) was provisioned for validation; the temporary launcher lives outside the repository. Standard checkout setup uses any configured PostgreSQL instance or the documented Docker service.

- `npm run db:generate` — pass.
- `npm run db:migrate` — both migrations applied successfully to an empty database.
- `npm run db:seed` — pass, repeated successfully without duplicate reference data.
- `npm test` — 16 tests pass: exact money/negative precision, scenario math, role separation, tenant predicate, illegal transitions, freshness, sandbox-only config, deterministic invoice references, supported rails, signature/timestamp/tamper checks and disabled production gateways.
- `npm run test:integration` — 5 tests pass: tables/seed, rejection of physical serial, immutable audit update/delete rejection, bigint round-trip beyond JS safe integer, partial unique index presence. Index-presence test is not a complete concurrency test.
- `npm run test:e2e` — 13 tests pass: public hardware/calculator/disclosures journey, negative scenario, five responsive widths across seven routes, mobile menu/reduced-motion, account signup/reload/logout, and five axe WCAG-tagged route scans. A catalogue label contrast finding was fixed and the full browser suite rerun successfully.
- `npm run typecheck`, `npm run format:check`, `npm run build` — pass.
- `npm audit --audit-level=high` — zero reported vulnerabilities at validation time.
- Agent-browser rendered home/account, meaningful navigation and hardware visual; no browser errors reported.

Browser checks do not constitute full manual WCAG certification. Core Web Vitals, cross-browser coverage, 200% enlargement, dedicated threat review, lint/static security tooling, backup/restore, concurrent lifecycle tests, clean-clone CI evidence and full V1 acceptance remain outstanding. CI workflow is provided; remote results must be verified independently after push.

## Database integrity controls

PostgreSQL partial unique indexes enforce one active owner/deployment per ASIC and one active payout destination per customer/purpose/network. CHECK constraints reject physical inventory identities, missing/double payment payables, nonpositive payments/orders, inconsistent order lines, invalid reward periods and inconsistent settlement arithmetic. Triggers reject updates/deletes of audit/reward/adjustment entries. Access to superuser migration credentials must never be granted to production application users; production DB grants/retention/backup design remains pending.

Quote snapshot immutability, cross-entity customer binding, comprehensive state enums and application-level financial workflows still need implementation and testing. Do not interpret these initial constraints as the whole security specification.

## Payment and wallet boundaries

No live crypto address is shown. Sandbox invoice `receivingReference` uses an unpayable `sandbox-only:` namespace. Rate is fixed at USD 100,000/BTC for contract tests, never represented as a market quote. Production classes deliberately reject activation. Stablecoin sandbox/provider behavior, unique receiving addresses from BTCPay, callback handling, replay persistence, settlement retrieval and hosting payments remain work to implement.

Wallets contain public-address metadata only in the schema. No wallet API exists yet. Private-key and mnemonic rejection tests must be implemented together with the destination API; the absent endpoint is not evidence that the wallet feature passes acceptance.

## Secrets and operation

`.env.example` documents database, auth and sandbox webhook requirements plus integration-ready provider variable names. Only generated local secrets are in ignored `.env`; none are committed. CI credentials are conspicuously synthetic, confined to disposable CI services. Production merchant credentials, private keys and customer recovery material are absent.

Run/install/build/test instructions and routes are in README. Live deployment of HashNomads.com was not requested or performed at this savepoint. The local preview runs on http://localhost:3000 while its process and database remain running. Use `npm run dev` or `npm run build` / `npm run start` to resume from the checkout.

## Next implementation slice

Complete persisted profile/consent/KYC onboarding and tenant-scoped quote/order services, then the signed/idempotent durable payment-event workflow, settlement reconciliation and hosting payables. Continue with wallet change security, assignment/deployment, pool/telemetry/rewards, customer/admin applications, durable workers and full failure/security/restore acceptance. Keep TODO truthful and commit/push each verified savepoint.
