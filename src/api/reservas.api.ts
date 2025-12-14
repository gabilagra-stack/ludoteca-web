import { api } from "./axios";

export type ReservaRequestDto = { mesaId: number; turnoDiaId: number; usuarioId?: number };
export type ReservaResponseDto = {
  id: number; usuarioId: number; nombreUsuario: string;
  mesaId: number; numeroMesa: number;
  turnoDiaId: number; diaSemana: string;
  fechaTurno: string; horaInicio: string; horaFin: string; estado: string;
};

export type MesaDisponibilidadDto = { id: number; numero: number; capacidad: number; disponible: boolean };
export type DisponibilidadTurnoResponseDto = { turnoDiaId: number; fecha: string; mesas: MesaDisponibilidadDto[] };

export const crearReserva = (dto: ReservaRequestDto) =>
  api.post<ReservaResponseDto>("/reservas", dto).then(r => r.data);

export const listarMisReservas = () =>
  api.get<ReservaResponseDto[]>("/reservas/mis-reservas").then(r => r.data);

export const cancelarReserva = (id: number) =>
  api.delete<void>(`/reservas/${id}`).then(r => r.data);

export const obtenerDisponibilidad = (fecha: string, turnoDiaId: number) =>
  api.get<DisponibilidadTurnoResponseDto>("/reservas/disponibilidad", { params: { fecha, turnoDiaId } })
    .then(r => r.data);
