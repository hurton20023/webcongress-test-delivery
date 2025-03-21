import { NextResponse } from "next/server";
import { userService } from "./user.service";
import type { CreateUserDto } from "@/types";

export async function GET() {
  const users = await userService.getAllUsers();
  // console.log(users);
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.role) {
      return NextResponse.json(
        { error: "name, email, and role are required" },
        { status: 400 }
      );
    }

    const userExist = await userService.getUserByEmail(body.email);

    if (userExist) {
      return NextResponse.json(
        { error: "user with the same exist" },
        { status: 400 }
      );
    }

    const userData: CreateUserDto = {
      name: body.name,
      email: body.email,
      role: body.role,
    };

    const newUser = await userService.createUser(userData);
    // console.log("----------------------------------");
    // console.log("CREATE", newUser);
    // console.log("----------------------------------");

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to create user" },
      { status: 500 }
    );
  }
}
