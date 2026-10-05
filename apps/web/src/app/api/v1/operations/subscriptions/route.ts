import { db } from "@hashnomads/db";
import { isAdministrator } from "@/lib/admin";
export async function GET(request: Request) {
  if (!(await isAdministrator(request.headers)))
    return new Response(null, { status: 403 });
  const rows = await db.newsletterSubscription.findMany({
    where: { unsubscribedAt: null },
    orderBy: { subscribedAt: "desc" },
  });
  const csv = [
    "email,subscribedAt,consentVersion",
    ...rows.map((r) =>
      [r.email, r.subscribedAt.toISOString(), r.consentVersion]
        .map(
          (v) =>
            `"${(/^[=+@\-\t\r]/.test(v) ? "'" + v : v).replaceAll('"', '""')}"`,
        )
        .join(","),
    ),
  ].join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=hashnomads-subscribers.csv",
      "Cache-Control": "no-store",
    },
  });
}
