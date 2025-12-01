import { api } from "./axios";

export type JuegoParaJugarResponseDto = {
  id: number;
  nombre: string;
  categoria?: string;
  dificultad?: string;
  jugadoresMin?: number;
  jugadoresMax?: number;
  duracionMinutos?: number;
  descripcion?: string;
};

export type JuegoParaVenderResponseDto = {
  id: number;
  nombre: string;
  categoria?: string;
  dificultad?: string;
  jugadoresMin?: number;
  jugadoresMax?: number;
  precio?: number;
  stock?: number;
  descripcion?: string;
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
