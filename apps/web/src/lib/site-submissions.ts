import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@hashnomads/db";
import { z } from "zod";
export const subscriptionInput = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    consent: z.literal(true),
    website: z.string().max(200).default(""),
  })
  .strict();
export const enquiryInput = subscriptionInput.extend({
  name: z.string().trim().min(1).max(100),
  topic: z.enum(["general", "hardware", "hosting", "support", "privacy"]),
  message: z.string().trim().min(10).max(2000),
});
const secret = () => {
  const value = process.env.BETTER_AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("CONFIGURATION_REQUIRED");
  return value;
};
export async function acceptSubmission(request: Request) {
  const expected = new URL(process.env.BETTER_AUTH_URL!).origin;
  if (request.headers.get("origin") !== expected)
    return Response.json(
      { message: "Please submit this form from the HashNomads website." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return Response.json(
      { message: "Invalid submission format." },
      { status: 415 },
    );
  if (Number(request.headers.get("content-length") ?? 0) > 8192)
    return Response.json(
      { message: "Your message is too long." },
      { status: 413 },
    );
  const address =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    "local";
  const bucket = Math.floor(Date.now() / 600000);
  await db.siteRateLimit.deleteMany({
    where: { expiresAt: { lt: new Date(Date.now() - 86400000) } },
  });
  const key = createHmac("sha256", secret())
    .update(`${address}:${bucket}`)
    .digest("hex");
  const hit = await db.siteRateLimit.upsert({
    where: { key },
    create: { key, count: 1, expiresAt: new Date((bucket + 1) * 600000) },
    update: { count: { increment: 1 } },
  });
  if (hit.count > 10)
    return Response.json(
      { message: "Too many requests. Please try again in ten minutes." },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  return null;
}
export function subscriptionToken(id: string) {
  const mac = createHmac("sha256", secret())
    .update(`newsletter:${id}`)
    .digest("hex");
  return `${id}.${mac}`;
}
export function subscriptionId(token: string) {
  const [id, mac, ...rest] = token.split(".");
  if (!id || !mac || rest.length || !/^[a-f0-9]{64}$/.test(mac)) return null;
  const expected = subscriptionToken(id).split(".")[1];
  return timingSafeEqual(Buffer.from(mac), Buffer.from(expected)) ? id : null;
}
export async function readBody(request: Request) {
  const body = await request.text();
  if (Buffer.byteLength(body) > 8192) throw new Error("INVALID_BODY");
  return JSON.parse(body);
}
