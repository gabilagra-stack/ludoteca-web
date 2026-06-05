import { useEffect, useState } from "react";
import { cancelarReserva, listarMisReservas } from "../api/reservas.api";
import type { ReservaResponseDto } from "../api/reservas.api";
import { parseApiError } from "../api/api-error";

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function statusClass(estado: string) {
  return estado.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function StatusIcon({ estado }: { estado: string }) {
  if (estado === "ACTIVO") return <CheckIcon />;
  if (estado === "CANCELADO") return <XIcon />;
  return <CalendarIcon />;
}

export default function MisReservas() {
  const [data, setData] = useState<ReservaResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function load() {
    setMsg(null);
    setLoading(true);
    try {
      const res = await listarMisReservas();
      setData(res);
    } catch (e: unknown) {
      const { message } = parseApiError(e, "Error cargando reservas");
      setMsg({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function cancelar(id: number) {
    if (!confirm(`¿Cancelar la reserva #${id}?`)) return;
    try {
      await cancelarReserva(id);
      setMsg({ type: "success", text: `Reserva #${id} cancelada` });
      await load();
    } catch (e: unknown) {
      const { message } = parseApiError(e, "Error cancelando");
      setMsg({ type: "error", text: message });
    }
  }

  return (
    <section className="my-reservations-page">
      <div className="my-reservations-shell">
        <header className="games-heading my-reservations-heading">
          <div className="board-page-title my-reservations-title">
            <span className="title-icon">🎲</span>
            <h1>Mis reservas</h1>
            <span className="title-icon">🎲</span>
          </div>
          <p>Listado de tus reservas activas y pasadas.</p>
        </header>

        {msg && <div className={`alert ${msg.type} my-reservations-alert`}>{msg.text}</div>}

        <div className="my-reservations-panel">
          {loading ? (
            <p className="my-reservations-state">Cargando...</p>
          ) : data.length === 0 ? (
            <p className="my-reservations-state">No tenés reservas.</p>
          ) : (
            <ul className="my-reservations-list">
              {data.map((reserva) => {
                const canCancel = reserva.estado !== "CANCELADO";
                return (
                  <li key={reserva.id} className="my-reservation-row">
                    <span className="my-reservation-icon">
                      <CalendarIcon />
                    </span>
                    <strong className="my-reservation-id">#{reserva.id}</strong>
                    <span className="my-reservation-dot" aria-hidden="true" />
                    <span className="my-reservation-table">Mesa {reserva.numeroMesa}</span>
                    <span className="my-reservation-dot" aria-hidden="true" />
                    <span className="my-reservation-time">
                      {reserva.fechaTurno} {reserva.horaInicio}-{reserva.horaFin}
                    </span>
                    <span className={`my-reservation-status status-${statusClass(reserva.estado)}`}>
                      <StatusIcon estado={reserva.estado} />
                      {reserva.estado}
                    </span>
                    {canCancel && (
                      <button className="my-reservation-cancel" onClick={() => cancelar(reserva.id)}>
                        <XIcon />
                        Cancelar
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
