-- Environment describes actual application records. No artificial inventory is created.
ALTER TYPE "Environment" RENAME VALUE 'sandbox' TO 'production';
ALTER TABLE "AsicModel" ALTER COLUMN "priceMinor" DROP NOT NULL;
ALTER TABLE "AsicUnit" DROP CONSTRAINT "simulated_serial";
ALTER TABLE "AsicUnit" ALTER COLUMN "serialKind" SET DEFAULT 'physical';
ALTER TABLE "AsicUnit" ADD CONSTRAINT "physical_inventory_identity" CHECK ("serialKind" = 'physical' AND "serialNumber" NOT LIKE 'SIM-%') NOT VALID;
ALTER TABLE "Facility" ALTER COLUMN "status" SET DEFAULT 'available';
CREATE TABLE "SiteEnquiry" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'new',
  "consentVersion" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "SiteEnquiry_createdAt_idx" ON "SiteEnquiry"("createdAt");
CREATE TABLE "NewsletterSubscription" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "consentVersion" TEXT NOT NULL,
  "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "unsubscribedAt" TIMESTAMP(3)
);
CREATE TABLE "SiteRateLimit" (
  "key" TEXT NOT NULL PRIMARY KEY,
  "count" INTEGER NOT NULL DEFAULT 1,
  "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "SiteRateLimit_expiresAt_idx" ON "SiteRateLimit"("expiresAt");
