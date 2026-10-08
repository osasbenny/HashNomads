import "server-only";
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@hashnomads/db";
import { readEnvironment } from "@hashnomads/config";
export function getAuth() {
  const env = readEnvironment(process.env);
  return betterAuth({
    database: prismaAdapter(db, { provider: "postgresql" }),
    secret: env.BETTER_AUTH_SECRET,
    plugins: [twoFactor({ issuer: "HashNomads" })],
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.BETTER_AUTH_URL],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    session: { expiresIn: 60 * 60 * 24, updateAge: 60 * 60 },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 120,
      storage: "database",
      customRules: {
        // Dashboard navigation and account hydration perform frequent session reads.
        "/get-session": { window: 60, max: 360 },
        "/sign-up/email": { window: 60, max: 6 },
        "/sign-in/email": { window: 60, max: 12 },
      },
    },
    user: {
      additionalFields: {
        role: { type: "string", defaultValue: "customer", input: false },
      },
    },
  });
}
