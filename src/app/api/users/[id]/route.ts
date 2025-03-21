import { NextResponse } from "next/server";
import { userService } from "../user.service";
import Joi from "joi";

const idSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { error } = idSchema.validate({ id: Number(id) });

    if (error) {
      return NextResponse.json(
        { error: "invalid user id format" },
        { status: 400 }
      );
    }

    const userId = Number.parseInt(id);
    const deletedUser = userService.deleteUser(userId);
    // console.log("----------------------------");
    // console.log("Delete", deletedUser);
    // console.log("----------------------------");

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
