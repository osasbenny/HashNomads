import { db } from "@hashnomads/db";
import {
  acceptSubmission,
  enquiryInput,
  readBody,
} from "@/lib/site-submissions";
export async function POST(request: Request) {
  try {
    const rejected = await acceptSubmission(request);
    if (rejected) return rejected;
    const input = enquiryInput.safeParse(await readBody(request));
    if (!input.success || input.data.website)
      return Response.json(
        { message: "Please check your details and privacy consent." },
        { status: 400 },
      );
    const { name, email, topic, message } = input.data;
    await db.siteEnquiry.create({
      data: { name, email, topic, message, consentVersion: "2026-10-05" },
    });
    return Response.json(
      { message: "Your enquiry has been saved for the HashNomads team." },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { message: "We couldn’t save your enquiry. Please try again shortly." },
      { status: 503 },
    );
  }
}
