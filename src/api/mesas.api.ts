import { api } from "./axios";

export type Mesa = {
  id: number;
  numero: number;
  capacidad: number;
  disponible: boolean;
};

export async function listarMesas(params?: { numero?: number; capacidad?: number }) {
  const query = new URLSearchParams();
  if (params?.numero !== undefined) query.append("numero", String(params.numero));
  if (params?.capacidad !== undefined) query.append("capacidad", String(params.capacidad));
  const qs = query.toString();
  return api.get<Mesa[]>(`/mesas${qs ? `?${qs}` : ""}`).then((r) => r.data);
}

export async function crearMesa(body: { numero: number; capacidad: number }) {
  return api.post<Mesa>("/mesas", body).then((r) => r.data);
}

export async function eliminarMesa(id: number) {
  return api.delete<void>(`/mesas/${id}`).then((r) => r.data);
}
