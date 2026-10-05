import { db } from "@hashnomads/db";
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({
      status: "ok",
      environment: "sandbox",
      productionEnabled: false,
    });
  } catch {
    return Response.json(
      {
        status: "degraded",
        database: "unavailable",
        environment: "sandbox",
        productionEnabled: false,
      },
      { status: 503 },
    );
  }
}
