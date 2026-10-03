# HashNomads V1 — Test & Acceptance Specification

## Principle
A rendered UI is not a working mining platform. V1 must prove frontend, backend, persistence, state transitions, authorization, crypto payment/settlement boundaries, wallet security, provider boundaries and failure handling.

## Automated test layers
### Unit
Profitability/math, satoshi/fiat/token atomic precision, address validators, state machines, payment/rate expiry, fee calculations, freshness logic, permission predicates.

### Integration
DB/migrations, order→crypto-payment flow, settlement reconciliation, hosting-invoice payment, ownership assignment, deployment, reward ingestion, webhook idempotency, wallet-change workflow and audit events.

### Contract/provider
Every adapter runs fixtures/contract tests. Sandbox conforms to production interface. Payment adapter fixtures cover asset/network capabilities, invoice creation, expiry, payment events, duplicate/replayed events, settlement and provider outage.

### E2E
Playwright or equivalent against seeded sandbox.

## Golden-path E2E
1. Visit marketing/catalogue and calculator.
2. Create/verify account and complete sandbox KYC.
3. Select ASIC + compatible facility.
4. Create order and choose supported crypto payment asset/network.
5. Create sandbox crypto invoice with accounting amount, locked rate and expiry.
6. Process valid signed/idempotent payment event; order becomes paid only server-side.
7. Reconcile simulated settlement to HashNomads settlement ledger.
8. Operations assigns simulated ASIC and activates deployment.
9. Telemetry appears with source/freshness.
10. Customer registers and verifies valid test BTC payout destination; no private key is requested.
11. Reward appears as simulated/reported and references customer payout destination/pool reporting.
12. Hosting invoice is issued and paid through sandbox crypto checkout.
13. Customer traces order → payment → miner → deployment → reward → hosting invoice.
14. Admin/finance can trace settlement/reconciliation and privileged audit events.

## Mandatory negative/failure tests
- Cross-customer miner/order/payment/wallet access.
- Support role attempts admin/finance action.
- Invalid KYC transition.
- Browser success redirect without authoritative payment event.
- Duplicate payment webhook; replayed/invalid signature; wrong provider event/order binding.
- Underpayment/overpayment/expired rate scenario.
- Provider marks payment exception after client redirect.
- Settlement missing/mismatched/duplicate; reconciliation creates exception.
- Refund/manual adjustment without privilege/reason.
- Unsupported asset/network.
- Duplicate serial assignment.
- Invalid Bitcoin address/network.
- Wallet change without step-up auth.
- Attempt to submit seed phrase/private key to wallet API is rejected and not logged.
- Miner offline/stale telemetry; pool/facility API timeout/rate limit/malformed response.
- Reward duplicate ingestion; invoice mismatch; queue dead-letter; sandbox/production mixing.

## Frontend QA
360/390/768/1024/1440+; keyboard; focus; accessible labels; reduced motion; loading/empty/stale/error/partial states; no mobile overflow; animation never blocks interaction. Payment screens clearly show accounting total, crypto asset/network, rate expiry, payment status and sandbox label. Wallet UX explicitly states HashNomads does not need the recovery phrase/private key.

## Performance
Measure LCP/INP/CLS, JS/3D cost; lazy-load effects; paginate/window datasets.

## Security QA
Authorization matrix, dependency/secret scans, security headers/rate limits, webhook verification/replay defense, log redaction, session/logout, privilege escalation, wallet-change controls, and automated assertion that private-key/mnemonic-shaped sensitive inputs are never persisted by wallet endpoints.

## Data integrity QA
BTC/fiat/token precision round-trip; deterministic totals; immutable order/rate snapshots; one active owner/deployment; timezone boundaries; payment/settlement reconciliation; reward ledger kept separate from merchant settlement ledger.

## V1 exit criteria
100% critical golden path and mandatory isolation tests pass; no severity-1/critical or known high security defect; sandbox marked; CI green clean checkout; reproducible migration/seed; staging restore/rollback tested; evidence report records commands/build SHA/environment/limitations. Only then move to **Phase 2 Ready**.
