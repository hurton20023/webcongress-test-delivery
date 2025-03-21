import { NextResponse } from "next/server";
import { userService } from "../user.service";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = Number.parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "invalid user Id" }, { status: 400 });
    }

    const userExist = await userService.getUserById(userId);

    if (!userExist) {
      return NextResponse.json({ error: "user not found" }, { status: 400 });
    }

    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "user deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to delete user" },
      { status: 500 }
    );
  }
}
