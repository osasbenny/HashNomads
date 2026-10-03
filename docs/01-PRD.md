# HashNomads V1 — Product Requirements Document

## 1. Product statement
HashNomads is an ownership-first Bitcoin mining infrastructure platform. Customers purchase identifiable ASIC miners, select approved hosting capacity, monitor deployment and mining performance, and direct pool rewards to customer-controlled Bitcoin wallets.

## 2. V1 objective
Prove the complete digital operating system in sandbox mode before negotiating/activating physical hosting capacity.

## 3. Personas
- **Prospect:** evaluating mining hardware and economics.
- **Customer:** owns/orders hosted ASIC equipment.
- **Operations:** manages inventory, deployments, facilities, incidents and integrations.
- **Finance/Compliance:** reviews KYC status, invoices, reconciliation and audit evidence.
- **Support:** resolves customer cases without broad infrastructure privileges.
- **Administrator:** configures integrations, roles and environment controls.

## 4. Jobs to be done
A prospect must understand what is being purchased, the assumptions behind estimates, fees, risks and how ownership/hosting works. A customer must be able to prove what they ordered, see deployment state, identify their assigned machine, monitor source-backed performance, understand earnings and invoices, and maintain a valid payout destination. Operations must be able to trace every customer-facing status to an internal record/provider event.

## 5. V1 functional requirements
### Public experience
- Marketing homepage with clear value proposition and risk disclosure.
- ASIC catalogue with model, manufacturer, hashrate, nominal power, efficiency, price placeholder/quote state, availability state and hosting compatibility.
- ASIC detail with specifications, assumptions and estimated economics.
- Facility catalogue in sandbox with geography-level information, energy/hosting assumptions, status and supported hardware.
- Scenario calculator with BTC price, network/hashprice assumption, hashrate, power, hosting/electricity, pool/platform fees, uptime and time horizon.
- Calculator must label estimates and show assumptions; no guaranteed ROI language.

### Identity/onboarding
- Email/password or secure passwordless/social option depending auth provider.
- Email verification, password recovery where applicable, session management.
- Customer profile and jurisdiction fields.
- KYC provider abstraction with sandbox states: not_started, pending, approved, rejected, needs_review.
- Terms/privacy/risk acknowledgement version tracking.

### Orders
- Cart/quote for one or more supported ASIC SKUs.
- Hosting/facility selection when compatible.
- Price breakdown: hardware, setup, shipping/import placeholder if applicable, hosting deposit/first period, taxes where known, discounts, total.
- Payment provider abstraction and sandbox checkout.
- Idempotent payment webhook processing.
- Order lifecycle: draft → pending_payment → paid → procurement → assigned → deployment_pending → active; cancellation/refund/exception branches explicitly controlled.

### Ownership & deployment
- Miner record links manufacturer/model and immutable hardware identity when a real serial exists.
- Sandbox serials carry `SIM-` prefix and prominent sandbox badge.
- Ownership assignment records effective date and source order.
- Deployment links miner, facility, rack/location abstraction, pool worker identity and status.
- Deployment timeline visible to customer.

### Mining/telemetry
- Provider-neutral pool adapter.
- Worker hashrate, accepted/rejected share metrics when provider supports them, uptime/last seen, temperature/power only when sourced from miner/facility telemetry.
- Time-series data stored with source and observed timestamp.
- Stale-data state instead of pretending values are current.

### Earnings/wallets
- Customer can register Bitcoin payout destinations with validation and confirmation controls.
- Rewards ledger records source pool, period, BTC/sats, fees if known, transaction/payment reference when available.
- Distinguish estimated, accrued/reported and paid states.
- Never display simulated rewards without sandbox labeling.

### Hosting billing
- Hosting agreement/reference, tariff basis, billing period, metered/estimated consumption source, line items, invoice state, payment state.
- Reconciliation view for operations.

### Customer portal
Dashboard summarizes miners, aggregate hashrate, online/offline/stale status, reward figures, outstanding invoices, incidents and recent activity. Drilldowns must preserve source timestamps and status provenance.

### Admin/operations
- RBAC-protected customer/KYC management.
- Orders and exception queue.
- ASIC inventory/ownership registry.
- Facilities and capacity placeholders.
- Deployment workflow.
- Fleet health and stale/offline alerts.
- Billing/reconciliation.
- Integration health.
- Incident/support management.
- Immutable audit event viewer.

## 6. Non-functional requirements
- Responsive from 360px mobile through desktop operations screens.
- WCAG 2.2 AA target for core flows.
- Reduced-motion support.
- Core public pages target good Core Web Vitals under realistic conditions.
- API authorization enforced server-side.
- Financial and BTC precision tests.
- UTC storage; localized display.
- Provider outages degrade gracefully.
- Structured observability and health checks.

## 7. Out of scope for initial V1 production activation
- HashNomads custody/exchange of customer BTC.
- Guaranteed yield/return products.
- Tokenization of miners or mining revenue.
- Secondary trading of miner ownership.
- Automated lending/financing.
- Owning/operating a HashNomads data center.
- Unreviewed cross-border production sales.

## 8. Success criteria for Phase 1
- Golden-path E2E passes in sandbox.
- Critical failure paths pass.
- No critical/high authorization defect open.
- All simulated states visibly identified.
- Operations can reconcile an order → miner → deployment → telemetry → reward → invoice chain.
- V1 evidence report produced.
- Phase 2 readiness gate reviewed.
