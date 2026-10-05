# Commercial site release — 2026-10-05

## Owner direction

The owner requested a customer-facing production site with no artificial data or development language, using Sazmining as the design/content reference and confirmed common ownership. The owner will provide HashNomads checkout information. Public enquiries use `info@hashnomads.com`; the administrator account is `admin@hashnomads.com`. These instructions supersede the original environment restrictions in the initial brief.

## Implemented

- Expanded homepage: commercial offer, ownership/service benefits, hardware, purchase journey, sourced locations, advisor, economics, trust/risk, FAQ, newsletter and closing action. Warm editorial panels vary the dark/gold HashNomads visual system. Desktop and mobile screenshots are stored outside the repository.
- Removed development labels throughout customer-facing pages and runtime configuration. Manufacturer facts remain; the invented $4,800 price is removed. Pricing is requested through the real enquiry flow. The calculator preloads hardware specifications only; users supply their own monetary and performance assumptions.
- Replaced invented Texas/Canada facilities with the published Sazmining directory: Texas, Paraguay, Norway and South Dakota. Tariffs and status are explicitly attributed and dated; they are not asserted as a confirmed HashNomads contract.
- New sourced education links, real review link and advisor booking route. Customer quotes, reviews, media endorsements, numeric earnings and inventory are not fabricated or reassigned to the HashNomads brand.
- Enquiry persistence with consent, validation, honeypot, origin checks, payload bounds and database rate limiting. No form response claims email delivery.
- Newsletter opt-in persistence, repeat-subscription handling and signed explicit unsubscribe. Subscriber export requires administrator authorization. Subscription registration does not send a verification or marketing email without a provider.
- Accounts: profile name, password changes, revocation of other sessions, database-backed rate limiting, TOTP MFA and recovery codes.
- Administrator inbox: authenticated role enforcement, MFA requirement, newest 100 enquiries, new/handled states and subscriber CSV export. CSV cells are escaped against formula injection.
- Admin bootstrap: reserved account, random inaccessible initial password, hashed one-use invitation with 24-hour expiry, private setup instructions outside the repository. Activation atomically consumes the invitation and updates the credential. Passwords and invitation tokens are not logged.
- SEO metadata, robots and sitemap. Account/operations/setup routes are excluded from indexing. Existing browser and security headers remain.

## Data and migration changes

Migrations 003–005 add enquiry/subscription/rate-limit persistence, account MFA persistence and auth rate limits. Environment values now describe production records. Hardware prices can be absent rather than invented. Physical inventory identities are enforced and the constraint is validated.

Production never contained generated equipment or invented facilities. The one legacy browser-validation account was removed using a precise synthetic email/name predicate. The old local reference inventory/facilities were removed only when unused. Sourced specification/facility seeding produces no inventory, hosting prices or customer records. Financial payment generators were moved into isolated test fixtures and are not exported by application integrations.

## Source registry

Checked 5 October 2026:

- https://www.sazmining.com/ — page structure and broad service journey.
- https://www.sazmining.com/datacenters — locations, published tariffs/status and Texas/South Dakota photos. Remote images are restricted to its `/images/` path.
- https://www.sazmining.com/free-consultation — advisor booking route, explicitly identified as Sazmining.
- https://www.sazmining.com/learn and https://www.sazmining.com/blog — education links.
- https://www.trustpilot.com/review/sazmining.com — review destination; no reviews are relabelled.
- Manufacturer specification link in `packages/domain/src/index.ts` — S21 Pro nominal hardware facts.
- Owner-supplied deck — infrastructure and generic ASIC close-up images, with existing provenance in `public/images/README.md`.

## Verification and limits

Local production build, type checks, formatting and audit passed (zero reported vulnerabilities). All 16 unit checks, 5 database integration checks and 22 browser checks passed. Browser coverage includes public language/price checks, real form persistence, consent/origin rejection, subscription/unsubscribe, admin invitation replay rejection, MFA enforcement, enquiry status updates, subscriber access, profile/password/MFA login, image-loaded responsive layouts at five widths and eight WCAG-tagged accessibility scans. Desktop and mobile screenshots confirm no overflow after image decoding.

Native checkout is intentionally awaiting the owner's information. Email notifications, verification/recovery and campaign delivery require a provider with verified sender-domain credentials. Native KYC/order/fleet/telemetry/reward/billing workflows remain separate integrations; no charts or customer records are generated to stand in for them. HashNomads.com DNS, backup/restore validation and full operational acceptance remain outstanding. This release does not claim those systems are complete.

Production provisioning includes five applied migrations, the separately provisioned administrator and sourced catalogue/facility records. Subsequent deployment verification and evidence are recorded at the next savepoint.
