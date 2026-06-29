/**
 * Zod schemas for runtime validation of API contracts.
 */
import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(1)
  .max(30)
  .regex(/^[A-Za-z0-9._]+$/, "invalid Instagram username")
  .transform((v) => v.replace(/^@/, "").toLowerCase());

export const jobModeSchema = z.enum(["single_profile", "compare_profiles"]);

export const createJobSchema = z.object({
  mode: jobModeSchema.default("single_profile"),
  usernames: z.array(usernameSchema).min(1).max(5),
  recentDays: z.number().int().min(1).max(365).default(30),
  locale: z.string().min(2).max(10).default("pt-BR"),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
