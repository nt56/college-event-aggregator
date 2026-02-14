import { z } from "zod";

/**
 * Schema for creating a new registration
 */
export const createRegistrationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
});

/**
 * Schema for registration query parameters
 */
export const registrationQuerySchema = z.object({
  eventId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;
export type RegistrationQueryInput = z.infer<typeof registrationQuerySchema>;
