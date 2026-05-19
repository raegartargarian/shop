import { hashPassword, verifyPassword } from "./passwords";

export type Role = "customer" | "admin";

export type User = {
  id: string;
  email: string;
  role: Role;
  name: string;
};

type StoredUser = User & { passwordHash: string };

const users: StoredUser[] = [
  {
    id: "u_customer",
    email: "customer@demo.local",
    role: "customer",
    name: "Demo Customer",
    passwordHash: hashPassword("customerpass"),
  },
  {
    id: "u_admin",
    email: "admin@demo.local",
    role: "admin",
    name: "Demo Admin",
    passwordHash: hashPassword("adminpass"),
  },
];

function toPublic(u: StoredUser): User {
  return { id: u.id, email: u.email, role: u.role, name: u.name };
}

export function findUserByEmail(email: string): User | null {
  const u = users.find((x) => x.email === email.toLowerCase());
  return u ? toPublic(u) : null;
}

export function findUserById(id: string): User | null {
  const u = users.find((x) => x.id === id);
  return u ? toPublic(u) : null;
}

export function verifyUserCredentials(
  email: string,
  password: string,
): User | null {
  const u = users.find((x) => x.email === email.toLowerCase());
  if (!u) return null;
  if (!verifyPassword(password, u.passwordHash)) return null;
  return toPublic(u);
}
