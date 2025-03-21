import type { User, CreateUserDto } from "@/types";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/validations/user.validtion";

export class UserService {
  async getAllUsers(): Promise<User[]> {
    return await prisma.users.findMany();
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const { error, value } = userSchema.validate(userData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    return await prisma.users.create({
      data: value,
    });
  }

  async deleteUser(id: number): Promise<User | null> {
    try {
      return await prisma.users.delete({
        where: { id },
      });
    } catch (error) {
      return null;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    return await prisma.users.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.users.findUnique({
      where: { email },
    });
  }
}

export const userService = new UserService();
