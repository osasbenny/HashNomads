import { z } from "zod";
export const environmentSchema = z.object({
  HASHNOMADS_ENV: z.literal("sandbox"),
  DATABASE_URL: z
    .string()
    .url()
    .refine(
      (v) => v.startsWith("postgresql://") || v.startsWith("postgres://"),
    ),
  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  SANDBOX_WEBHOOK_SECRET: z.string().min(32),
});
export function readEnvironment(source: Record<string, string | undefined>) {
  return environmentSchema.parse(source);
}
