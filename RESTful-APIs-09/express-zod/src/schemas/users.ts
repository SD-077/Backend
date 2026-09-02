import { z } from "zod/v4";

export const userInputSchema = z.strictObject({
  email: z.email().min(1),
  password: z.string().min(8),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  isActive: z.boolean().default(true),
});
