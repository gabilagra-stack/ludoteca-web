import { api } from "./axios";

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

export async function listarUsuarios(params?: { nombre?: string; email?: string; rol?: string }) {
  const query = new URLSearchParams();
  if (params?.nombre) query.append("nombre", params.nombre);
  if (params?.email) query.append("email", params.email);
  if (params?.rol) query.append("rol", params.rol);
  const qs = query.toString();
  return api.get<Usuario[]>(`/usuarios${qs ? `?${qs}` : ""}`).then((r) => r.data);
}

export async function eliminarUsuario(id: number) {
  return api.delete<void>(`/usuarios/${id}`).then((r) => r.data);
}
