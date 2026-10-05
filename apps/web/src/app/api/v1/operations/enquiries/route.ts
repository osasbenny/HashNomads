import { db } from "@hashnomads/db";
import { z } from "zod";
import { isAdministrator } from "@/lib/admin";
import { readBody } from "@/lib/site-submissions";
export async function PATCH(request: Request) {
  if (!(await isAdministrator(request.headers)))
    return Response.json(
      {
        message:
          "Administrator access with two-factor authentication required.",
      },
      { status: 403 },
    );
  if (
    request.headers.get("origin") !==
    new URL(process.env.BETTER_AUTH_URL!).origin
  )
    return new Response(null, { status: 403 });
  try {
    const body = z
      .object({
        id: z.string().min(1).max(100),
        status: z.enum(["new", "handled"]),
      })
      .strict()
      .safeParse(await readBody(request));
    if (!body.success) return new Response(null, { status: 400 });
    const changed = await db.siteEnquiry.updateMany({
      where: { id: body.data.id },
      data: { status: body.data.status },
    });
    return Response.json({ updated: changed.count === 1 });
  } catch {
    return Response.json(
      { message: "Unable to update the enquiry." },
      { status: 503 },
    );
  }
}
