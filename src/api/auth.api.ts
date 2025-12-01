import { api } from "./axios";
import type { User } from "../auth/auth.store";

export type LoginResponse = { token: string; nombre: string; email: string; rol: string; id?: number };

export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  const data = await api.post<LoginResponse>("/auth/login", { email, password }).then(r => r.data);
  const user: User = { id: data.id, nombre: data.nombre, email: data.email, roles: [data.rol] };
  return { token: data.token, user };
}
