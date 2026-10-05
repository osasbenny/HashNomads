import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
const db = new PrismaClient();
afterAll(() => db.$disconnect());
describe("PostgreSQL foundation", () => {
  it("has sourced specifications and all domain tables", async () => {
    expect(await db.asicModel.count()).toBeGreaterThan(0);
    const tables = await db.$queryRaw<
      { tablename: string }[]
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
    expect(tables.map((t) => t.tablename)).toEqual(
      expect.arrayContaining([
        "User",
        "PaymentIntent",
        "CryptoInvoice",
        "RewardEntry",
        "HostingInvoice",
        "AuditEvent",
        "Job",
      ]),
    );
  });
  it("rejects artificial inventory identities", async () => {
    await expect(
      db.asicUnit.create({
        data: {
          asicModelId: "s21-pro",
          serialNumber: `SIM-${randomUUID()}`,
          serialKind: "simulated",
        },
      }),
    ).rejects.toThrow();
  });
  it("makes audit events append-only", async () => {
    const event = await db.auditEvent.create({
      data: {
        actorId: "integration-test",
        action: "foundation.verified",
        resourceType: "test",
        resourceId: randomUUID(),
        metadata: { synthetic: true },
      },
    });
    await expect(
      db.auditEvent.update({
        where: { id: event.id },
        data: { action: "modified" },
      }),
    ).rejects.toThrow();
    await expect(
      db.auditEvent.delete({ where: { id: event.id } }),
    ).rejects.toThrow();
    expect(
      (await db.auditEvent.findUniqueOrThrow({ where: { id: event.id } }))
        .action,
    ).toBe("foundation.verified");
  });
  it("preserves precision beyond Number.MAX_SAFE_INTEGER", async () => {
    const id = `SIM-precision-${randomUUID()}`;
    await db.asicModel.create({
      data: {
        id,
        manufacturer: "TEST",
        model: "Precision fixture",
        nominalHashrateTHs: "1.001",
        nominalPowerW: 1,
        efficiencyJTH: "1",
        priceMinor: 900719925474099301n,
        specificationSource: "test",
      },
    });
    expect(
      (await db.asicModel.findUniqueOrThrow({ where: { id } })).priceMinor,
    ).toBe(900719925474099301n);
    await db.asicModel.delete({ where: { id } });
  });
  it("contains the concurrent ownership, deployment, and payout guards", async () => {
    const indexes = await db.$queryRaw<
      { indexname: string }[]
    >`SELECT indexname FROM pg_indexes WHERE schemaname='public'`;
    expect(indexes.map((i) => i.indexname)).toEqual(
      expect.arrayContaining([
        "one_active_owner",
        "one_active_deployment",
        "one_active_payout_destination",
      ]),
    );
  });
});
