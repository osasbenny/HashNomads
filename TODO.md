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
- [ ] Initialize TypeScript monorepo
- [ ] Configure lint/format/typecheck/test
- [ ] CI workflow
- [ ] Typed environment validation
- [ ] PostgreSQL schema + migrations
- [ ] Seed deterministic sandbox data
- [ ] Auth + session management
- [ ] RBAC authorization matrix
- [ ] Audit event service
- [ ] Base design tokens/components

## Phase 1B — Public experience
- [ ] Homepage
- [ ] How It Works
- [ ] ASIC catalogue
- [ ] ASIC detail
- [ ] Facility sandbox catalogue
- [ ] Mining scenario calculator UI
- [ ] Transparency/risk page
- [ ] FAQ/About/Legal shells
- [ ] Motion + claymorphism implementation
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
