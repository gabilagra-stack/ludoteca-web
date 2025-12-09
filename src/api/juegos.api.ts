import { api } from "./axios";

export type JuegoBase = {
  id: number;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  numeroMaximo: number;
  dificultad: string;
  categoria: string;
  duracionAproximada: string;
};

export type JuegoParaJugar = JuegoBase & {
  cantidadDisponible: number;
};

export type JuegoParaVender = JuegoBase & {
  precio: number;
  stock: number;
};

// Alias para compatibilidad con páginas existentes
export type JuegoParaJugarResponseDto = JuegoParaJugar;
export type JuegoParaVenderResponseDto = JuegoParaVender;

type Filtros = {
  nombre?: string;
  categoria?: string;
  dificultad?: string;
  jugadoresMax?: number;
};

type FiltrosVender = Filtros & { stock?: number };

function buildQuery(params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== "") q.append(key, String(val));
  });
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}

export async function listarJuegosParaJugar(filtros?: Filtros) {
  const qs = buildQuery({
    nombre: filtros?.nombre,
    categoria: filtros?.categoria,
    dificultad: filtros?.dificultad,
    jugadoresMax: filtros?.jugadoresMax,
  });
  return api.get<JuegoParaJugar[]>(`/juegos/jugar${qs}`).then((r) => r.data);
}

export async function crearJuegoParaJugar(body: Omit<JuegoParaJugar, "id">) {
  return api.post<JuegoParaJugar>("/juegos/jugar", body).then((r) => r.data);
}

export async function eliminarJuegoParaJugar(id: number) {
  return api.delete<void>(`/juegos/jugar/${id}`).then((r) => r.data);
}

export async function listarJuegosParaVender(filtros?: FiltrosVender) {
  const qs = buildQuery({
    nombre: filtros?.nombre,
    categoria: filtros?.categoria,
    dificultad: filtros?.dificultad,
    jugadoresMax: filtros?.jugadoresMax,
    stock: filtros?.stock,
  });
  return api.get<JuegoParaVender[]>(`/juegos/vender${qs}`).then((r) => r.data);
}

// Alias de nombres anteriores
export const listarJuegosParaComprar = listarJuegosParaVender;

export async function crearJuegoParaVender(body: Omit<JuegoParaVender, "id">) {
  return api.post<JuegoParaVender>("/juegos/vender", body).then((r) => r.data);
}

export async function eliminarJuegoParaVender(id: number) {
  return api.delete<void>(`/juegos/vender/${id}`).then((r) => r.data);
}
