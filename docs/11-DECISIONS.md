# HashNomads — Decision Log

## ADR-001 — Ownership-first model
**Status:** Accepted

HashNomads is built around identifiable customer-owned ASIC units rather than an opaque promise of generic cloud hashrate. Fractional/tokenized ownership is outside V1.

## ADR-002 — Non-custodial mining rewards by default
**Status:** Accepted

Where provider capabilities permit, pool rewards should be directed to customer-controlled Bitcoin wallet destinations. HashNomads reports/reconciles source data but does not default to custodying customer mining rewards.

## ADR-003 — Provider adapter architecture
**Status:** Accepted

KYC, payment, pool, miner telemetry, facility, market-data and notification providers are abstracted behind typed interfaces. V1 uses deterministic sandbox adapters.

## ADR-004 — Documentation-first V1
**Status:** Accepted

Product, design, architecture, security and acceptance criteria are defined before implementation. A feature is not complete merely because its frontend renders.

## ADR-005 — 2027 design language
**Status:** Accepted

Dark premium industrial-fintech visual language with restrained claymorphism, purposeful motion, high-quality data visualization and optional lightweight 3D. Accessibility, reduced motion and performance override decoration.

## ADR-006 — Production claims gated
**Status:** Accepted

Until physical hosting capacity and production integrations are contracted/verified, facilities, miners, telemetry and rewards in V1 are sandbox and must be labelled accordingly.

## ADR-007 — Profit model is a separate workstream
**Status:** Accepted

V1 includes the interfaces/data structures needed for scenario calculations, fees and billing, but the commercial profit model, pricing and unit economics will be specified immediately after the documentation foundation rather than guessed into V1.

---

Add future decisions here with context, decision, alternatives considered and consequences. Do not rewrite accepted decisions silently.
