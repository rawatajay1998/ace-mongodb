// types/user.ts
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  // other user properties
}
