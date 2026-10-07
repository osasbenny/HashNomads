# HashNomads V2 — design adoption and integration record
Date: 2026-10-07
Branch: `integration/v2-design-prisma` (draft pull request #1).
Production branch: `main`, deliberately unchanged.

## Binding design decision
`osasbenny/HashNomadsV2` is the single, officially accepted design source. Preserve visual structure, imagery, iconography, typography, responsive layout, interactive motion, color tokens and composition. Do not redesign or substitute V1 visuals. Only technical import and framework compatibility adjustments are authorized.

## Implementation on integration branch
- Source V2 React screens and Tailwind design system copied to `apps/web/src/v2` (original screenshots and source repo remain the visual acceptance baseline).
- V2 React Router rendered within existing Next.js app (homepage, signup, login, purchase, customer portal and operations UI); V1 chrome is not added to V2 screens.
- Original Prisma/PostgreSQL DB, provider domain schema and Better Auth maintained; V2 auth context wired to Better Auth.
- Old browser Supabase client replaced by a V2-facing, tenant-scoped server API at `/api/v2/data`, backed by Prisma. Source module path retained as compatibility shim only; there is no Supabase connection or credential.
- Customer profile and support-case mutations use authenticated server APIs. Sensitive crypto and mining mutations remain gated.
- Existing project CI runs Prisma migrations, unit tests, integration tests, Next.js build and Playwright browser checks. New server-side security probes were added.

## Not production ready
- Production payment provider checkout/invoice creation, signed verified webhook and settlement, customer KYC approval and ASIC serial ownership, wallet verification/activation, deployed pool and telemetry integrations, hosting billing flows are NOT yet connected.
- V2 source contains static mining/network statistics and operational claims that must not be treated as verified live figures. The owner's approved visuals are not silently changed; publishing these claims as facts needs explicit review and live evidence.
- V2 original palette has accessibility contrast warnings in current automated tests. Owner-directed visual parity takes precedence until an explicit accessible visual update is approved.
- Dependency audit found high-severity vulnerabilities, including Tailwind CSS v3 transitive utilities, despite pruning unused Vite/ESLint dependencies. Security audit remains a release blocker.
- Browser acceptance and Vercel preview build are not fully green; tests must be rerun against latest commit. Vercel build/event and environment diagnostics are currently blocked by team-scope API authorization.
- Main and production Vercel domain must not be merged or promoted until CI passes, a functional preview is verified, and the owner signs off on parity.

## Acceptance steps
1. Complete Vercel preview environment permissions and database URLs, using Preview-only secrets; do not expose secrets in GitHub.
2. Verify functional preview on mobile/tablet/desktop against V2 reference and prove CSS parity, including page transitions and imagery.
3. Ensure PostgreSQL/Prisma account, order, invoice and telemetry reads return consistent user-owned records.
4. Keep all financial/KYC/ownership/wallet mutations locked until server provider integrations and tests pass.
5. Resolve security audit and accessibility exceptions with the owner's design-approval constraint; preserve the approved V2 visual baseline.
6. On passing evidence, mark draft PR ready; merge into main only with explicit deployment authorization.
