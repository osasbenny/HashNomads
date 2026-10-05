import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@hashnomads/db";
import { readEnvironment } from "@hashnomads/config";
export function getAuth() {
  const env = readEnvironment(process.env);
  return betterAuth({
    database: prismaAdapter(db, { provider: "postgresql" }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.BETTER_AUTH_URL],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    session: { expiresIn: 60 * 60 * 24, updateAge: 60 * 60 },
    rateLimit: { enabled: true, window: 60, max: 30 },
    user: {
      additionalFields: {
        role: { type: "string", defaultValue: "customer", input: false },
      },
    },
  });
}
