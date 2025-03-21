import type { User, CreateUserDto } from "@/types";
import { userSchema } from "@/validations/user.validtion";

export class UserService {
  private users: User[] = [
    { id: 1, name: "Aymen", email: "aymen@example.com", role: "Admin" },
    { id: 2, name: "Aminata", email: "aminata@example.com", role: "User" },
    { id: 3, name: "Elise", email: "elise@example.com", role: "User" },
  ];

  getAllUsers(): User[] {
    return this.users;
  }

  createUser(userData: CreateUserDto): User {
    const { error, value } = userSchema.validate(userData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const newId = this.generateNewId();
    const newUser: User = {
      id: newId,
      ...value,
    };

    this.users.push(newUser);
    return newUser;
  }

  deleteUser(id: number): User | null {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return null;
    }

    const deletedUser = this.users[userIndex];
    this.users.splice(userIndex, 1);
    return deletedUser;
  }

  private generateNewId(): number {
    return this.users.length > 0
      ? Math.max(...this.users.map((user) => user.id)) + 1
      : 1;
  }
}

export const userService = new UserService();
