import { ZodSchema } from "zod";

export const validateSchema = <T>(schema: ZodSchema, data: T) => {
  try {
    schema.parse(data);
    return true;
  } catch (error) {
    console.error(error);
    return error;
  }
};
