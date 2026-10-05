import { db } from "./src";
import { catalogue, facilities } from "../domain/src";
async function seed() {
  for (const model of catalogue)
    await db.asicModel.upsert({
      where: { id: model.id },
      update: { priceMinor: null },
      create: {
        id: model.id,
        manufacturer: model.manufacturer,
        model: model.name,
        nominalHashrateTHs: model.hashrateTH,
        nominalPowerW: model.powerW,
        efficiencyJTH: model.efficiency,
        priceMinor: null,
        specificationSource: model.source,
      },
    });
  for (const facility of facilities)
    await db.facility.upsert({
      where: { id: facility.id },
      update: {},
      create: {
        id: facility.id,
        name: facility.name,
        country: facility.country,
        region: facility.region,
        status: facility.status === "Currently full" ? "full" : "available",
      },
    });
  console.log(
    "Sourced hardware and facility directory saved. No inventory, prices, customers or hosting plans generated.",
  );
}
seed().finally(() => db.$disconnect());
