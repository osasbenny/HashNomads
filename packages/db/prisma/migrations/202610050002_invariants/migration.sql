-- Database constraints are the final defense against concurrent workflow writes.
CREATE UNIQUE INDEX "one_active_owner" ON "OwnershipAssignment" ("asicUnitId") WHERE "endedAt" IS NULL;
CREATE UNIQUE INDEX "one_active_deployment" ON "Deployment" ("asicUnitId") WHERE "endedAt" IS NULL;
CREATE UNIQUE INDEX "one_active_payout_destination" ON "WalletDestination" ("customerId", "purpose", "network") WHERE "status" = 'active';
ALTER TABLE "AsicUnit" ADD CONSTRAINT "simulated_serial" CHECK ("serialKind" = 'simulated' AND "serialNumber" LIKE 'SIM-%');
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "exactly_one_payable" CHECK (("orderId" IS NOT NULL)::int + ("hostingInvoiceId" IS NOT NULL)::int = 1);
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "positive_payment" CHECK ("accountingAmountMinor" > 0 AND "requestedAmountAtomic" > 0 AND "rateUsdMinor" > 0 AND "rateExpiresAt" > "rateLockedAt");
ALTER TABLE "Order" ADD CONSTRAINT "positive_order" CHECK ("totalMinor" > 0);
ALTER TABLE "OrderLine" ADD CONSTRAINT "line_total" CHECK ("quantity" > 0 AND "unitMinor" >= 0 AND "totalMinor" = "quantity" * "unitMinor");
ALTER TABLE "RewardEntry" ADD CONSTRAINT "valid_reward" CHECK ("amountSats" >= 0 AND "periodEnd" > "periodStart");
ALTER TABLE "Settlement" ADD CONSTRAINT "settlement_math" CHECK ("grossAmountAtomic" >= 0 AND "feeAmountAtomic" >= 0 AND "netAmountAtomic" = "grossAmountAtomic" - "feeAmountAtomic");
CREATE FUNCTION reject_append_only_change() RETURNS trigger AS $$
BEGIN RAISE EXCEPTION 'append-only ledger: create an adjustment instead'; END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER audit_append_only BEFORE UPDATE OR DELETE ON "AuditEvent" FOR EACH ROW EXECUTE FUNCTION reject_append_only_change();
CREATE TRIGGER reward_append_only BEFORE UPDATE OR DELETE ON "RewardEntry" FOR EACH ROW EXECUTE FUNCTION reject_append_only_change();
CREATE TRIGGER adjustment_append_only BEFORE UPDATE OR DELETE ON "PaymentAdjustment" FOR EACH ROW EXECUTE FUNCTION reject_append_only_change();
