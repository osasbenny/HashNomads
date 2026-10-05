import { createHash } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";
import { db } from "@hashnomads/db";
import { acceptSubmission, readBody } from "@/lib/site-submissions";
const inputSchema = z
  .object({
    token: z.string().regex(/^[a-f0-9]{64}$/),
    password: z.string().min(12).max(128),
  })
  .strict();
export async function POST(request: Request) {
  try {
    const rejected = await acceptSubmission(request);
    if (rejected) return rejected;
    const parsed = inputSchema.safeParse(await readBody(request));
    if (!parsed.success)
      return Response.json(
        {
          message:
            "Use your private setup link and a password of at least 12 characters.",
        },
        { status: 400 },
      );
    const identifier = `admin-setup:${createHash("sha256").update(parsed.data.token).digest("hex")}`;
    const invite = await db.verification.findFirst({
      where: { identifier, expiresAt: { gt: new Date() } },
    });
    if (!invite)
      return Response.json(
        { message: "This setup link is invalid, expired or already used." },
        { status: 400 },
      );
    const password = await hashPassword(parsed.data.password);
    await db.$transaction(async (tx) => {
      const consumed = await tx.verification.deleteMany({
        where: { id: invite.id, expiresAt: { gt: new Date() } },
      });
      if (consumed.count !== 1) throw new Error("INVITE_USED");
      const user = await tx.user.findUnique({ where: { id: invite.value } });
      if (user?.email !== "admin@hashnomads.com" || user.role !== "admin")
        throw new Error("INVALID_ADMIN");
      const changed = await tx.account.updateMany({
        where: { userId: user.id, providerId: "credential" },
        data: { password, updatedAt: new Date() },
      });
      if (changed.count !== 1) throw new Error("INVALID_ACCOUNT");
    });
    return Response.json({
      message:
        "Your administrator password is set. Sign in and enable two-factor authentication to open the inbox.",
    });
  } catch {
    return Response.json(
      {
        message:
          "Unable to finish setup. Check your private link or try again shortly.",
      },
      { status: 503 },
    );
  }
}
