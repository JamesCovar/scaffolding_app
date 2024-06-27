import prisma from "@/app/prisma";
import { validateSchema } from "@/helper/validateSchema";
import { UserSchema, UserType } from "@/types/User";

export const createUser = async (user: UserType) => {
  const payloadValidation = validateSchema(UserSchema, user);
  if (!payloadValidation) {
    return new Error(JSON.stringify(payloadValidation));
  }

  const userCreated = await prisma.user.create({ data: user });

  return userCreated;
};

export const deleteUser = async (clerkId: string) => {
  const userDeleted = await prisma.user.delete({
    where: {
      clerkId,
    },
  });

  return userDeleted;
};
