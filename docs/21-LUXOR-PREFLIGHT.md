# Luxor preflight — 2026-10-08

## Verified account observations

The owner signed in to Luxor and authorized read-only account inspection. The selected workspace is the default `My Workspace`; the signed-in member has Owner access. Private workspace identifiers and account contact details are not stored in this public repository.

The selected Bitcoin mining view reports no subaccounts, no selected subaccount and an empty worker table. Displayed zero metrics are an empty-account state, not verified fleet telemetry or proof that an operational fleet has zero earnings.

The API Keys page contains an existing `HashNomads` key with Read & Write access and expiry on 28 November 2026. Its value has not been revealed or retrieved. It has not been changed or deleted.

A separate key creation form was prepared for owner review. The owner subsequently created the key; the updated API Keys list confirms its name and expiry:

- Name: `HashNomads-Telemetry-ReadOnly`.
- Custom permissions: Mining Pool Read Only; Derivatives, Hardware, Energy and Commander No Access.
- Expiration: 31 October 2026.
- The owner completed creation. The list labels its permissions `Custom`; the prepared form had Mining Pool Read Only and all other products No Access. Effective scope still requires API verification.
- The success secret is no longer shown on the current page. Its private saved location has been requested; no credential has been read, copied, logged, committed or configured in Vercel.
- The owner did not save the new key but reported copying the existing key. The browser clipboard exposed to automation was empty, so no secret was recovered. A private environment file outside the repository was prepared for owner entry. The preflight performs GET requests only even if supplied with the existing Read & Write key; that key's broader scope is not represented as least-privilege verification.

## Current official API contract

Luxor's [API introduction](https://docs.luxor.tech/platform/api/introduction) documents REST v2 at `https://app.luxor.tech/api/v2/`, with the API key supplied directly in the `Authorization` header. Do not assume an older GraphQL endpoint or add a Bearer prefix without provider evidence.

Keys are workspace-associated. The [workspace documentation](https://docs.luxor.tech/platform/workspaces) supports granular product permissions and optional expiry. Default workspace Read Only grants access across all products; the proposed key instead limits access to Mining Pool.

Both key and workspace token-bucket limits can return HTTP 429. The adapter must distinguish unauthorized/forbidden, rate-limited and unavailable responses; use bounded retries, timeouts, source timestamps and stale-data handling. No provider response should become an operational status just because a credential exists.

## Authenticated backend preflight

On 2026-10-08 the owner saved the existing credential privately outside the repository. Authenticated `GET /api/v2/pool/subaccounts` returned HTTP 200 with zero records, total count zero and no next page. This verifies backend read authentication to the pool resources; it does not verify mining operation or least-privilege write denial.

An initial Bitcoin workers request returned HTTP 400: Luxor requires one or more subaccount names or a site ID. The reference lists these query parameters as optional, but the actual service validates that one is supplied. The checker now derives query names only from verified subaccount records and skips worker reads explicitly when no subaccount exists. Rerun passed its authentication check with `workerReadVerified: false`, `noSubaccountsAvailable: true`, and physical deployment/payout/write-permission verification all false.

The owner subsequently authorized subaccount/setup creation. The actual Add Subaccount form is prepared with `hashnomads`; final creation is handed to the owner under the browser policy for financial-account creation. Luxor describes subaccounts as accounts where mining rewards are credited. No payout destination, worker ID, custody evidence or signed agreement is inferred.

The read-only checker `scripts/luxor-preflight.mjs` uses only the official [subaccounts GET](https://docs.luxor.tech/platform/api/mining-pool/subaccounts/get-subaccounts) and [Bitcoin workers GET](https://docs.luxor.tech/platform/api/mining-pool/reporting/get-workers) contracts. It emits status, timestamp, record counts and pagination presence only; never raw bodies, workspace identifiers or secrets. Redirects are rejected so a credential cannot follow a redirect to another host. A failed request or unexpected response shape remains unverified.

Run with Node.js 24 from the repository root using `node --env-file=../work/.env.luxor scripts/luxor-preflight.mjs`. The private file contains `LUXOR_API_KEY`, not customer wallet material. The checker does not load database credentials or mutate Luxor/HashNomads state. Successful reads do not prove effective write denial, physical deployment or pool payouts.

## Not yet verified

- Effective least-privilege scope enforcement; the existing credential is Read & Write, used for GET requests only.
- HashNomads subaccount/worker identifiers and physical ASIC mapping.
- Per-customer direct payout-address rules, schedule/thresholds and wallet-change approval requirements.
- Actual worker telemetry, reward statements, fees or payout transaction reconciliation.

## Next steps

1. Owner completes the prepared subaccount's final Create step; verify its actual provider record before selecting it for worker reads.
2. Preserve existing keys and private credential storage. For production ingestion, obtain a securely retained Mining Pool read-only credential; do not recreate or revoke keys without specific authorization.
3. Validate actual Bitcoin worker reads and effective least privilege. An empty resource list is a valid account result, not mining integration completion.
4. Confirm subaccount and customer payout architecture before provisioning or changing financial settings. Physical miners, supplier/custody agreements and hosting remain Phase 2.
5. Implement worker mapping/ingestion and reward reconciliation only after actual provider and physical evidence is available. Keep M0 release gates separate from this capability preflight.
