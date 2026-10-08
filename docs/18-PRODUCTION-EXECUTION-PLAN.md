# Production execution plan — 2026-10-08

The owner approved implementation of the production audit and handoff on 2026-10-08, with commit/push at each savepoint and preservation of existing remote setup. This plan implements that handoff within the existing V2 application, Better Auth, Prisma/PostgreSQL and Vercel project. It supersedes older sandbox-era and BitPay-first delivery plans without deleting their historical evidence.

## Delivery rules

- Preserve accepted V2 branding, fonts, composition, imagery, 3D illustration, navigation, responsive structure and footer. Visible accessibility changes require owner approval with screenshots.
- Work from audited main `f7b1ca8e697cb29a19b672b316d4ff9ebdc29629`, on PR branches. Commit/push each tested savepoint; release only after gates and owner approval. Do not replace main, reset customer databases, remove existing integrations or change production secrets to perform local testing.
- Keep company checkout separate from noncustodial pool-to-customer mining payouts. Never fabricate stock, serials, addresses, settled payments, verification, telemetry, rewards or uptime.
- Test mutations in an isolated PostgreSQL database. Keep credentials private, server-side and out of repository, logs, screenshots and chat.
- Report verified evidence separately from implementation. Use PRODUCTION-VERIFIED, STAGING/CI-VERIFIED, IMPLEMENTED-UNVERIFIED, BLOCKED-BY-EXTERNAL and NOT-IMPLEMENTED, with blockers in document 19.

## Milestones and gates

| Milestone | Implementation | Acceptance |
| --- | --- | --- |
| M0 — release integrity | Repair CI and dependency audit; remove fabricated statuses/documents/notifications/hero readings; block financial client writes; negative authorization and tenant tests; multi-width screenshots | All CI/security gates green, no unaccepted high/critical advisory, reviewed V2 parity, truthful operational states, owner approval before production release |
| M1 — identity and onboarding | Compatible profile migration, Resend verification/recovery, Dojah server adapter and authenticated callbacks, KYC eligibility, MFA/session lifecycle | Verified email → provider-approved KYC → eligible account; negative/expired-token tests and actual delivery evidence |
| M2 — verified commerce | Sourced specifications, supplier/hosting provenance, exact-money quotes, transactional reservations/expiry and capacity locking | Signed commercial terms, no oversell under concurrency, unavailable inventory cannot be paid for |
| M3 — checkout | Merchant-approved Cryptomus and BTCPay adapters, specific authenticated APIs, signed raw-body webhooks, event idempotency, reconciliation and exceptions | Authentic settlement advances an order exactly once; replay/forgery/underpayment/expiry/wrong-network cases tested; live charging requires stock/legal approval |
| M4 — physical operation | Evidence-backed serial/ownership/deployment lifecycle; Luxor worker/subaccount mapping; ingestion/freshness; pool rewards and paid-transaction reconciliation | Real serial/custody/deployment/worker evidence and timestamped provider telemetry; direct wallet payout proof where active |
| M5 — customer and operations | Secure wallet changes with step-up/review/one-active rule; metered hosting billing; real private documents/notifications/support; admin queues and Crisp | Tenant-scoped end-to-end traceability, auditable wallet and billing state, authenticated document access and actual help desk routing |
| M6 — release | Golden path and failure paths, production secret segregation, monitoring, recovery drill, legal/privacy/refund approval, acceptance report | CI/security green, owner-approved V2 evidence, actual provider/hardware/contract/reconciliation evidence, signed GO decision |

## Provider intake order

Luxor capability validation is the first read-only provider task, in parallel with M0. Confirm organization/subaccounts, worker capabilities, payout rules, access scopes and a private read-only API credential before mapping customer accounts. Account signup does not establish API readiness.

Resend needs a verified HashNomads sender domain, approved From/reply-to addresses and a server-only sending key. Dojah needs the approved application/environment, supported jurisdiction/workflow, application ID, server key and callback authentication details. Verify current official documentation before adapters are implemented.

Cryptomus needs merchant/use-case approval, merchant ID, Merchant Payment API key, approved assets/networks and callback verification details. BTCPay needs the actual server URL, store, restricted invoice credential and webhook secret; hosting it is a separate infrastructure task. Neither requires customer wallet private keys.

Crisp needs a created workspace/site identifier and support routing/coverage/retention decisions. Supplier and data-center contracts remain Phase 2 per owner instruction; they are required before accepting hardware/hosting payments, even if software is ready.

## Savepoint sequence

1. M0 safety and truthful data changes, negative tests, dependency improvements, baseline/after screenshots, evidence and remaining gates.
2. Complete remaining M0 security and approved accessibility fixes; review PR/CI and approve controlled release.
3. Provider capability preflight and M1 implementation with reversible schema changes and staging proof.
4. M2–M5 adapters and operational workflows, each committed/pushed with tests and external blockers recorded.
5. M6 acceptance report (`20-PRODUCTION-ACCEPTANCE-REPORT.md`) and explicit release decision. A milestone is not complete while its required evidence is missing.
