import { api } from "./axios";

export type JuegoParaJugarResponseDto = {
  id: number;
  nombre: string;
  descripcion?: string;
  cantidadDisponible?: number;
  imagenUrl?: string;
  numeroMaximo?: number;
  dificultad?: string;
  categoria?: string;
  duracionAproximada?: string;
};

export type JuegoParaVenderResponseDto = {
  id: number;
  nombre: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  imagenUrl?: string;
  numeroMaximo?: number;
  dificultad?: string;
  categoria?: string;
  duracionAproximada?: string;
};

export type JuegosQuery = {
  nombre?: string;
  categoria?: string;
  dificultad?: string;
  jugadoresMax?: number;
  stock?: number;
};

export const listarJuegosParaJugar = (params?: JuegosQuery) =>
  api.get<JuegoParaJugarResponseDto[]>("/juegos/jugar", { params }).then((r) => r.data);

export const listarJuegosParaComprar = (params?: JuegosQuery) =>
  api.get<JuegoParaVenderResponseDto[]>("/juegos/vender", { params }).then((r) => r.data);
