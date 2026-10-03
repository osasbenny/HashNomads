# HashNomads V1 — Test & Acceptance Specification

## Principle
A rendered UI is not a working mining platform. V1 must prove frontend, backend, persistence, state transitions, authorization, provider boundaries and failure handling.

## Automated test layers
### Unit
Profitability/math primitives, satoshi/fiat precision, validators, state machines, fee calculations, freshness logic, permission predicates.

### Integration
Database repositories/migrations, order/payment flow, ownership assignment, deployment transitions, reward ingestion, invoice generation, webhook idempotency, audit events.

### Contract/provider
Run each adapter against fixtures/contract tests. Sandbox adapters must conform to the same interfaces as production adapters.

### E2E
Playwright or equivalent against seeded sandbox environment.

## Golden-path E2E
1. Visit marketing site and catalogue.
2. Run calculator and inspect assumptions.
3. Create/verify account.
4. Complete KYC sandbox approval.
5. Select ASIC + compatible facility.
6. Create order and sandbox checkout.
7. Process signed/idempotent payment event.
8. Operations assigns simulated ASIC.
9. Deployment progresses to active.
10. Telemetry appears with source/freshness.
11. Reward entry appears as simulated/reported.
12. Customer registers valid test wallet destination.
13. Hosting invoice is issued.
14. Customer can trace order/miner/deployment/reward/invoice.
15. Admin audit log contains privileged transitions.

## Mandatory negative/failure tests
- Unverified/unauthorized customer accesses another customer's miner/order.
- Support role attempts admin-only action.
- Invalid KYC transition.
- Payment browser redirect without webhook confirmation.
- Duplicate payment webhook.
- Invalid/replayed webhook signature.
- Duplicate serial assignment.
- Invalid Bitcoin address/network.
- Wallet change without required re-auth.
- Miner offline and telemetry stale states.
- Pool API timeout/rate limit/malformed response.
- Facility integration unavailable.
- Reward duplicate ingestion.
- Invoice calculation mismatch.
- Queue retry/dead-letter path.
- Sandbox/production resource mixing attempt.

## Frontend QA
- 360/390/768/1024/1440+ viewport coverage.
- Keyboard-only core flows.
- Visible focus states.
- Screen-reader labels for controls/charts where feasible.
- Reduced-motion mode.
- Loading, empty, stale, error and partial-data states.
- No horizontal overflow on customer mobile pages.
- Animation does not block interaction.

## Performance
Measure public LCP/INP/CLS, JS weight and 3D/animation cost. Lazy-load nonessential visual effects. Dashboard lists/charts paginate or window large datasets.

## Security QA
Authorization matrix tests, dependency/secret scans, security headers, rate-limit checks, webhook verification, log-redaction checks, session/logout behavior, privilege escalation attempts.

## Data integrity QA
- BTC precision round-trip.
- Fiat totals deterministic.
- Historical order snapshots immutable.
- One active owner/deployment invariants.
- Timezone boundary tests.
- Reconciliation totals match source fixtures.

## V1 exit criteria
- 100% critical golden path pass.
- 100% mandatory authorization/isolation tests pass.
- No open severity-1/critical defects.
- No known high-severity security defect.
- All sandbox content visibly marked.
- CI green from clean checkout.
- Database migration + seed reproducible.
- Restore/rollback procedure documented/tested for staging.
- Evidence report records test commands, build SHA, environment and known limitations.

Only after these criteria pass may the project status move to **Phase 2 Ready**.
