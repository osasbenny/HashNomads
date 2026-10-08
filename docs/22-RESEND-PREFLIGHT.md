# Resend preflight — 2026-10-08

## Observed account state

- Owner signed in to the existing Resend team `osasbenny`.
- The team initially had three domains and blocked another domain behind an upgrade. Creating another team was also a paid feature. No plan upgrade or new team was purchased.
- Owner explicitly requested removal of `aurahire.cactusdigitalmedia.ng` to free a slot for HashNomads. The deletion confirmation was prepared; a subsequent observed domain list showed AuraHire absent without the agent submitting the final delete action.
- The remaining domains are `oat.cactusdigitalmedia.ng` (Verified) and `cactusdigitalmedia.ng` (Not Started). They were preserved. The Add domain form is now available.
- Evidence: workspace `outputs/Resend-domains-after-AuraHire-removal.jpg`.

## Blocking prerequisite

The owner confirmed that `hashnomads.com` has **not yet been registered**. Both the local DNS lookup and Google's public DNS NS query returned NXDOMAIN (public resolver status 3). No HashNomads domain was submitted to Resend, and no DNS records were published.

Domain registration and access to its authoritative DNS are required before a verified HashNomads sender can be established. The public enquiry address `info@hashnomads.com` is an owner-specified intended address; this preflight does not establish a working mailbox or email delivery.

## Next setup sequence

1. Owner registers `hashnomads.com` and provides access to its DNS provider. Registration is a separate purchase; no purchase was authorized or made in this preflight.
2. Confirm the transactional sending address and reply-to address. Add the owned domain to Resend and capture the exact provider-generated authentication records.
3. Publish and verify the required SPF/DKIM records while preserving existing mailbox/MX configuration. Resend sender verification does not provision an inbound mailbox.
4. Create a sending-only key restricted to the HashNomads domain; store the secret privately and configure server-side environment variables. No Resend key was created or stored during this preflight.
5. Implement verification/recovery/notification delivery and error handling against the existing account system. Confirm an authorized test recipient and verify actual delivery before requiring email verification for account access.

## Scope and evidence limits

This is provider setup discovery, not completed email integration. No email was sent, no production environment variable changed, no account verification requirement enabled and no repository integration removed. Existing GitHub/Vercel configuration remains intact. The one external domain removal above was expressly requested by the owner.

Provider references: [domain verification](https://resend.com/docs/dashboard/domains/introduction) and [API key permissions](https://resend.com/docs/dashboard/api-keys/introduction).
