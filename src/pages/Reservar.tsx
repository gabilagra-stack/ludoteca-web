import { useEffect, useMemo, useState } from "react";
import { crearReserva, obtenerDisponibilidad, type MesaDisponibilidadDto } from "../api/reservas.api";
import { listarTurnosDia, type TurnoDia } from "../api/turnos.api";
import { useAuthStore } from "../auth/auth.store";
import { parseApiError } from "../api/api-error";

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 8a7 7 0 1 0 1 5" />
      <path d="M19 4v4h-4" />
    </svg>
  );
}

export default function Reservar() {
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [turnos, setTurnos] = useState<TurnoDia[]>([]);
  const [turnoDiaId, setTurnoDiaId] = useState<number | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<MesaDisponibilidadDto[]>([]);
  const [mesaId, setMesaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const user = useAuthStore((s) => s.user);

  const turnoSeleccionado = useMemo(() => turnos.find((t) => t.id === turnoDiaId), [turnos, turnoDiaId]);
  const mesasLibres = useMemo(() => disponibilidad.filter((m) => m.disponible), [disponibilidad]);
  const mesasOcupadas = useMemo(() => disponibilidad.filter((m) => !m.disponible), [disponibilidad]);

  async function cargarTurnos(selectedDate: string) {
    setTurnos([]);
    setTurnoDiaId(null);
    setDisponibilidad([]);
    setMesaId(null);
    setMsg(null);
    try {
      const data = await listarTurnosDia({ fecha: selectedDate });
      setTurnos(data);
    } catch (err: unknown) {
      const { message } = parseApiError(err, "No se pudieron cargar los turnos");
      setMsg({ type: "error", text: message });
    }
  }

  async function cargarDisponibilidad(fechaSeleccionada: string, turnoId: number) {
    setLoadingDisponibilidad(true);
    setDisponibilidad([]);
    setMesaId(null);
    setMsg(null);
    try {
      const resp = await obtenerDisponibilidad(fechaSeleccionada, turnoId);
      setDisponibilidad(resp.mesas);
    } catch (err: unknown) {
      const { message } = parseApiError(err, "No se pudo obtener disponibilidad");
      setMsg({ type: "error", text: message });
    } finally {
      setLoadingDisponibilidad(false);
    }
  }

  useEffect(() => {
    cargarTurnos(fecha);
  }, [fecha]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!mesaId || !turnoDiaId) {
      setMsg({ type: "error", text: "Selecciona fecha, turno y mesa." });
      return;
    }
    setLoading(true);
    try {
      const res = await crearReserva({ mesaId, turnoDiaId, usuarioId: user?.id });
      setMsg({ type: "success", text: `Reserva #${res.id} creada (${res.estado}).` });
    } catch (e: unknown) {
      const { message } = parseApiError(e, "Error creando reserva");
      setMsg({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="reservation-page">
      <div className="reservation-shell">
        <header className="games-heading reservation-heading">
          <div className="board-page-title reservation-title">
            <span className="title-icon">🎲</span>
            <h1>Nueva reserva</h1>
            <span className="title-icon">🎲</span>
          </div>
          <p>Elegí fecha, turno y una mesa disponible.</p>
        </header>

        <form onSubmit={submit} className="reservation-panel">
          <label className="games-field reservation-field">
            <span>Fecha</span>
            <input
              className="games-input reservation-input"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </label>

          <label className="games-field reservation-field">
            <span>Turno</span>
            <select
              className="games-input reservation-input"
              value={turnoDiaId ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setTurnoDiaId(id || null);
                if (id) cargarDisponibilidad(fecha, id);
              }}
              disabled={turnos.length === 0}
              required
            >
              <option value="">Seleccionar</option>
              {turnos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.horaInicio} - {t.horaFin} ({t.diaSemana})
                </option>
              ))}
            </select>
          </label>

          <label className="games-field reservation-field reservation-field-wide">
            <span>Mesa</span>
            <select
              className="games-input reservation-input"
              value={mesaId ?? ""}
              onChange={(e) => setMesaId(e.target.value ? Number(e.target.value) : null)}
              disabled={!turnoDiaId || loadingDisponibilidad || mesasLibres.length === 0}
              required
            >
              <option value="">Seleccionar</option>
              {mesasLibres.map((m) => (
                <option key={m.id} value={m.id}>
                  Mesa {m.numero} - Capacidad {m.capacidad}
                </option>
              ))}
            </select>
            {loadingDisponibilidad && <p className="reservation-hint">Cargando disponibilidad...</p>}
            {!loadingDisponibilidad && turnoDiaId && mesasLibres.length === 0 && (
              <p className="reservation-hint">No hay mesas libres para este turno.</p>
            )}
          </label>

          <div className="reservation-actions">
            <button className="games-action primary reservation-action" disabled={loading || !mesaId || !turnoDiaId}>
              <CalendarIcon />
              {loading ? "Creando..." : "Crear reserva"}
            </button>
            <button
              type="button"
              className="games-action ghost reservation-action"
              onClick={() => {
                setTurnoDiaId(null);
                setMesaId(null);
                setDisponibilidad([]);
                setMsg(null);
              }}
            >
              <ResetIcon />
              Reset
            </button>
          </div>

          {turnoSeleccionado && mesaId && (
            <div className="reservation-summary">
              <strong>Resumen</strong>
              <p>
                Fecha: {fecha} - Turno: {turnoSeleccionado.horaInicio} - {turnoSeleccionado.horaFin} ({turnoSeleccionado.diaSemana}) - Mesa ID {mesaId}
              </p>
            </div>
          )}

          {mesasOcupadas.length > 0 && (
            <div className="reservation-hint reservation-field-wide">
              Mesas ocupadas en este turno: {mesasOcupadas.map((m) => m.numero).join(", ")}
            </div>
          )}

          {msg && <div className={`alert ${msg.type} reservation-alert`}>{msg.text}</div>}
        </form>
      </div>
    </section>
  );
}
