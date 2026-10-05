# HashNomads — Master TODO

## Documentation foundation
- [x] README / project charter
- [x] Master build prompt
- [x] V1 PRD
- [x] Design system / motion direction
- [x] Architecture
- [x] Data model
- [x] API/integration strategy
- [x] Security/compliance baseline
- [x] Test/acceptance specification
- [x] Roadmap
- [x] Operations model
- [x] Phase 2 readiness gate
- [x] Decision log
- [ ] Profit model / unit economics (next workstream)
- [ ] Phase 2 hosting partner plan (after profit model/V1 evidence)

## Phase 1A — Foundation
- [x] Initialize TypeScript monorepo
- [ ] Configure lint/format/typecheck/test
- [x] CI workflow
- [x] Typed environment validation
- [x] PostgreSQL schema + migrations
- [x] Seed deterministic sandbox data
- [ ] Auth + session management
- [ ] RBAC authorization matrix
- [ ] Audit event service
- [x] Base design tokens/components

## Phase 1B — Public experience
- [x] Homepage
- [x] How It Works
- [ ] ASIC catalogue
- [ ] ASIC detail
- [ ] Facility sandbox catalogue
- [x] Mining scenario calculator UI
- [x] Transparency/risk page
- [x] FAQ/About/Legal shells
- [x] Motion + claymorphism implementation
- [ ] Reduced-motion/performance pass

## Phase 1C — Onboarding/commerce
- [ ] Customer profile
- [ ] KYC provider interface + sandbox
- [ ] Consent/version records
- [ ] Order/line-item domain
- [ ] Checkout/payment provider interface + sandbox
- [ ] Signed/idempotent webhook simulator
- [ ] Order history/detail

## Phase 1D — Mining core
- [ ] ASIC registry
- [ ] Ownership assignment state/invariants
- [ ] Facility/hosting plan domain
- [ ] Deployment state machine
- [ ] Mining pool provider interface + sandbox
- [ ] Miner telemetry provider interface + sandbox
- [ ] Telemetry ingestion/freshness
- [ ] Wallet destination management
- [ ] Rewards ledger

## Phase 1E — Portals/operations
- [ ] Customer dashboard
- [ ] Miner detail + charts
- [ ] Earnings/rewards
- [ ] Hosting billing/invoices
- [ ] Notifications/support
- [ ] Admin customer/KYC views
- [ ] Admin order/inventory/deployment views
- [ ] Fleet health/incidents
- [ ] Reconciliation
- [ ] Integration health
- [ ] Audit viewer

## Phase 1F — Hardening
- [ ] Unit tests
- [ ] Integration tests
- [ ] Provider contract tests
- [ ] Golden-path E2E
- [ ] Failure-path E2E
- [ ] Authorization/tenant-isolation suite
- [ ] Accessibility QA
- [ ] Responsive QA
- [ ] Performance QA
- [ ] Threat model/security review
- [ ] Backup/restore staging test
- [ ] V1 evidence report
- [ ] Phase 2 readiness review

## Rule
Never mark an item complete because a UI mock exists. Completion requires the applicable backend/domain/persistence/authorization/error states/tests defined by the project documents.

## Savepoint 1 — 2026-10-05

- PostgreSQL migrations, idempotent seed, secure account/session library, exact-money scenario engine, permission predicates, and sandbox payment contract are implemented and tested.
- Public hardware/detail/facility screens use documented reference fixtures; persisted catalogue APIs/admin management remain pending, so their full checklist entries remain open.
- Auth/session baseline is tested for signup, reload and logout. Verification, recovery, MFA and step-up remain pending; the overall auth/security checklist remains open.
- CI and initial unit/integration/browser/accessibility tests exist. Full V1 tests are still pending; partial coverage does not close Phase 1F.
- No customer KYC/order/payment/wallet/miner/reward/billing lifecycle or operations console is claimed complete.
- Next work: persisted customer onboarding/consents, KYC sandbox, tenant-scoped order and checkout services, durable signed-webhook handling and payment reconciliation, with adversarial integration/E2E tests.
- See `docs/14-STARTER-SAVEPOINT.md`; the final V1 implementation report is reserved until all acceptance criteria pass.

## Savepoint 2 — Brand imagery and requested label removal

- [x] Remove global sandbox banner and phase/sandbox footer label per owner direction.
- [x] Replace homepage hero with pitch-deck infrastructure imagery; add ASIC close-up and North America network illustration.
- [x] Preserve automated copyright year and Cactus Digital Media design credit.
- Contextual test-data disclosures and backend activation gates remain tied to actual implementation status. See ADR-011 for the distinction between production brand intent and service readiness.
- Validation: production build and formatting pass; all 13 existing browser/accessibility tests pass, including five responsive widths. Three pitch-deck images are confirmed loaded, both requested labels are absent, and no browser errors were recorded. Existing in-app preview refreshed.

## Savepoint 3 — Vercel hosting and hosted accounts

- [x] Configure Vercel monorepo build and server-side environment variables.
- [x] Provision free Prisma Postgres database and apply both migrations.
- [x] Publish https://hashnomads.vercel.app and connect GitHub for subsequent deployments.
- [x] Verify all 13 browser/accessibility checks against the published site, including persisted signup/session/logout.
- [x] Confirm database health and all three homepage images.
- Live payment/mining activation, custom domain mapping, full transactional lifecycle and preview database setup remain pending. See `docs/15-VERCEL-DEPLOYMENT.md`.

## Savepoint 4 — Commercial site and enquiry operations

- [x] Replace customer-facing development language and artificial prices/facilities.
- [x] Expand the sales journey around the Sazmining reference, with original HashNomads presentation and explicit source attribution.
- [x] Add persisted enquiries, newsletter consent/unsubscribe and public enquiry email.
- [x] Add profile/password management and authenticator MFA.
- [x] Add a protected enquiry inbox, subscriber export and one-use admin setup for admin@hashnomads.com.
- [x] Apply hosted production migrations and remove the old validation account.
- [ ] Connect the owner's HashNomads checkout information.
- [ ] Connect verified mail delivery for notifications, verification, recovery and newsletters.
- [ ] Integrate the native operational lifecycle described above; actual fleet/financial data is required.
- See `docs/16-COMMERCIAL-RELEASE.md` for precise scope, sources, validation and remaining work.

## Savepoint 5 — About, contact widget and themes

- [x] Add About us to desktop/mobile navigation and replace the editorial shell with a dedicated, image-led About page.
- [x] Add a branded floating contact widget with enquiry, email and FAQ actions, keyboard focus handling and Escape dismissal.
- [x] Add a light/dark switch with saved browser preference and matching palettes across public and account pages.
- [ ] Connect a real-time chat provider and routing when the owner supplies the service configuration.
- Scope estimate: 35% for the entire planned system, 45% for all frontend screens, 25% for the backend, and 80% for the public website. These are engineering estimates, not acceptance scores. Native commerce, KYC, mining operations, billing and operational hardening remain the major unfinished areas.
