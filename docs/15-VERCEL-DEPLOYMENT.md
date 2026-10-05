# Vercel deployment — 2026-10-05

Public URL: https://hashnomads.vercel.app

Project: `hashnomads`, team `osasbennys-projects`. GitHub repository connected; pushes to `main` deploy the production target. Root directory is `apps/web`, with source files outside the root enabled. Node.js 24 is configured. Workspace installation and Prisma generation run from the repository root before the Next.js build. Deployment settings are versioned in `apps/web/vercel.json`.

## Hosted database and environment

Prisma Postgres resource `hashnomads-db` uses the free marketplace plan in `iad1`. Both existing migrations were applied successfully to this new hosted database. No simulated hardware inventory or facility seed was imported. Accounts and sessions use the hosted database.

Production environment variables configured:

- `DATABASE_URL`, `POSTGRES_URL`, `PRISMA_DATABASE_URL` — provided by the database integration.
- `BETTER_AUTH_URL` — `https://hashnomads.vercel.app`.
- `BETTER_AUTH_SECRET` — independently generated, sensitive server-side value.
- `SANDBOX_WEBHOOK_SECRET` — independently generated, sensitive server-side value.
- `HASHNOMADS_ENV` — `sandbox`, the currently supported application environment.

Credentials are held in Vercel, never committed. Production secrets pulled locally are masked by Vercel. The temporary database migration environment file is outside the repository. `.vercelignore` excludes local environment files and build/test artifacts from CLI uploads.

Vercel's production hosting target does not activate payments or mining. The current application still exposes contextual development disclosures and reference data, and lacks the complete transactional customer lifecycle, email verification, recovery and MFA. Domain mapping for `HashNomads.com` has not been configured.

## Verification

- Vercel production deployment reached `READY`; remote install, Prisma generation, TypeScript and Next.js build passed.
- Public homepage HTTP 200; database health HTTP 200; unauthenticated session endpoint HTTP 200 with no session.
- All 13 existing browser/accessibility tests passed against the public HTTPS deployment: hardware/calculator journey, five responsive widths across seven routes, mobile navigation, reduced motion, signup, refresh persistence, logout and five accessibility scans.
- All three homepage pitch-deck images decoded successfully. A production screenshot was saved outside the repository.
- Formatting passed. A synthetic `example.com` account was created by browser validation; no actual customer information was used.

To repeat browser validation in PowerShell:

```powershell
$env:PLAYWRIGHT_BASE_URL = 'https://hashnomads.vercel.app'
npm run test:e2e
Remove-Item Env:PLAYWRIGHT_BASE_URL
```

Omitting `PLAYWRIGHT_BASE_URL` preserves the local server workflow. Account validation writes synthetic test users; use a staging deployment for routine ongoing tests. The database integration is currently connected to Production only. Preview accounts require a separate staging database and preview auth environment variables.

Changing the public account domain also requires updating `BETTER_AUTH_URL` and redeploying. Future database migrations must be applied explicitly before deploying code that depends on them; they are intentionally not run by the build command.
