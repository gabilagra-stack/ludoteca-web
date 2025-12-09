import { api } from "./axios";

export type TurnoHorario = {
  id: number;
  horaInicio: string; // HH:mm
  horaFin: string;
};

export type TurnoDia = {
  id: number;
  fecha: string; // ISO date
  diaSemana: string;
  turnoHorarioId: number;
  horaInicio: string;
  horaFin: string;
};

export async function listarHorarios() {
  return api.get<TurnoHorario[]>("/turnos/horarios").then((r) => r.data);
}

export async function listarTurnosDia(params?: { fecha?: string; diaSemana?: string }) {
  const query = new URLSearchParams();
  if (params?.fecha) query.append("fecha", params.fecha);
  if (params?.diaSemana) query.append("diaSemana", params.diaSemana);
  const qs = query.toString();
  return api.get<TurnoDia[]>(`/turnos/dias${qs ? `?${qs}` : ""}`).then((r) => r.data);
}

export async function crearTurnoHorario(body: { horaInicio: string; horaFin: string }) {
  return api.post<TurnoHorario>("/turnos/horarios", body).then((r) => r.data);
}

export async function crearTurnoDia(body: { fecha: string; diaSemana: string; turnoHorarioId: number }) {
  return api.post<TurnoDia>("/turnos/dias", body).then((r) => r.data);
}

export async function eliminarTurnoHorario(id: number) {
  return api.delete<void>(`/turnos/horarios/${id}`).then((r) => r.data);
}

export async function eliminarTurnoDia(id: number) {
  return api.delete<void>(`/turnos/dias/${id}`).then((r) => r.data);
}
