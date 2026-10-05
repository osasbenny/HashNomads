-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('sandbox');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('customer', 'support', 'operations', 'finance_compliance', 'admin');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'customer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'onboarding',
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycCase" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "sourceRef" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "KycCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsicModel" (
    "id" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL DEFAULT 'SHA-256',
    "nominalHashrateTHs" DECIMAL(12,3) NOT NULL,
    "nominalPowerW" INTEGER NOT NULL,
    "efficiencyJTH" DECIMAL(12,3) NOT NULL,
    "priceMinor" BIGINT NOT NULL,
    "specificationSource" TEXT NOT NULL,

    CONSTRAINT "AsicModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsicUnit" (
    "id" TEXT NOT NULL,
    "asicModelId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "serialKind" TEXT NOT NULL DEFAULT 'simulated',
    "inventoryStatus" TEXT NOT NULL DEFAULT 'inventory',
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',

    CONSTRAINT "AsicUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'simulated',
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostingPlan" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tariffUsdPerKwh" DECIMAL(12,6) NOT NULL,
    "setupMinor" BIGINT NOT NULL,
    "serviceMonthlyMinor" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billingCadence" TEXT NOT NULL DEFAULT 'monthly',
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),

    CONSTRAINT "HostingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_payment',
    "accountingCurrency" TEXT NOT NULL DEFAULT 'USD',
    "totalMinor" BIGINT NOT NULL,
    "quoteExpiresAt" TIMESTAMP(3) NOT NULL,
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderLine" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitMinor" BIGINT NOT NULL,
    "totalMinor" BIGINT NOT NULL,

    CONSTRAINT "OrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentIntent" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "hostingInvoiceId" TEXT,
    "provider" TEXT NOT NULL,
    "providerInvoiceRef" TEXT NOT NULL,
    "accountingCurrency" TEXT NOT NULL DEFAULT 'USD',
    "accountingAmountMinor" BIGINT NOT NULL,
    "paymentAsset" TEXT NOT NULL,
    "paymentNetwork" TEXT NOT NULL,
    "requestedAmountAtomic" BIGINT NOT NULL,
    "rateUsdMinor" BIGINT NOT NULL,
    "rateSource" TEXT NOT NULL,
    "rateLockedAt" TIMESTAMP(3) NOT NULL,
    "rateExpiresAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "idempotencyKey" TEXT NOT NULL,
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CryptoInvoice" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "receivingReference" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CryptoInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "providerTxRef" TEXT NOT NULL,
    "blockchainTxHash" TEXT,
    "asset" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "amountAtomic" BIGINT NOT NULL,
    "confirmations" INTEGER,
    "status" TEXT NOT NULL,
    "observedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "providerSettlementRef" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "grossAmountAtomic" BIGINT NOT NULL,
    "feeAmountAtomic" BIGINT NOT NULL,
    "netAmountAtomic" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reconciliationStatus" TEXT NOT NULL DEFAULT 'pending',
    "destinationRefRedacted" TEXT NOT NULL,
    "settledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentAdjustment" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "amountAtomic" BIGINT NOT NULL,
    "reason" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnershipAssignment" (
    "id" TEXT NOT NULL,
    "asicUnitId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "OwnershipAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "asicUnitId" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "hostingPlanId" TEXT NOT NULL,
    "workerIdentity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'deployment_pending',
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelemetrySample" (
    "id" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DECIMAL(20,8) NOT NULL,
    "unit" TEXT NOT NULL,
    "sourceProvider" TEXT NOT NULL,
    "sourceRef" TEXT NOT NULL,
    "observedAt" TIMESTAMP(3) NOT NULL,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelemetrySample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletDestination" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "asset" TEXT NOT NULL DEFAULT 'BTC',
    "network" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT 'mining_payout',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "verificationMethod" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "deactivatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletChangeRequest" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "walletDestinationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "riskReviewRef" TEXT,

    CONSTRAINT "WalletChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardEntry" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "walletDestinationId" TEXT NOT NULL,
    "poolProvider" TEXT NOT NULL,
    "sourceRef" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "amountSats" BIGINT NOT NULL,
    "status" TEXT NOT NULL,
    "paidTxRef" TEXT,
    "observedAt" TIMESTAMP(3) NOT NULL,
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',

    CONSTRAINT "RewardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostingInvoice" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "deploymentId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "tariffSnapshot" DECIMAL(12,6) NOT NULL,
    "usageKwh" DECIMAL(16,6) NOT NULL,
    "usageSource" TEXT NOT NULL,
    "totalMinor" BIGINT NOT NULL,
    "accountingCurrency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'issued',
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',
    "dueAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HostingInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceLine" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amountMinor" BIGINT NOT NULL,

    CONSTRAINT "InvoiceLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "sourceRef" TEXT,
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportCase" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventRef" TEXT NOT NULL,
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',
    "signatureVerified" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "IntegrationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "environment" "Environment" NOT NULL DEFAULT 'sandbox',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    "lastErrorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerId_accountId_key" ON "Account"("providerId", "accountId");

-- CreateIndex
CREATE INDEX "Verification_identifier_idx" ON "Verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KycCase_sourceRef_key" ON "KycCase"("sourceRef");

-- CreateIndex
CREATE INDEX "KycCase_customerId_status_idx" ON "KycCase"("customerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ConsentRecord_customerId_document_version_key" ON "ConsentRecord"("customerId", "document", "version");

-- CreateIndex
CREATE UNIQUE INDEX "AsicUnit_serialNumber_key" ON "AsicUnit"("serialNumber");

-- CreateIndex
CREATE INDEX "AsicUnit_inventoryStatus_idx" ON "AsicUnit"("inventoryStatus");

-- CreateIndex
CREATE INDEX "Order_customerId_createdAt_idx" ON "Order"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentIntent_customerId_status_idx" ON "PaymentIntent"("customerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_provider_environment_providerInvoiceRef_key" ON "PaymentIntent"("provider", "environment", "providerInvoiceRef");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_provider_environment_idempotencyKey_key" ON "PaymentIntent"("provider", "environment", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "CryptoInvoice_paymentIntentId_key" ON "CryptoInvoice"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_providerTxRef_key" ON "PaymentTransaction"("providerTxRef");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_providerSettlementRef_key" ON "Settlement"("providerSettlementRef");

-- CreateIndex
CREATE INDEX "OwnershipAssignment_customerId_idx" ON "OwnershipAssignment"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_workerIdentity_key" ON "Deployment"("workerIdentity");

-- CreateIndex
CREATE UNIQUE INDEX "TelemetrySample_sourceRef_key" ON "TelemetrySample"("sourceRef");

-- CreateIndex
CREATE INDEX "TelemetrySample_deploymentId_observedAt_idx" ON "TelemetrySample"("deploymentId", "observedAt");

-- CreateIndex
CREATE INDEX "WalletDestination_customerId_status_idx" ON "WalletDestination"("customerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RewardEntry_sourceRef_key" ON "RewardEntry"("sourceRef");

-- CreateIndex
CREATE INDEX "RewardEntry_customerId_periodEnd_idx" ON "RewardEntry"("customerId", "periodEnd");

-- CreateIndex
CREATE INDEX "HostingInvoice_customerId_status_idx" ON "HostingInvoice"("customerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "HostingInvoice_deploymentId_periodStart_periodEnd_key" ON "HostingInvoice"("deploymentId", "periodStart", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationEvent_provider_environment_eventRef_key" ON "IntegrationEvent"("provider", "environment", "eventRef");

-- CreateIndex
CREATE INDEX "AuditEvent_resourceType_resourceId_createdAt_idx" ON "AuditEvent"("resourceType", "resourceId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Job_idempotencyKey_key" ON "Job"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Job_status_availableAt_idx" ON "Job"("status", "availableAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycCase" ADD CONSTRAINT "KycCase_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsicUnit" ADD CONSTRAINT "AsicUnit_asicModelId_fkey" FOREIGN KEY ("asicModelId") REFERENCES "AsicModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostingPlan" ADD CONSTRAINT "HostingPlan_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_hostingInvoiceId_fkey" FOREIGN KEY ("hostingInvoiceId") REFERENCES "HostingInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CryptoInvoice" ADD CONSTRAINT "CryptoInvoice_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "PaymentIntent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "PaymentIntent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "PaymentIntent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAdjustment" ADD CONSTRAINT "PaymentAdjustment_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "PaymentIntent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnershipAssignment" ADD CONSTRAINT "OwnershipAssignment_asicUnitId_fkey" FOREIGN KEY ("asicUnitId") REFERENCES "AsicUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnershipAssignment" ADD CONSTRAINT "OwnershipAssignment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnershipAssignment" ADD CONSTRAINT "OwnershipAssignment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_asicUnitId_fkey" FOREIGN KEY ("asicUnitId") REFERENCES "AsicUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_hostingPlanId_fkey" FOREIGN KEY ("hostingPlanId") REFERENCES "HostingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelemetrySample" ADD CONSTRAINT "TelemetrySample_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletDestination" ADD CONSTRAINT "WalletDestination_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletChangeRequest" ADD CONSTRAINT "WalletChangeRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletChangeRequest" ADD CONSTRAINT "WalletChangeRequest_walletDestinationId_fkey" FOREIGN KEY ("walletDestinationId") REFERENCES "WalletDestination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardEntry" ADD CONSTRAINT "RewardEntry_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardEntry" ADD CONSTRAINT "RewardEntry_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardEntry" ADD CONSTRAINT "RewardEntry_walletDestinationId_fkey" FOREIGN KEY ("walletDestinationId") REFERENCES "WalletDestination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostingInvoice" ADD CONSTRAINT "HostingInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostingInvoice" ADD CONSTRAINT "HostingInvoice_deploymentId_fkey" FOREIGN KEY ("deploymentId") REFERENCES "Deployment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "HostingInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportCase" ADD CONSTRAINT "SupportCase_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
