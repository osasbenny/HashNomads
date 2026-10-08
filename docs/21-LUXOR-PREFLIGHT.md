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

## Current official API contract

Luxor's [API introduction](https://docs.luxor.tech/platform/api/introduction) documents REST v2 at `https://app.luxor.tech/api/v2/`, with the API key supplied directly in the `Authorization` header. Do not assume an older GraphQL endpoint or add a Bearer prefix without provider evidence.

Keys are workspace-associated. The [workspace documentation](https://docs.luxor.tech/platform/workspaces) supports granular product permissions and optional expiry. Default workspace Read Only grants access across all products; the proposed key instead limits access to Mining Pool.

Both key and workspace token-bucket limits can return HTTP 429. The adapter must distinguish unauthorized/forbidden, rate-limited and unavailable responses; use bounded retries, timeouts, source timestamps and stale-data handling. No provider response should become an operational status just because a credential exists.

## Not yet verified

- Actual authenticated backend REST request and least-privilege scope enforcement.
- HashNomads subaccount/worker identifiers and physical ASIC mapping.
- Per-customer direct payout-address rules, schedule/thresholds and wallet-change approval requirements.
- Actual worker telemetry, reward statements, fees or payout transaction reconciliation.

## Next steps

1. Preserve both existing keys; obtain the newly created secret from the owner's private saved file or explicitly authorized clipboard. Do not recreate or revoke a key merely because its value is absent from the list.
2. Save the credential outside version control and logs. Read-only backend preflight must use the official endpoint contract; record only redacted results.
3. Validate accessible workspace/mining resources and denial of unrelated products. An empty resource list is a valid account result, not mining integration completion.
4. Confirm subaccount and customer payout architecture before provisioning or changing financial settings. Physical miners, supplier/custody agreements and hosting remain Phase 2.
5. Implement worker mapping/ingestion and reward reconciliation only after actual provider and physical evidence is available. Keep M0 release gates separate from this capability preflight.
