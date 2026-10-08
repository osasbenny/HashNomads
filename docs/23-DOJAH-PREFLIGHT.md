# Dojah preflight — 2026-10-08

## Verified provider setup

- Owner signed in and expressly confirmed Jcobiq Energy Solutions LTD is the approved business account for HashNomads. Owner requested preservation of all existing apps.
- Live environment is accessible and the configuration page presents production credentials. This observation does not independently establish the provider's approved use-case or contractual coverage.
- Created a separate live app named **HashNomads**, app ID `6ac79c77e1b7be6e6117ae7a`. Saved the existing HashNomads gold brand color `#F7B32B`; the persisted workflow builder confirms that color.
- Saved **HashNomads Global KYC** as an unpublished draft, flow ID `6ac79d15e1b7be6e6117b163`. Provider displayed “Widget saved successfully” and its persisted edit page.
- Draft steps: User Data, Government Issued ID, Liveness. Estimated cost displayed by the builder: ₦130 per verification; this is a provider estimate for the selected draft, not a guaranteed final price or a charge incurred.
- Owner requested global customer coverage. Draft country setting is “All countries allowed”; actual document coverage, exclusions and applicable business eligibility still require validation before publication.
- Draft uses manual review and restricted launch origin `hashnomads.vercel.app`. Saved edit-page settings confirm both. User/business notifications are not configured. No customer has been submitted for verification.
- Existing three apps, three published workflows and three webhook subscriptions were inspected without edits. No existing key was regenerated or revealed. No existing webhook secret was accessed.
- API Tokens initially lists no tokens. Prepared creation form for `HashNomads-KYC-Server` with only the HashNomads app selected; no final creation submitted. The form exposes app selection but no granular permissions or expiry controls. Effective isolation and compatibility with the required KYC endpoints remain to be verified after creation. Browser credential-creation policy requires confirmation at the final action.
- Owner subsequently confirmed credential creation. Created `HashNomads-KYC-Server` with HashNomads selected; the token list now contains one masked token. No shared production key was rotated. Dojah requires the owner to enter the account password to reveal the token, so its value has not been retrieved and API authentication remains unverified. A private environment file outside the repository was prepared without a secret value. Evidence: `outputs/Dojah-HashNomads-token-created.jpg`.

Evidence in workspace outputs: `Dojah-HashNomads-app-created.jpg`, `Dojah-HashNomads-draft-settings.jpg`, `Dojah-live-existing-workflows.jpg`, and `Dojah-HashNomads-token-proposal.jpg`. These are local evidence, not committed credentials or customer identity data.

## Integration contract checked

Official documentation requires a server-side secret in the raw `Authorization` header and an `AppId` header; no Bearer prefix. Public widget configuration uses the public key and flow identifier. The dashboard currently presents production keys above the app list, so credential isolation must be confirmed before using a shared account credential in HashNomads.

The authoritative outcome comes from the backend callback for service `kyc_widget`, not the widget's browser success callback. A server-created, persisted `reference_id` ties the event to the correct customer. The documented raw-body signature is HMAC SHA256 with constant-time verification using `x-dojah-signature`. The separate v2 header hashes only the secret, not the payload; it must not substitute for payload integrity without an explicitly verified provider contract. Confirm the HashNomads subscription's signing secret before implementing callback validation.

References: [authentication](https://docs.dojah.io/api-reference/get-started/authentication), [webhooks and signatures](https://docs.dojah.io/api-reference/core-concepts/webhooks-signatures), [flow results](https://docs.dojah.io/api-reference/hosted-flows-easyonboard/flow-results-webhooks).

## Remaining acceptance work

1. Confirm provider-supported global documents/countries and the approved HashNomads use-case. Approve review procedures, AML/sanctions configuration, thresholds and retention before publishing the flow.
2. Obtain a suitably restricted credential without rotating shared keys or affecting other apps. Store it outside Git and configure only server-side environments.
3. Implement the server adapter, durable tenant-scoped sessions, authenticated callback handling, duplicate/replay handling and status transitions in the existing application.
4. Deploy and verify the callback endpoint before subscribing this app. Existing apps' endpoints must not be reused.
5. Verify negative cases and an owner-authorized real verification, including billing authorization and customer consent. Then approve flow publication and production eligibility enforcement.

The provider draft is saved; website KYC is not enabled, callback subscription is not created and API authentication/delivery has not been verified. No production application environment variable or database was changed.

## Next provider handoff

Opened the official Crisp signup page for the owner while Dojah credential retrieval awaits password entry. Crisp account creation requires a password and acceptance of its terms/privacy policy. No Crisp account, subscription, website configuration or customer data transmission has been completed. HashNomads email addresses cannot yet receive signup verification because the domain remains unregistered; the owner must select an accessible account email.
