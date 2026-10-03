# HashNomads — Crypto Payments & Wallets Specification

## Purpose
Define the boundary between (A) money customers pay HashNomads for hardware/hosting/services and (B) Bitcoin mined by customer-owned ASICs. These are separate systems, ledgers and risk surfaces.

## Core principle
**HashNomads manages miners. Customers control Bitcoin.**

## A. Customer → HashNomads commerce
Customers may pay supported invoices through a specialist crypto payment gateway. Initial target experience:
- Accounting/quote currency: USD initially (configurable later).
- Preferred checkout assets for sandbox/design: BTC, Bitcoin Lightning, USDC, USDT.
- Production availability is determined dynamically by approved provider capabilities, jurisdiction and network support.
- Proposed first production adapter: BitPay, subject to merchant approval/compliance/commercial validation.

### Payable objects
1. ASIC/order checkout.
2. Setup/deployment charges.
3. Hosting/electricity/service invoices.
4. Approved adjustments/fees where contractually disclosed.

### Required payment UX
Display accounting amount, selected crypto asset/network, exact provider-requested amount, rate source/lock expiry when supplied, payment status, invoice expiry, transaction/provider reference where safe, and clear sandbox/production state. Never promise blockchain finality before provider confirmation.

### Merchant settlement
Settlement to HashNomads is tracked separately from customer payment confirmation. Finance/operations requires reconciliation status and exception queue. Application stores settlement metadata—not business wallet private keys.

## B. Mining rewards → customer
Preferred path:
`ASIC → Mining Pool → customer-controlled BTC address`

HashNomads ingests pool reporting for dashboard/accounting. Reward records do not create a custodial HashNomads customer balance.

## V1 wallet functionality
The Wallets area allows:
- add/label BTC payout destination;
- network-aware address validation;
- verify/reconfirm ownership/control using approved mechanisms where feasible;
- select active mining payout destination;
- request payout destination change;
- show activation/pending-review state;
- view pool payout/reward transaction references;
- deactivate old destinations without destroying history.

Sensitive changes require step-up authentication, notification and audit. Production may use cooling-off/manual review depending risk/legal requirements.

## What V1 explicitly does not do
- No HashNomads-hosted BTC balance.
- No seed phrase/private key storage.
- No server-side signing of customer BTC transactions.
- No exchange/swap functionality.
- No fiat/crypto brokerage.
- No promise that entering an address instantly changes a mining-pool payout setting.

## Future: HashNomads Self-Custody Wallet
Candidate for V1.5+ only. Desired UX may offer “Create a HashNomads self-custody wallet” for new Bitcoin users, but the technical/security contract is strict:
1. Key material generated on customer device/client only.
2. Recovery phrase/private key never sent to HashNomads API, telemetry, crash reporting or analytics.
3. User is clearly told HashNomads cannot recover lost recovery material.
4. No silent cloud backup by HashNomads.
5. Third-party scripts on key-generation surface minimized/audited.
6. Dedicated threat model, cryptographic review and independent security assessment.
7. Legal/compliance review and ADR approval before shipping.

## Payment state model
Representative states: `created`, `pending`, `paid`, `confirmed`, `expired`, `failed`, `refunded`, `exception`. Provider-specific states map into internal canonical states without losing raw/source state.

## Settlement state model
Representative states: `pending`, `processing`, `settled`, `failed`, `exception`, `reconciled`. Reconciliation may be orthogonal to settlement state.

## Recurring hosting billing
HashNomads generates an invoice each billing period from immutable tariff/usage inputs. Customer pays through the crypto payment adapter. Invoice/payment/settlement records are linked. Overdue handling follows contract and may ultimately affect miner service state, but automated shutdown rules require explicit policy/Phase 2 facility support.

## Provider portability
No UI/domain module may depend directly on BitPay-specific types. Map provider payloads in `packages/integrations`. Capability discovery controls available assets/networks/refunds/settlements.

## Accounting and reconciliation
Maintain separate ledgers for:
- merchant receivables/invoices;
- customer crypto payments;
- processor fees/settlements;
- hosting/service billing;
- mining reward reporting.

Do not net customer mining rewards against merchant invoices in V1. Such a feature could introduce custody/payment/regulatory complexity and requires separate review.

## Production gates
Before live crypto checkout: merchant account approved; supported countries/assets/networks confirmed; legal/tax/AML/sanctions obligations reviewed; refund policy approved; business settlement process secured; webhook/reconciliation tested; incident process tested; accounting treatment approved.
