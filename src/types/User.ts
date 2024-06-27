import { z } from "zod";
import { ProvidersSchema } from "./Providers";

export const UserSchema = z.object({
  email: z.string(),
  name: z.string().nullable(),
  lastName: z.string().nullable(),
  clerkId: z.string(),
  imageUrl: z.string().optional(),
  provider: ProvidersSchema,
  secondaryEmail: z.array(z.string()),
});

export type UserType = z.infer<typeof UserSchema>;
