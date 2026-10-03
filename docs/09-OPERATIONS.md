# HashNomads V1 — Operations Model

## Operating principle
Every customer-visible status must have an accountable source, timestamp and operator path. HashNomads should be able to answer: who owns this miner, where is it, what state is it in, what source says it is mining, what was reported as earned, and what is owed for hosting?

## Operational queues
- KYC review/exceptions
- Payment/order exceptions
- Procurement/assignment
- Deployment pending
- Offline/stale miners
- Facility incidents
- Reward reconciliation exceptions
- Hosting invoice exceptions/overdue
- Wallet-change review
- Support cases
- Integration failures/dead-letter jobs

## Miner lifecycle
`inventory → reserved → assigned → deployment_pending → installing → active → degraded → offline → maintenance → active → decommission_pending → decommissioned`

Transitions require role permission and audit. Some transitions may be provider-driven but still produce internal events.

## Deployment evidence
Production deployment should ultimately capture physical serial, facility reference, installation timestamp, worker identity and operator/provider confirmation. Optional evidence such as rack/location or photo must follow facility security policy.

## Telemetry states
- **Online:** fresh source data within configured threshold.
- **Degraded:** mining but materially outside expected range.
- **Offline:** authoritative source reports no work or threshold exceeded.
- **Stale:** source has not refreshed; do not equate stale with confirmed offline.
- **Maintenance:** explicitly scheduled/recorded.

## Incident severity
- SEV1: broad outage/security/financial integrity event.
- SEV2: material facility/integration outage affecting customers.
- SEV3: isolated miner/deployment issue.
- SEV4: minor operational defect/inquiry.

Customer-visible incident communication must distinguish known facts from estimates.

## Reconciliation
Scheduled reconciliation compares:
- orders vs payments;
- paid lines vs ownership assignments;
- active deployments vs worker records;
- pool reward/payment records vs internal reward ledger;
- hosting tariff/usage basis vs invoices.
Exceptions enter an operations queue rather than being silently corrected.

## Sandbox operations
Seed deterministic customers, miners, facilities, orders and telemetry scenarios including healthy, degraded, offline, stale, maintenance, KYC rejected, payment failed and invoice overdue. All carry sandbox markers.

## Production readiness artifacts
Runbooks for provider outage, facility outage, miner repair, miner retrieval, customer wallet change, payment dispute, data/security incident, integration credential rotation and customer communications are required before live activation.
