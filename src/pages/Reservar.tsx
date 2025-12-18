import { useEffect, useMemo, useState } from "react";
import { crearReserva, obtenerDisponibilidad, type MesaDisponibilidadDto } from "../api/reservas.api";
import { listarTurnosDia, type TurnoDia } from "../api/turnos.api";
import { useAuthStore } from "../auth/auth.store";
import { parseApiError } from "../api/api-error";

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
    } catch (err: any) {
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
    } catch (err: any) {
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
    } catch (e: any) {
      const { message } = parseApiError(e, "Error creando reserva");
      setMsg({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{ maxWidth: 760 }}>
      <h2>Nueva reserva</h2>
      <p className="sub">Elegí fecha, turno y una mesa disponible.</p>

      <form onSubmit={submit} className="form" style={{ gap: 14 }}>
        <div className="row" style={{ flexWrap: "wrap", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="label">Fecha</label>
            <input
              className="input"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label className="label">Turno</label>
            <select
              className="input"
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
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label className="label">Mesa</label>
            <select
              className="input"
              value={mesaId ?? ""}
              onChange={(e) => setMesaId(e.target.value ? Number(e.target.value) : null)}
              disabled={!turnoDiaId || loadingDisponibilidad || mesasLibres.length === 0}
              required
            >
              <option value="">Seleccionar</option>
              {mesasLibres.map((m) => (
                <option key={m.id} value={m.id}>
                  Mesa {m.numero} · Capacidad {m.capacidad}
                </option>
              ))}
            </select>
            {loadingDisponibilidad && <p className="hint">Cargando disponibilidad...</p>}
            {!loadingDisponibilidad && turnoDiaId && mesasLibres.length === 0 && (
              <p className="hint">No hay mesas libres para este turno.</p>
            )}
          </div>
        </div>

        {turnoSeleccionado && mesaId && (
          <div className="card" style={{ background: "rgba(17,26,46,.6)", border: "1px solid var(--border)" }}>
            <strong>Resumen</strong>
            <p className="hint" style={{ marginTop: 6 }}>
              Fecha: {fecha} · Turno: {turnoSeleccionado.horaInicio} - {turnoSeleccionado.horaFin} ({turnoSeleccionado.diaSemana}) · Mesa ID {mesaId}
            </p>
          </div>
        )}

        <div className="row" style={{ gap: 10 }}>
          <button className="btn primary" disabled={loading || !mesaId || !turnoDiaId}>
            {loading ? "Creando..." : "Crear reserva"}
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setTurnoDiaId(null);
              setMesaId(null);
              setDisponibilidad([]);
              setMsg(null);
            }}
          >
            Reset
          </button>
        </div>

        {mesasOcupadas.length > 0 && (
          <div className="hint">Mesas ocupadas en este turno: {mesasOcupadas.map((m) => m.numero).join(", ")}</div>
        )}

        {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}
      </form>
    </section>
  );
}
