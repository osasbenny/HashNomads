# HashNomads — Security & Compliance Baseline

> Engineering requirements, not legal advice. Production jurisdictions and commercial terms require qualified legal/tax/compliance review.

## Security objectives
Protect account access, ownership records, payout-destination integrity, customer information, financial records and infrastructure controls.

## Identity/access
- MFA-ready architecture; require step-up auth for sensitive actions in production.
- Secure cookies/session rotation and revocation.
- RBAC with least privilege.
- Customer tenant isolation tested server-side.
- Admin/support impersonation, if ever added, requires explicit banner, reason and audit trail.

## Wallet security
- Validate Bitcoin address/network format.
- Never request customer seed phrases/private keys.
- Wallet destination changes require step-up authentication and notification.
- Consider cooling-off/manual review for high-risk production wallet changes.
- Store addresses, not private keys.

## Application security
- TLS everywhere.
- Secure headers/CSP.
- Input/schema validation.
- Parameterized DB access.
- CSRF protection where relevant.
- Rate limiting and bot/abuse controls.
- Signed webhook verification and replay defense.
- Secrets via managed environment/secret store only.
- Dependency and secret scanning in CI.
- No production secrets in client bundles or repository.

## Data/privacy
- Data minimization.
- KYC documents remain with specialist provider where possible.
- Define retention/deletion policy before production.
- Encrypt sensitive data at rest where appropriate.
- Redact PII/secrets from logs and audit metadata.
- Define access logging for privileged customer-data views.

## Financial integrity
- Fixed-point monetary arithmetic.
- Immutable order price snapshots.
- Append/adjust ledgers instead of silent historical edits.
- Reconciliation jobs compare provider payments/rewards/invoices with internal records.

## Compliance gates before live sales
Legal review must determine, per target jurisdiction:
- corporate/contracting entity;
- KYC/AML obligations;
- sanctions screening obligations;
- consumer protection/refund/disclosure rules;
- tax/VAT/sales-tax treatment;
- hardware ownership/custody/bailment terms;
- hosting/service agreement terms;
- cross-border hardware/import/export implications;
- marketing/earnings-claim restrictions;
- whether any proposed structure could constitute a security, investment contract, money transmission/custody or another regulated financial activity.

## Product restrictions
V1 must not implement tokenized ownership, pooled guaranteed returns, lending, customer BTC custody, exchange functionality, or representations of fixed yield without a separate approved legal/product review.

## Incident readiness
Define severity levels, on-call contact path, credential compromise procedure, wallet-change fraud response, provider outage procedure, data incident procedure, customer communication templates and evidence preservation.

## Production security gate
Before Phase 2/live activation: threat model reviewed, authz test suite green, dependency/secret scans green, critical/high findings closed, backups/restore tested, audit logs verified, production secrets separated, provider webhooks verified, incident runbook exercised.
