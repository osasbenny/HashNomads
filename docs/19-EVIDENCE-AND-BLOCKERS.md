# Evidence and blockers — 2026-10-08

## Baseline

- Audit/main SHA: `f7b1ca8e697cb29a19b672b316d4ff9ebdc29629`. Implementation branch: `feat/m0-release-integrity`.
- Owner-approved source: HashNomads V2. Existing repository history, deployed project, hosted database configuration, Better Auth, Prisma migrations and integrations are retained.
- Audit reported CI run `37715356297`: 48 browser tests passed, 7 failed; dependency audit 11 advisories (9 high, 2 moderate). These are audit observations, not new passing claims.
- Local tests use a fresh PostgreSQL 17 instance on port 55432 with five existing migrations and sourced catalogue seed. No production database changes or provider transactions performed.
- Captured 49 baseline screenshots: 7 routes at 320/375/390/430/768/1024/1440px. Private local evidence is in workspace `outputs/M0-baseline`.

## M0 safety implementation

The following changes are implemented locally and are not yet production-verified:

- Checkout cannot invent invoice addresses, confirm payment, assign ownership or generate physical serials through browser writes. Review UI remains; checkout is unavailable until verified server providers and commercial terms exist.
- Wallet controls cannot self-verify, activate or delete destinations through the generic client API. The secure change workflow remains a later milestone.
- Server profile updates reject role, KYC and email escalation fields. Existing financial mutation denial remains in place.
- Admin overview requires administrator MFA, returns queried database counts and timestamped audit events, and leaves miner/pool/payment/telemetry availability unverified. Database and session verification reflect actual requests, not provider uptime.
- Account notifications use scoped database records; fictitious PDF documents and maintenance alerts are replaced with empty states. Support submission failures no longer report success.
- Public fictional prices, customer stories and operational readings are removed. The hash-rate graphic does not generate random readings. Decorative ASIC illustration remains. Regional hosting information requires written confirmation.
- Country/range inputs and footer icon links receive accessible names without a design-token change. Mobile hamburger, footer year and design credit remain.
- Portal MFA display reads the server profile; it no longer always says disabled. The Bitcoin subsidy constant is corrected to 312,500,000 satoshis.
- Compatible dependency updates and a valid selector-parser override reduce the audit to 5 high / 0 moderate / 0 critical findings. No force upgrade, waiver or audit suppression applied.

## Verification

- Local optimized build: passed. Typecheck: passed. Unit suite: 16 passed. Database integration suite: 5 passed.
- Initial browser run: 47 passed / 9 failed. Six failures involved existing colour contrast; three encountered timeouts under concurrent local execution. Single-worker rerun with added tenant and overview assertions: 52 passed / 5 failed, all five public WCAG colour-contrast checks. Authenticated financial/KYC/wallet/ownership denial, cross-tenant reads, admin MFA and queried counts, mobile menu and footer checks passed. This is isolated local evidence, not staging/CI verification.
- Formatting baseline had 30 nonconforming files outside the preserved imported V2 source. Repository formatter applied; format recheck passed. Final rebuilt security/commerce verification: 12 passed, including server profile MFA reporting. Repeated runs initially exhausted the isolated database's public form rate bucket (HTTP 429); only those test rate buckets were reset, and the rerun passed with production protections unchanged.
- Captured 49 post-change screenshots in workspace `outputs/M0-after`, plus refreshed current/proposed muted-text previews. Public content changes account for expected visual differences; layout/tokens/fonts/navigation/illustrations remain the accepted source. Owner visual acceptance is still open. Axe identified a prohibited ARIA attribute on the empty hash-rate graphic; its explicit image role was corrected without changing appearance.
- Full accessibility tests remain enabled; no failed test deleted or weakened. Legacy commercial assertions now check absence of fabricated slots/tariffs and truthful quote availability.
- Source and route changes have not been deployed. Passing local tests are not production verification or proof of live mining.
- Savepoint `61a1a74ed8951a598c816388f659073bf92c5dab` committed and pushed; draft PR https://github.com/osasbenny/HashNomads/pull/2. GitHub validation run `37759847061` started; its final result is not yet verified.
- Final optimized rebuild passed. Repeated seven-route axe scan after the graph's ARIA repair reports only colour-contrast violations (home 23 nodes; signup/login/marketplace/about 3 each; facilities 10; calculator 11). No new non-contrast accessibility violation remains in that scan. Final local working tree was clean after the implementation savepoint.

## Open gates

| Gate | Status | Required next action |
| --- | --- | --- |
| Muted text contrast | BLOCKED-BY-EXTERNAL | Owner approval of visible accessibility remediation, as required by the handoff. Current/proposed login and facility screenshots are in workspace outputs. Include all affected muted text classes, then rerun axe and screenshot review. |
| Dependency audit | IMPLEMENTED-UNVERIFIED | Five high findings remain in Tailwind 3 → fast-glob/micromatch/braces/chokidar. A validated dependency replacement/migration is required; a blind Tailwind 4 force upgrade is prohibited. |
| Browser/visual acceptance | IMPLEMENTED-UNVERIFIED | Finish serial rerun, post-change multi-width evidence and review. Contrast remains a release blocker. |
| Luxor | BLOCKED-BY-EXTERNAL | Owner created `hashnomads`; authenticated subaccounts and scoped Bitcoin worker GETs both HTTP 200 (one subaccount, zero workers). API connectivity verified independently of physical operation. Payouts not configured, no linked facility/site; production read-only secret, approved customer payout model and real physical workers remain required. Existing keys retained. See document 21. |
| Resend | BLOCKED-BY-EXTERNAL | Verified sender domain, approved sender/reply-to, server key and actual delivery evidence. |
| Dojah | BLOCKED-BY-EXTERNAL | Approved application/workflow/environment, jurisdiction coverage, credentials and callback verification contract. |
| Cryptomus / BTCPay | BLOCKED-BY-EXTERNAL | Approved merchant/store setup, restricted server credentials, asset/network and signed webhook details; stock/legal acceptance before live charging. |
| Supplier / hosting | BLOCKED-BY-EXTERNAL | Phase 2 signed stock, serial provenance, custody, tariffs, capacity, fulfillment and SLA evidence. |
| Crisp | BLOCKED-BY-EXTERNAL | Workspace/site setup and support routing/retention/coverage decisions. |
| Production release | BLOCKED-BY-EXTERNAL | Complete M0 gates, review feature PR and obtain owner release approval. Main pushes trigger production; do not use main for unfinished changes. |

M0 is not complete and the commercial mining system is not at 100%. Further milestone acceptance requires the evidence in document 18 and the approved handoff. No existing production credential, integration installation or remote setup has been removed.
