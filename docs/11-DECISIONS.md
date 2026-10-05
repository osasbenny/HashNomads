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

## ADR-008 — BTCPay preference supersedes the initial BitPay proposal
**Status:** Accepted — 2026-10-05, explicit owner build instruction

The owner-provided V1 build prompt prioritizes BTCPay Server as native Bitcoin payment infrastructure. This supersedes the older proposed BitPay-first statements in documents 00, 01, 03, 05, 06 and 12. BTCPay, Cryptomus and BitPay retain provider-neutral adapter boundaries. No production adapter is activated by this decision.

The first savepoint implements a deterministic BTCPay-oriented sandbox invoice/signature contract; it is not the BTCPay Greenfield API or production webhook protocol. Production adapter classes fail closed. They require real protocol implementation, configuration, contract validation and approval before activation. Sandbox receiving references deliberately cannot receive real funds. BTC rates and amounts use integers; sandbox rate is an explicit fixed fixture.

## ADR-009 — Initial delivery is a foundation savepoint, not V1 acceptance
**Status:** Accepted — 2026-10-05

Use an npm-workspace TypeScript monorepo, Next.js 16/React 19, Prisma 6/PostgreSQL, Better Auth, Vitest, Playwright and axe. Prisma 6 preserves the documented schema/migration workflow. The deepmerge-ts transitive dependency is overridden to patched version 8; migrations, generation, tests and build validate compatibility.

The first runnable surface is `apps/web`. A separate admin application and durable worker process remain pending; no background financial job is executed in an ephemeral request. The complete domain schema is included ahead of service implementation. Table existence is not evidence of a completed workflow. Schema permits only sandbox environment values; enabling production requires a reviewed migration and activation gate.

Public catalogue/facility pages currently read shared reference fixtures also used by the deterministic DB seed. They do not yet expose persisted catalogue administration. Better Auth persists account and session state in PostgreSQL. Customer onboarding, email verification/recovery, MFA/step-up and full customer/admin authorization remain pending; there is no privileged operations UI yet.

## ADR-010 — Purposeful use of premium visual references
**Status:** Accepted — 2026-10-05

Reviewed the five owner-supplied reference repositories. React Three Fiber is used for a lazy-loaded, static-demand illustrative ASIC scene, with no canvas on mobile or reduced-motion devices. It is not a manufacturer render or physical inventory evidence. Typography and layered graphite surfaces carry the remainder of the design.

Liquid Glass JS, Scroll World, Liquid Logo and Shader Gradient are not installed at this savepoint: continuous distortion, scroll choreography and multiple overlapping GPU effects are unnecessary for the core financial interface. Reassess them only for a concrete visual requirement and measured performance budget. The supplied Liquid Glass URL uses `dasherstw`; the discoverable project is `dashersw/liquid-glass-js`. No package or code was taken from the misspelled location.

Reference links: https://github.com/pmndrs/react-three-fiber, https://github.com/dashersw/liquid-glass-js, https://github.com/oso95/scroll-world, https://github.com/paper-design/liquid-logo, https://github.com/ruucm/shadergradient.

## ADR-011 — Production brand presentation and pitch-deck imagery
**Status:** Accepted — 2026-10-05, explicit owner instruction

The owner identifies HashNomads as a live production project and requests removal of the global sandbox announcement and `PHASE 01 / SANDBOX` footer label. Both are removed, along with the redundant homepage sandbox footnote. Public metadata now describes the brand without environment language. Copyright/year refresh and Cactus Digital Media credit remain.

Three optimized WebP assets are extracted from the owner-supplied compliance pitch-deck video: mining infrastructure (slide 2, 6 seconds), ASIC close-up (slide 5, 21 seconds), and North America network illustration (slide 12, 56 seconds). Crops exclude slide text and deck furniture. Assets are used as brand/editorial imagery, not verified facility capacity, real inventory proof, or a manufacturer-specific product photograph. The photographic hero replaces the homepage 3D preview; the hardware detail retains its illustrative 3D visual. Responsive image sizes, lazy loading for secondary assets, alt text and mobile layouts are provided through Next Image.

This changes brand presentation; it does not establish that unfinished services, fixture prices, accounts or payment integrations have passed production acceptance. Runtime payment/financial gates and contextual fixture disclosures remain until actual implementation and activation. Production provider credentials or fabricated physical capacity are not introduced.

## ADR-012 — Commercial release and native checkout direction

**Status:** Accepted — 2026-10-05, explicit owner instruction

The owner requires a customer-facing production website without artificial data or development language, confirms common ownership with Sazmining and authorizes its published information as a reference. This supersedes the initial environment/public-copy decisions. The public release replaces invented facilities and pricing with source-attributed information and quote enquiries. Runtime account/form persistence uses production configuration; financial generators are isolated in tests.

The owner will provide HashNomads' own checkout configuration. Do not redirect purchases to Sazmining or invent available equipment, purchase prices, transactions, mining charts or earnings. Sazmining source links and advisor booking remain clearly identified. Native operational and mail integrations are outstanding, as documented in the current release record. Owner-designated addresses are info@hashnomads.com and admin@hashnomads.com. Administrator setup uses a private expiring invitation and requires MFA for customer data access.
