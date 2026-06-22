import { api } from "./axios";

export type Evento = {
  id: number;
  titulo: string;
  fecha: string;
  descripcion: string;
  url: string;
};

export type EventoPayload = Omit<Evento, "id">;

export type PaginaEventosResponse = {
  content: Evento[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  page?: number;
};

type ListarEventosParams = {
  titulo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  size?: number;
  sort?: string;
};

function buildEventosQuery(params: ListarEventosParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.append(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function listarEventos(params: ListarEventosParams = {}) {
  const qs = buildEventosQuery(params);
  return api.get<PaginaEventosResponse>(`/eventos${qs}`).then((r) => r.data);
}

export async function listarProximosEventos() {
  return listarEventos({
    fechaDesde: "2026-06-21",
    size: 3,
    sort: "fecha,asc",
  }).then((data) => data.content);
}

export async function listarTodosEventos(size = 100) {
  const firstPage = await listarEventos({ page: 0, size, sort: "fecha,asc" });
  const eventos = [...firstPage.content];
  const totalPages = firstPage.totalPages ?? 1;

  for (let page = 1; page < totalPages; page += 1) {
    const nextPage = await listarEventos({ page, size, sort: "fecha,asc" });
    eventos.push(...nextPage.content);
  }

  return eventos;
}

export async function crearEvento(body: EventoPayload) {
  return api.post<Evento>("/eventos", body).then((r) => r.data);
}

export async function eliminarEvento(id: number) {
  return api.delete<void>(`/eventos/${id}`).then((r) => r.data);
}
