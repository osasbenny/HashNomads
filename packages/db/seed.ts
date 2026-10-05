import { db } from "./src";
import { catalogue, facilities } from "../domain/src";
async function seed() {
  for (const model of catalogue) {
    await db.asicModel.upsert({
      where: { id: model.id },
      update: {},
      create: {
        id: model.id,
        manufacturer: model.manufacturer,
        model: model.name,
        nominalHashrateTHs: model.hashrateTH,
        nominalPowerW: model.powerW,
        efficiencyJTH: model.efficiency,
        priceMinor: BigInt(model.priceMinor),
        specificationSource: model.source,
      },
    });
    for (let i = 1; i <= 5; i++)
      await db.asicUnit.upsert({
        where: { serialNumber: `SIM-S21PRO-${i.toString().padStart(4, "0")}` },
        update: {},
        create: {
          asicModelId: model.id,
          serialNumber: `SIM-S21PRO-${i.toString().padStart(4, "0")}`,
        },
      });
  }
  for (const facility of facilities) {
    await db.facility.upsert({
      where: { id: facility.id },
      update: {},
      create: {
        id: facility.id,
        name: facility.name,
        country: facility.country,
        region: facility.region,
      },
    });
    await db.hostingPlan.upsert({
      where: { id: `${facility.id}-reference` },
      update: {},
      create: {
        id: `${facility.id}-reference`,
        facilityId: facility.id,
        name: "Sandbox reference plan",
        tariffUsdPerKwh: facility.rate,
        setupMinor: 15000n,
        serviceMonthlyMinor: 1500n,
        effectiveFrom: new Date("2026-10-01T00:00:00Z"),
      },
    });
  }
  console.log(
    "Sandbox catalogue, simulated facilities, and SIM inventory seeded. No users or credentials seeded.",
  );
}
seed().finally(() => db.$disconnect());
