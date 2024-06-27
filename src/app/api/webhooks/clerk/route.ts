import { createUser, deleteUser } from "@/actions/users/users";
import { UserType } from "@/types/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actionType = body.type;

    switch (actionType) {
      case "user.created":
        console.log(" - User create");
        const provider = body.data.email_addresses[0].verification.strategy;
        const payload: UserType = {
          email: body.data.email_addresses[0].email_address,
          name: body.data.first_name,
          lastName: body.data.last_name,
          clerkId: body.data.id,
          imageUrl: body.data.image_url,
          provider: provider !== "from_oauth_google" ? "PASSWORD" : "GOOGLE",
          secondaryEmail: body.data.email_addresses.map(
            (email: any) => email.email_address
          ),
        };
        const userAction = await createUser(payload);
        if (!userAction) return NextResponse.json(userAction, { status: 400 });
        break;
      case "user.deleted":
        console.log(" - User delete");
        await deleteUser(body.data.id);
        break;
      default:
        console.warn(" - Action not found: ", actionType);
    }

    return NextResponse.json({
      status: actionType === "user.created" ? 201 : 200,
    });
  } catch (e) {
    console.error(" - Unexpected error: ", e);
    return NextResponse.json("Unexpected error", { status: 500 });
  }
}
