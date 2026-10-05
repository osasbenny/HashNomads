import { db } from "@hashnomads/db";
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({
      status: "ok",
      environment: process.env.HASHNOMADS_ENV,
    });
  } catch {
    return Response.json(
      {
        status: "degraded",
        database: "unavailable",
        environment: process.env.HASHNOMADS_ENV,
      },
      { status: 503 },
    );
  }
}
