import { db } from "@hashnomads/db";
import { isAdministrator } from "@/lib/admin";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!(await isAdministrator(request.headers)))
    return Response.json(
      { error: "Administrator MFA required" },
      { status: 403, headers },
    );
  try {
    const [customers, asicUnits, orders, activity] = await Promise.all([
      db.user.count({ where: { role: "customer" } }),
      db.asicUnit.count(),
      db.order.count(),
      db.auditEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, action: true, createdAt: true },
      }),
    ]);
    return Response.json(
      {
        checkedAt: new Date().toISOString(),
        stats: { customers, asicUnits, orders, onlineMiners: null },
        services: [
          { name: "Database", status: "Verified", available: true },
          { name: "Auth Service", status: "Session verified", available: true },
          { name: "BTCPay Server", status: "Not connected", available: false },
          { name: "Mining Pool", status: "Not connected", available: false },
          {
            name: "Telemetry Service",
            status: "Not connected",
            available: false,
          },
        ],
        activity,
      },
      { headers },
    );
  } catch {
    return Response.json(
      { error: "Unable to verify operations data" },
      { status: 503, headers },
    );
  }
}
