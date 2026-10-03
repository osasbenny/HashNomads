# HashNomads — Security & Compliance Baseline

> Engineering requirements, not legal advice. Production jurisdictions, crypto-payment rails and commercial terms require qualified legal/tax/compliance review.

## Security objectives
Protect account access, ownership records, payout-destination integrity, crypto payment/settlement records, customer information, financial records and infrastructure controls.

## Identity/access
MFA-ready architecture; step-up auth for sensitive production actions; secure session rotation/revocation; least-privilege RBAC; tested tenant isolation; any support/admin impersonation requires banner, reason and audit.

## Wallet/self-custody security
- **HashNomads manages miners; customers control Bitcoin.**
- Validate Bitcoin address/network format.
- Never request, accept, transmit, store, log or analytics-capture customer seed phrases, mnemonics or private keys.
- Wallet destination changes require step-up authentication, customer notification and audit.
- Consider cooling-off/manual risk review before high-risk payout changes.
- Store public addresses/metadata only in V1.
- Do not expose a UI field that could reasonably encourage a user to paste a seed phrase/private key.
- A future self-custody HashNomads wallet requires client/device-only key generation/storage, CSP/third-party-script threat review, secure recovery UX, independent security assessment and ADR approval before implementation.
- Custodial wallets/exchange balances remain out of scope absent separate regulatory/security program.

## Crypto payment security
- Use a specialist payment provider via adapter; proposed first adapter is BitPay subject to approval.
- Provider credentials are server-side secrets only.
- Verify webhook signatures/timestamps exactly per provider contract using raw body when required.
- Defend against webhook replay/duplicates with unique event IDs and idempotency.
- Never trust checkout/browser redirect for payment confirmation.
- Validate invoice/order binding, accounting amount/currency, payment asset/network and provider reference.
- Record rate-lock timestamp/expiry and never silently recalculate historical paid invoices.
- Reconcile provider transaction/settlement state independently of webhook delivery.
- Refunds/manual settlement adjustments require privileged permission, reason and audit trail.
- Business settlement wallet credentials/private keys must not live in application DB/repository; use provider-managed destination configuration or secure institutional wallet process.

## Application security
TLS, CSP/secure headers, schema validation, parameterized DB access, CSRF where relevant, rate limiting/bot controls, secrets management, dependency/secret scanning, no production secrets in client/repository, log redaction and least-privilege integration credentials.

## Data/privacy
Data minimization; specialist KYC custody where possible; retention/deletion policy; encryption at rest where appropriate; privileged data-view logging; redact PII/secrets/provider payloads.

## Financial integrity
Fixed-point/atomic-unit arithmetic; immutable order/rate snapshots; append/adjust ledgers; payment/settlement and reward ledgers remain distinct; reconciliation compares provider payments/settlements/rewards/invoices to internal records.

## Compliance gates before live sales
Legal review per target jurisdiction must determine corporate entity, KYC/AML/sanctions obligations, crypto merchant/payment obligations, consumer/refund/disclosure rules, tax/VAT/sales tax, hardware ownership/custody/bailment, hosting terms, cross-border import/export, marketing/earnings claims, and whether any structure could constitute securities/investment contracts, money transmission/custody, virtual-asset services or other regulated financial activity.

## Product restrictions
V1 must not implement tokenized ownership, pooled guaranteed returns, lending, customer BTC custody, exchange functionality, server-held wallet keys or fixed-yield representations without separate approved legal/product/security review.

## Incident readiness
Severity levels and procedures for credential compromise, wallet-change fraud, crypto-payment discrepancy, webhook/provider outage, settlement mismatch, data incident and customer communication/evidence preservation.

## Production security gate
Threat model reviewed; authz tests green; dependency/secret scans green; critical/high findings closed; backups/restore tested; audit logs verified; production secrets separated; crypto payment webhooks and reconciliation tested; wallet-change controls exercised; incident runbook exercised.
