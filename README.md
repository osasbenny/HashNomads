# HashNomads

> Own the machine. Build your Bitcoin future.

Customer-facing Bitcoin mining website: https://hashnomads.vercel.app

## Current release

Production remediation follows the owner-approved 2026-10-08 handoff. See [execution plan](docs/18-PRODUCTION-EXECUTION-PLAN.md) and [current evidence and blockers](docs/19-EVIDENCE-AND-BLOCKERS.md) for the authoritative implementation/release status. The accepted V2 UI is integrated; older release descriptions below are historical and do not establish current live mining or checkout readiness.

The site provides hardware specifications, a sourced hosting directory, an exact-money cost calculator, customer accounts, enquiry forms, newsletter consent and an administrator inbox. The commercial site uses production configuration and hosted PostgreSQL persistence. It does not generate inventory, prices, orders, payments, mining performance or earnings.

The owner confirmed shared ownership with Sazmining and authorized its information as a reference. Facility locations, publicly published tariffs, advisor booking, education resources and review links identify Sazmining as their source. A HashNomads quote establishes the actual purchase terms. The owner will supply HashNomads' own checkout configuration; purchases are not redirected to another storefront.

See [current release evidence and remaining integrations](docs/16-COMMERCIAL-RELEASE.md). Earlier specification and savepoint documents are historical; this release supersedes their environment and public-content decisions.

## Run locally

Requires Node.js 22+ and PostgreSQL 17+; validated with Node.js 24.

1. `npm ci`
2. Copy `.env.example` to `.env`; configure `DATABASE_URL`, `BETTER_AUTH_URL` and `BETTER_AUTH_SECRET`. Generate the secret independently using a cryptographically secure generator. Keep it local.
3. `npm run db:generate`
4. `npm run db:migrate`
5. `npm run db:seed` — saves sourced specifications and the facility directory, never inventory or commercial pricing.
6. `npm run dev` — http://localhost:3000

For a production build: `npm run build`, then `npm run start`.

When upgrading the previous local checkout, remove its unused artificial inventory and invented facilities before applying migration `202610050005_validate_inventory`. Migration credentials should be kept separate from limited application credentials in a hardened database deployment. Never reset a database containing customer records.

## Validation

`npm run format:check`, `npm run typecheck`, `npm test`, `npm run test:integration`, `npm audit --audit-level=high`, `npm run build`, `npm run test:e2e`.

Integration and browser tests require an isolated, migrated database. They write validation records. The administrator invitation test reserves `admin@hashnomads.com` temporarily in that isolated database, verifies setup/MFA and removes it afterwards. Do not run that test against a customer database. CI provisions PostgreSQL separately.

Set `PLAYWRIGHT_BASE_URL` to verify a deployed site without starting a local server. For routine production checks, select the read-only public, responsive and accessibility tests. Submission and account tests create records and require intentional cleanup.

## Deployment and accounts

Vercel project `hashnomads` is connected to this GitHub repository. Main-branch pushes trigger production deployments. The Next.js workspace is `apps/web`, with the repository root available for shared packages. Build configuration is versioned in `apps/web/vercel.json`. Apply migrations explicitly before deploying dependent code.

Required server variables: `HASHNOMADS_ENV=production`, `DATABASE_URL`, `BETTER_AUTH_URL=https://hashnomads.vercel.app` and a sensitive `BETTER_AUTH_SECRET`. No secret is exposed to the browser or committed. Database connection variables are provided by the Prisma Postgres marketplace integration. Local files and private setup scripts are excluded from uploads.

Accounts support sign-in, profile name updates, password changes, session revocation, TOTP two-factor authentication and recovery codes. Auth rate limits are database-backed. Public registration cannot select its role. `admin@hashnomads.com` is provisioned separately through a private, expiring, one-use password setup link. Enquiry access, state changes and subscriber exports require administrator role and enabled MFA.

Public enquiry address: `info@hashnomads.com`. Form submissions are saved to the administrator inbox. Email notifications, verification, password recovery and campaign sending need a connected mail provider and verified sender domain. No successful email delivery is claimed by the application.

## Routes

`/`, `/marketplace`, `/marketplace/s21-pro`, `/facilities`, `/calculator`, `/how-it-works`, `/transparency`, `/about`, `/faq`, `/resources`, `/legal`, `/contact`, `/account`, `/account/verify`, `/operations`, `/admin-setup`, `/unsubscribe`, `/api/auth/*`, `/api/v1/*`, `/robots.txt`, `/sitemap.xml`.

The footer updates its copyright year automatically and includes the requested Cactus Digital Media credit.

## Remaining integrations

- Owner-provided checkout, inventory and approved prices.
- Verified mail provider and sender-domain configuration.
- Native onboarding/KYC, orders, physical assignment, telemetry, rewards, wallet destinations and billing integrations.
- Custom domain/DNS, monitoring, database access hardening and recovery validation.

These require actual systems, credentials and agreements. The public site and administrator inbox are not evidence that the entire mining-operation backend is complete.
