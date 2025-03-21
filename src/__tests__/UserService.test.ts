import { UserService } from "@/app/api/users/user.service";
import { describe, beforeEach, it, expect } from "@jest/globals";
import type { CreateUserDto } from "@/types";

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe("getAllUsers", () => {
    it("should return all users", () => {
      const users = userService.getAllUsers();
      expect(users).toHaveLength(3);
      expect(users[0].name).toBe("Aymen");
      expect(users[1].name).toBe("Aminata");
      expect(users[2].name).toBe("Elise");
    });
  });

  describe("createUser", () => {
    it("should create a new user", () => {
      const userData: CreateUserDto = {
        name: "Zakaria",
        email: "zakaria@example.com",
        role: "User",
      };

      const newUser = userService.createUser(userData);
      expect(newUser.id).toBe(4);
      expect(newUser.name).toBe("Zakaria");
      expect(newUser.email).toBe("zakaria@example.com");
      expect(newUser.role).toBe("User");

      const allUsers = userService.getAllUsers();
      expect(allUsers).toHaveLength(4);
      expect(allUsers[3]).toEqual(newUser);
    });
  });

  describe("deleteUser", () => {
    it("should delete an existing user", () => {
      const userIdToDelete = 2;
      const deletedUser = userService.deleteUser(userIdToDelete);

      expect(deletedUser).not.toBeNull();
      expect(deletedUser?.id).toBe(userIdToDelete);
      expect(deletedUser?.name).toBe("Aminata");
      const allUsers = userService.getAllUsers();

      expect(allUsers).toHaveLength(2);
      expect(
        allUsers.find((user) => user.id === userIdToDelete)
      ).toBeUndefined();
    });

    it("should return null when id not exist", () => {
      const nonExistentUserId = 999;
      const result = userService.deleteUser(nonExistentUserId);
      expect(result).toBeNull();
      expect(userService.getAllUsers()).toHaveLength(3);
    });
  });
});
