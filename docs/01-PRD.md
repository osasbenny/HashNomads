# HashNomads V1 — Product Requirements Document

## 1. Product statement
HashNomads is an ownership-first Bitcoin mining infrastructure platform. Customers purchase identifiable ASIC miners, select approved hosting capacity, pay through supported crypto rails, monitor deployment/mining performance, and direct pool rewards to customer-controlled Bitcoin wallets.

## 2. V1 objective
Prove the complete digital operating system in sandbox mode before negotiating/activating physical hosting capacity.

## 3. Personas
- **Prospect:** evaluating mining hardware and economics.
- **Customer:** owns/orders hosted ASIC equipment and controls payout destinations.
- **Operations:** manages inventory, deployments, facilities, incidents and integrations.
- **Finance/Compliance:** reviews KYC, crypto payments, settlements, invoices, reconciliation and audit evidence.
- **Support:** resolves cases without broad infrastructure privileges.
- **Administrator:** configures integrations, roles and environment controls.

## 4. Product principle
**HashNomads manages miners; customers control Bitcoin.** Mining rewards should flow directly from the mining pool to a customer-controlled payout wallet whenever supported. HashNomads must not require a seed phrase/private key and does not provide custodial BTC balances in V1.

## 5. Jobs to be done
A prospect must understand what is purchased, assumptions, fees, risks and ownership/hosting. A customer must prove what they ordered, pay securely, identify their assigned machine, monitor source-backed performance, understand earnings/invoices and maintain a valid payout destination. Operations must trace every customer-facing status to an internal/provider event.

## 6. V1 functional requirements
### Public experience
Marketing homepage; ASIC catalogue/detail; sandbox facility catalogue; scenario calculator with BTC/network/hashprice/hashrate/power/hosting/pool/platform assumptions; transparent risk/estimate labeling.

### Identity/onboarding
Secure account creation, verification/recovery/session management, customer/jurisdiction profile, provider-neutral KYC sandbox states, and versioned terms/privacy/risk acknowledgements.

### Orders and crypto payments
- Cart/quote for supported ASIC SKUs and compatible facility.
- Breakdown: hardware, setup, shipping/import placeholder, hosting deposit/first period, taxes where known, discounts, total.
- Provider-neutral crypto checkout abstraction.
- Proposed initial production adapter: **BitPay**, subject to approval/compliance; never hard-code business logic to it.
- Sandbox payment assets: BTC, Bitcoin Lightning, USDC and USDT; actual production asset/network availability comes from provider configuration.
- Store accounting/quote currency separately from payment asset/network.
- Quote/invoice stores locked exchange rate, source/provider and expiry.
- Signed/idempotent webhook processing is authoritative for payment state; browser redirect is not.
- Payment lifecycle distinguishes created/pending/paid/confirmed/expired/failed/refunded/exception states as supported.
- Settlement lifecycle and reconciliation are visible to finance/operations.
- Order lifecycle: draft → pending_payment → paid → procurement → assigned → deployment_pending → active, with controlled exception/refund branches.

### Recurring hosting/service payments
Each billing period can generate a crypto-payable invoice containing miner reference, tariff/usage basis, hosting/service/maintenance line items, accounting-currency total and provider checkout details. Payment and settlement reconcile to the hosting invoice without changing historical tariff snapshots.

### Ownership & deployment
Physical identity/serial handling, explicit simulated `SIM-` identities, ownership assignment, deployment/facility/worker linkage and customer-visible deployment timeline.

### Mining/telemetry
Provider-neutral pool adapter; source-backed hashrate/shares/uptime and direct telemetry when available; observed timestamps and stale-data states.

### Earnings and payout wallets
- Customer can register one or more **customer-controlled Bitcoin payout destinations**.
- Network-aware address validation and confirmation controls.
- Sensitive payout-destination changes require re-auth/step-up verification and immutable audit events.
- Active payout destination is explicit; pool-side configuration may require separate provider approval.
- Rewards ledger records pool, period, sats/BTC, known fees and transaction/payment references.
- Estimated, reported/accrued and paid states are distinct.
- HashNomads never asks for or stores seed phrases/private keys.
- V1 does **not** maintain custodial customer BTC balances.

### Future self-custody wallet (V1.5+ candidate, not V1 requirement)
HashNomads may later offer a branded self-custody wallet onboarding path. Any implementation must generate/retain keys and recovery material client/device-side only, prevent recovery material from reaching HashNomads servers/logs/analytics, pass a dedicated security review and be approved by ADR. It must remain distinguishable from a custodial wallet/account.

### Hosting billing
Hosting agreement/reference, tariff basis, billing period, metered/estimated source, line items, invoice/payment/settlement state and operations reconciliation.

### Customer portal
Overview, miners, telemetry, earnings, orders, **payments**, payout wallets, hosting/billing, documents, notifications, support, security/profile. Dashboard preserves source/freshness provenance.

### Admin/operations
RBAC customer/KYC management; orders/exceptions; **crypto payments and settlement reconciliation**; ASIC registry; facilities; deployments; fleet health; pool integrations; billing; incidents/support; integration health; immutable audit viewer.

## 7. Non-functional requirements
Responsive 360px+; WCAG 2.2 AA target; reduced motion; good public Core Web Vitals; server authorization; financial/BTC precision; UTC storage/localized display; graceful provider outages; structured observability/health checks.

## 8. Out of scope for initial V1 production activation
- HashNomads custody/exchange of customer BTC.
- Server-side generation/storage of customer private keys or seed phrases.
- Guaranteed yield/return products.
- Tokenization/secondary trading of miners or revenue.
- Automated lending/financing.
- Owning/operating a HashNomads data center.
- Unreviewed cross-border production sales.

## 9. Success criteria for Phase 1
Golden-path E2E passes including crypto payment and payout-wallet flows; critical failure paths pass; no critical/high authorization defect; all simulated states marked; operations can reconcile order → payment → settlement → miner → deployment → telemetry → reward → hosting invoice/payment; V1 evidence report produced; Phase 2 gate reviewed.
