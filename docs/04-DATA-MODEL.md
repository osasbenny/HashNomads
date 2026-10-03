# HashNomads V1 — Data Model

## Core entities

### Identity / customer / KYC
`User(id, email, status, emailVerifiedAt, createdAt)`; roles/permissions; `Customer(id, userId, type, legalName, country, status, createdAt)`; `KycCase(...)`; `ConsentRecord(...)`. Do not duplicate unnecessary identity documents.

### ASIC / facility / hosting
`AsicModel(id, manufacturer, model, algorithm, nominalHashrateTHs, nominalPowerW, efficiencyJTH, status)`
`AsicUnit(id, asicModelId, serialNumber, serialKind, inventoryStatus, environment)`
`Facility(id, name, country, region, status, environment)`
`HostingPlan(id, facilityId, name, tariffType, rate, currency, setupFee, billingCadence, effectiveFrom, effectiveTo)`

### Order / OrderLine
Order stores customer, accounting currency, totals and lifecycle. Lines snapshot SKU/pricing terms so catalogue changes never rewrite history.

### PaymentIntent / CryptoInvoice
`PaymentIntent(id, orderId?, invoiceId?, customerId, provider, providerInvoiceRef, accountingCurrency, accountingAmountMinor, paymentAsset, paymentNetwork, requestedCryptoAmountAtomic?, rate, rateSource, rateLockedAt, rateExpiresAt, status, idempotencyKey, environment, createdAt)`

A payment intent must reference exactly one payable business object (order or hosting/service invoice) according to domain rules. Production provider availability is configuration-driven.

### PaymentTransaction
`PaymentTransaction(id, paymentIntentId, providerTxRef, blockchainTxHash?, asset, network, amountAtomic, confirmations?, status, observedAt)`
Provider/network metadata is evidence; never infer final payment solely from a client redirect.

### Settlement
`Settlement(id, paymentIntentId, providerSettlementRef, settlementAsset, settlementNetwork?, grossAmountAtomic, feeAmountAtomic?, netAmountAtomic, status, expectedAt?, settledAt?, destinationRefRedacted, reconciliationStatus)`
Settlement destination secrets/private keys are never stored here.

### Refund / PaymentAdjustment
Append-only references for refund/underpayment/overpayment/manual reconciliation adjustments; original payment history remains intact.

### OwnershipAssignment / Deployment
One active owner and one active deployment per ASIC. Deployment links ASIC, facility, hosting plan, worker identity and lifecycle.

### TelemetrySample
`TelemetrySample(id, deploymentId, metric, valueDecimal, unit, sourceProvider, sourceRef, observedAt, ingestedAt)`

### WalletDestination
`WalletDestination(id, customerId, asset, network, address, label, purpose, status, verificationMethod, verifiedAt, activatedAt, deactivatedAt, createdAt)`
Purpose includes `mining_payout`. Store public addresses only. Wallet changes require step-up authentication/reconfirmation and audit.

### WalletChangeRequest
`WalletChangeRequest(id, customerId, walletDestinationId?, proposedAddress, network, status, requestedAt, verifiedAt, activatedAt, riskReviewRef?)`
Supports cooling-off/manual review without destructive edits.

### RewardEntry
`RewardEntry(id, customerId, deploymentId, poolProvider, periodStart, periodEnd, amountSats, status, sourceRef, paidTxRef, observedAt)`
Statuses distinguish estimated/reported/paid/reversed. This is reporting/accounting, not a custodial customer balance.

### Invoice / InvoiceLine
Hosting/service invoices snapshot tariff/usage basis and totals. They may have one or more payment intents over their lifecycle. Corrections use adjustments/credits.

### Incident / SupportCase / AuditEvent / IntegrationEvent
Operational/support/audit entities remain append-oriented. IntegrationEvent stores webhook identity, signature verification result, processing state and idempotency metadata.

## Critical invariants
1. Physical serial globally unique.
2. Simulated unit never silently becomes physical.
3. One active owner per ASIC.
4. One active deployment per ASIC.
5. Paid state comes from authoritative server-side provider confirmation/reconciliation, not browser redirect.
6. Provider event IDs and payment idempotency keys are unique within provider/environment scope.
7. Historical quote/payment rate snapshots are immutable.
8. Settlement adjustments are append-only/auditable.
9. Reward amounts are never silently overwritten.
10. Wallet changes are audited and require configured security controls.
11. HashNomads stores no customer private keys/seed phrases in V1.
12. Production records cannot reference sandbox providers/resources.
13. Customer resources are tenant-scoped.
14. Observation/event time is distinct from ingestion/processing time.
15. Payment/settlement ledgers and mining-reward ledger remain conceptually separate.

## Indexing priorities
Customer/resource FKs, serial number, provider invoice/event/transaction/settlement references, payment status/time, wallet customer/status, worker/provider, telemetry deployment/time, reward customer/time, invoice customer/status, audit resource/time.
