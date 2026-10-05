import { db } from "@hashnomads/db";
import {
  acceptSubmission,
  subscriptionInput,
  subscriptionToken,
  subscriptionId,
  readBody,
} from "@/lib/site-submissions";
export async function POST(request: Request) {
  try {
    const rejected = await acceptSubmission(request);
    if (rejected) return rejected;
    const input = subscriptionInput.safeParse(await readBody(request));
    if (!input.success || input.data.website)
      return Response.json(
        {
          message: "Enter a valid email and confirm your subscription consent.",
        },
        { status: 400 },
      );
    const { email } = input.data;
    const subscription = await db.newsletterSubscription.upsert({
      where: { email },
      create: { email, consentVersion: "2026-10-05" },
      update: {
        unsubscribedAt: null,
        subscribedAt: new Date(),
        consentVersion: "2026-10-05",
      },
    });
    return Response.json({
      message: "Subscription saved.",
      unsubscribeToken: subscriptionToken(subscription.id),
    });
  } catch {
    return Response.json(
      {
        message:
          "We couldn’t save your subscription. Please try again shortly.",
      },
      { status: 503 },
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const rejected = await acceptSubmission(request);
    if (rejected) return rejected;
    const body = await readBody(request);
    if (typeof body.token !== "string")
      return Response.json(
        { message: "Invalid subscription link." },
        { status: 400 },
      );
    const id = subscriptionId(body.token);
    if (!id)
      return Response.json(
        { message: "Invalid subscription link." },
        { status: 400 },
      );
    await db.newsletterSubscription.updateMany({
      where: { id },
      data: { unsubscribedAt: new Date() },
    });
    return Response.json({ message: "You have been unsubscribed." });
  } catch {
    return Response.json(
      { message: "Please try again shortly." },
      { status: 503 },
    );
  }
}
