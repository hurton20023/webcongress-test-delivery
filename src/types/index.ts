export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: string;
}
