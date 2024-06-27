import { z } from "zod";

export const ProvidersSchema = z.enum(["PASSWORD", "GOOGLE"]);
