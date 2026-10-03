# HashNomads — Design System & Experience Direction

## Brand idea
**HashNomads** represents owned mining hardware operating across a distributed network of professional infrastructure. The experience should communicate ownership, motion, geography, energy, precision and trust.

Working line: **Own the machine. We run the infrastructure.**

## Experience attributes
Premium · industrial · transparent · global · technical · calm · tactile · data-first.

## 2027 aesthetic
The site should look forward-looking without relying on gimmicks. Combine restrained **claymorphism**, dimensional cards, cinematic motion, rich data visualization, editorial typography and high-information dashboards.

### Surface hierarchy
- Background: near-black/graphite with subtle depth and optional fine grain.
- Level 1: elevated dark panels.
- Level 2: tactile clay cards for focal objects/KPIs.
- Level 3: overlays/modals with strong separation and accessible focus treatment.
- Financial/operational tables remain flatter and denser for readability.

### Color roles
Define semantic tokens rather than hardcoding colors in components:
- `bg/base`, `bg/elevated`, `surface/clay`, `surface/glass`
- `text/primary`, `text/secondary`, `text/muted`
- `accent/bitcoin` for primary brand/action emphasis
- `status/success`, `status/warning`, `status/danger`, `status/info`
- `chart/*` accessible series tokens

Do not use green to imply investment gains without context. Status colors must never be the only carrier of meaning.

## Typography
Use a modern variable sans for UI/editorial headings and a highly legible sans for body. Use monospace selectively for BTC addresses, worker IDs, serial numbers, hashes and raw telemetry. Maintain tabular numerals in KPI/financial contexts.

## Claymorphism rules
Allowed: ASIC cards, calculator controls, onboarding progress, KPI tiles, hero object, empty states, selected facility cards.

Avoid: dense tables, legal text, audit logs, long forms, incident lists.

Clay surfaces use soft multi-layer shadows, subtle inner highlight, modest corner radius and tactile press state. Preserve contrast in dark mode.

## Motion system
### Principles
Motion explains state, hierarchy or causality. It must never fabricate mining activity.

### Marketing
- Hero copy stagger: 350–700ms total.
- Abstract network/hash field: low-frequency ambient movement.
- ASIC hero object: slight pointer-responsive depth, disabled/reduced on touch/low-power contexts.
- Scroll reveals: short opacity/translate transitions; no scroll hijacking.

### Product
- KPI numbers animate only when values actually change or first load.
- Chart series draw/enter once; new data points transition subtly.
- Online pulse only when telemetry freshness proves online state.
- Deployment timeline animates transition between persisted states.
- Button press and card lift provide tactile feedback.
- Toasts and alerts use restrained entrance/exit.

### Accessibility/performance
Honor `prefers-reduced-motion`. Avoid essential information in motion. Lazy-load 3D/ambient effects. Maintain usable experience with JavaScript animation disabled. Target 60fps for local interactions and avoid large continuous GPU effects on mobile.

## Key marketing sections
1. Hero: ownership-first proposition + animated ASIC/topology visual.
2. Trust strip: transparent ownership, direct pool payout architecture, source-backed telemetry.
3. How it works: Buy → Assign → Deploy → Mine → Monitor.
4. ASIC marketplace preview.
5. Infrastructure/facility map concept.
6. Live-demo dashboard preview clearly marked sandbox where applicable.
7. Economics calculator.
8. Transparency/risk section.
9. FAQ.
10. CTA.

## Dashboard information architecture
Desktop uses persistent navigation; mobile uses compact navigation with priority actions. Dashboard top level should answer within seconds:
- How many miners do I own?
- Which are online/offline/stale?
- What is current/average hashrate?
- What rewards are reported/paid?
- What invoices/actions need attention?
- Is there an incident affecting my miner?

## ASIC card anatomy
Manufacturer/model, hero render/photo, hashrate, efficiency, nominal power, status/availability, compatible facility state, price/quote, estimated scenario CTA, compare/add-to-order CTA. Estimates must link to assumptions.

## Data visualization
Charts must expose units, time range, timezone, source freshness and empty/stale states. Tooltips must work with keyboard/touch. Avoid decorative charts that cannot be interpreted.

## Copy style
Plain, precise and ownership-focused. Avoid hype such as “risk-free,” “guaranteed passive income,” “money machine,” or unsupported ROI claims. Prefer “estimated,” “reported by pool,” “last observed,” and “scenario based on…”

## Responsive expectations
Design mobile-first customer flows. Admin/operations may use responsive tables with column priority, drawers and detail views rather than forcing desktop tables into narrow screens.
