# HashNomads V1 — Data Model

## Core entities

### User / Role
`User(id, email, status, emailVerifiedAt, createdAt)`
`Role(id, key)` and role assignments/permissions.

### Customer
`Customer(id, userId, type, legalName, country, status, createdAt)`

### KycCase
`KycCase(id, customerId, provider, providerRef, status, submittedAt, decidedAt, environment)`
Do not store unnecessary raw identity documents in the application database.

### ConsentRecord
`ConsentRecord(id, customerId, documentType, version, acceptedAt, ipMetadataRef)`

### AsicModel
`AsicModel(id, manufacturer, model, algorithm, nominalHashrateTHs, nominalPowerW, efficiencyJTH, status)`

### AsicUnit
`AsicUnit(id, asicModelId, serialNumber, serialKind, inventoryStatus, environment)`
`serialKind = physical | simulated`. Simulated serials must use an unmistakable prefix.

### Facility
`Facility(id, name, country, region, status, environment)`
Public data may intentionally omit precise physical address for security.

### HostingPlan
`HostingPlan(id, facilityId, name, tariffType, rate, currency, setupFee, billingCadence, effectiveFrom, effectiveTo)`

### Order / OrderLine
Order contains customer, currency, totals and lifecycle status. Lines snapshot SKU/pricing terms at purchase time; catalogue changes cannot rewrite historical orders.

### Payment
`Payment(id, orderId, provider, providerRef, amountMinor, currency, status, idempotencyKey)`

### OwnershipAssignment
`OwnershipAssignment(id, customerId, asicUnitId, orderLineId, effectiveFrom, effectiveTo, status)`
Only one active owner assignment per ASIC unit.

### Deployment
`Deployment(id, asicUnitId, facilityId, hostingPlanId, workerName, status, deployedAt, endedAt)`
Only one active deployment per ASIC unit.

### TelemetrySample
`TelemetrySample(id, deploymentId, metric, valueDecimal, unit, sourceProvider, sourceRef, observedAt, ingestedAt)`

### WalletDestination
`WalletDestination(id, customerId, network, address, label, status, verifiedAt, createdAt)`
Wallet changes require strong authentication/reconfirmation and audit.

### RewardEntry
`RewardEntry(id, customerId, deploymentId, poolProvider, periodStart, periodEnd, amountSats, status, sourceRef, paidTxRef, observedAt)`
Statuses distinguish estimated/reported/paid/reversed.

### Invoice / InvoiceLine
Hosting invoices snapshot tariff/usage basis and totals. Corrections use adjustments/credit records rather than destructive rewrites.

### Incident
`Incident(id, scopeType, scopeId, severity, status, openedAt, resolvedAt, customerVisible, summary)`

### SupportCase
Customer support workflow separate from infrastructure incidents but linkable.

### AuditEvent
`AuditEvent(id, actorType, actorId, action, resourceType, resourceId, metadataRedacted, createdAt)`
Append-only at application level.

### IntegrationEvent
Stores webhook/provider event identity, processing state and idempotency metadata.

## Critical invariants
1. A physical serial number is globally unique.
2. Simulated units can never be silently promoted to physical units; conversion requires explicit replacement/assignment workflow.
3. One active owner per ASIC unit.
4. One active deployment per ASIC unit.
5. Paid order state comes from authoritative payment confirmation, not browser redirect alone.
6. Reward amounts cannot be overwritten without a traceable adjustment.
7. Wallet address changes are audited.
8. Production records cannot reference sandbox providers/resources.
9. All customer-owned resources are tenant-scoped.
10. Time-series data records observation time separately from ingestion time.

## Indexing priorities
Customer/resource foreign keys, serial number, provider references, worker name + provider, telemetry deployment/time, reward customer/time, invoice customer/status, integration event provider/event ID, audit resource/time.
