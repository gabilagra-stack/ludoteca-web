import { useEffect, useState } from "react";
import { eliminarUsuario, listarUsuarios, type Usuario } from "../api/usuarios.api";
import { crearMesa, eliminarMesa, listarMesas, type Mesa } from "../api/mesas.api";
import {
  listarHorarios,
  listarTurnosDia,
  crearTurnoHorario,
  crearTurnoDia,
  eliminarTurnoHorario,
  eliminarTurnoDia,
  type TurnoHorario,
  type TurnoDia,
} from "../api/turnos.api";
import { listarReservasAdmin, cancelarReserva, type ReservaResponseDto } from "../api/reservas.api";
import {
  listarJuegosParaJugar,
  listarJuegosParaVender,
  crearJuegoParaJugar,
  crearJuegoParaVender,
  eliminarJuegoParaJugar,
  eliminarJuegoParaVender,
  type JuegoParaJugar,
  type JuegoParaVender,
} from "../api/juegos.api";
import { parseApiError } from "../api/api-error";

type FiltrosUsuarios = { nombre: string; email: string; rol: string };
type FiltrosMesas = { numero: string; capacidad: string };
type Vista = "menu" | "usuarios" | "mesas" | "turnos" | "juegos" | "reservas";

type AdminMenuItem = {
  vista: Exclude<Vista, "menu">;
  title: string;
  description: string;
  icon: "usuarios" | "mesas" | "turnos" | "juegos" | "reservas";
};

const adminMenuItems: AdminMenuItem[] = [
  { vista: "usuarios", title: "Usuarios", description: "Alta, baja y filtros por rol.", icon: "usuarios" },
  { vista: "mesas", title: "Mesas", description: "Configurar mesas y capacidad.", icon: "mesas" },
  { vista: "turnos", title: "Turnos", description: "Horarios y turnos por fecha.", icon: "turnos" },
  { vista: "juegos", title: "Juegos", description: "Catalogo para jugar y vender.", icon: "juegos" },
  { vista: "reservas", title: "Reservas", description: "Consultar y cancelar reservas.", icon: "reservas" },
];

function AdminMenuIcon({ type }: { type: AdminMenuItem["icon"] }) {
  if (type === "usuarios") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="8" r="4" />
        <circle cx="17" cy="9" r="3" />
        <path d="M2 21a7 7 0 0 1 14 0Z" />
        <path d="M14 21a6 6 0 0 0-3-5.2A6 6 0 0 1 22 21Z" />
      </svg>
    );
  }

  if (type === "mesas") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="7" rx="8" ry="3" fill="currentColor" stroke="currentColor" />
        <path d="M4 7v8" />
        <path d="M20 7v8" />
        <path d="M8 9v9" />
        <path d="M16 9v9" />
      </svg>
    );
  }

  if (type === "turnos") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </svg>
    );
  }

  if (type === "juegos") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.2" fill="#111" />
        <circle cx="15.5" cy="8.5" r="1.2" fill="#111" />
        <circle cx="12" cy="12" r="1.2" fill="#111" />
        <circle cx="8.5" cy="15.5" r="1.2" fill="#111" />
        <circle cx="15.5" cy="15.5" r="1.2" fill="#111" />
      </svg>
    );
  }

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
      <path d="M16 18h.01" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 8a7 7 0 1 0 1 5" />
      <path d="M19 4v4h-4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="14" x="3" y="5" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 5h18l-7 8v5l-4 2v-7Z" />
    </svg>
  );
}

function BroomIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m7 21-5-5L14 4l7 7-10 10Z" />
      <path d="M12 6l6 6" />
      <path d="M7 21h10" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="m19 6-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function RoleIcon({ role }: { role: string }) {
  return role === "ADMIN" ? <ShieldIcon /> : <UserIcon />;
}

export default function AdminPanel() {
  const [vista, setVista] = useState<Vista>("menu");

  // Usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState<string | null>(null);
  const [filtrosUsuarios, setFiltrosUsuarios] = useState<FiltrosUsuarios>({ nombre: "", email: "", rol: "" });
  const [eliminandoUsuario, setEliminandoUsuario] = useState<number | null>(null);

  // Mesas
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loadingMesas, setLoadingMesas] = useState(false);
  const [errorMesas, setErrorMesas] = useState<string | null>(null);
  const [filtrosMesas, setFiltrosMesas] = useState<FiltrosMesas>({ numero: "", capacidad: "" });
  const [creandoMesa, setCreandoMesa] = useState(false);
  const [nuevaMesa, setNuevaMesa] = useState<{ numero: string; capacidad: string }>({ numero: "", capacidad: "" });
  const [eliminandoMesa, setEliminandoMesa] = useState<number | null>(null);

  // Turnos
  const [vistaTurnoTab, setVistaTurnoTab] = useState<"horarios" | "dias">("horarios");
  const [horarios, setHorarios] = useState<TurnoHorario[]>([]);
  const [turnosDia, setTurnosDia] = useState<TurnoDia[]>([]);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [errorTurnos, setErrorTurnos] = useState<string | null>(null);
  const [nuevoHorario, setNuevoHorario] = useState<{ horaInicio: string; horaFin: string }>({ horaInicio: "", horaFin: "" });
  const [nuevoTurnoDia, setNuevoTurnoDia] = useState<{ fecha: string; diaSemana: string; turnoHorarioId: string }>({
    fecha: "",
    diaSemana: "",
    turnoHorarioId: "",
  });
  const [filtroTurnoDia, setFiltroTurnoDia] = useState<{ fecha: string; diaSemana: string }>({ fecha: "", diaSemana: "" });
  const [eliminandoTurnoId, setEliminandoTurnoId] = useState<{ tipo: "horario" | "dia"; id: number } | null>(null);

  // Juegos
  const [vistaJuegoTab, setVistaJuegoTab] = useState<"jugar" | "vender">("jugar");
  const [juegosJugar, setJuegosJugar] = useState<JuegoParaJugar[]>([]);
  const [juegosVender, setJuegosVender] = useState<JuegoParaVender[]>([]);
  const [loadingJuegos, setLoadingJuegos] = useState(false);
  const [errorJuegos, setErrorJuegos] = useState<string | null>(null);
  const [filtrosJugar, setFiltrosJugar] = useState<{ nombre: string; categoria: string; dificultad: string; jugadoresMax: string }>({
    nombre: "",
    categoria: "",
    dificultad: "",
    jugadoresMax: "",
  });
  const [filtrosVender, setFiltrosVender] = useState<{ nombre: string; categoria: string; dificultad: string; jugadoresMax: string; stock: string }>({
    nombre: "",
    categoria: "",
    dificultad: "",
    jugadoresMax: "",
    stock: "",
  });
  const [nuevoJuegoJugar, setNuevoJuegoJugar] = useState({
    nombre: "",
    descripcion: "",
    imagenUrl: "",
    numeroMaximo: "",
    dificultad: "",
    categoria: "",
    duracionAproximada: "",
    cantidadDisponible: "",
  });
  const [nuevoJuegoVender, setNuevoJuegoVender] = useState({
    nombre: "",
    descripcion: "",
    imagenUrl: "",
    numeroMaximo: "",
    dificultad: "",
    categoria: "",
    duracionAproximada: "",
    precio: "",
    stock: "",
  });
  const [eliminandoJuego, setEliminandoJuego] = useState<{ tipo: "jugar" | "vender"; id: number } | null>(null);

  // Reservas
  const [reservas, setReservas] = useState<ReservaResponseDto[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [errorReservas, setErrorReservas] = useState<string | null>(null);
  const [filtrosReservas, setFiltrosReservas] = useState<{ nombreUsuario: string; numeroMesa: string; fechaTurno: string; diaSemana: string }>({
    nombreUsuario: "",
    numeroMesa: "",
    fechaTurno: "",
    diaSemana: "",
  });
  const [eliminandoReserva, setEliminandoReserva] = useState<number | null>(null);

  async function fetchUsuarios() {
    setLoadingUsuarios(true);
    setErrorUsuarios(null);
    try {
      const data = await listarUsuarios({
        nombre: filtrosUsuarios.nombre || undefined,
        email: filtrosUsuarios.email || undefined,
        rol: filtrosUsuarios.rol || undefined,
      });
      setUsuarios(data);
    } catch (e: any) {
      const { message } = parseApiError(e, "No se pudieron cargar los usuarios");
      setErrorUsuarios(message);
    } finally {
      setLoadingUsuarios(false);
    }
  }

  async function fetchMesas() {
    setLoadingMesas(true);
    setErrorMesas(null);
    try {
      const data = await listarMesas({
        numero: filtrosMesas.numero ? Number(filtrosMesas.numero) : undefined,
        capacidad: filtrosMesas.capacidad ? Number(filtrosMesas.capacidad) : undefined,
      });
      setMesas(data);
    } catch (e: any) {
      const { message } = parseApiError(e, "No se pudieron cargar las mesas");
      setErrorMesas(message);
    } finally {
      setLoadingMesas(false);
    }
  }

  async function fetchTurnos() {
    setLoadingTurnos(true);
    setErrorTurnos(null);
    try {
      if (vistaTurnoTab === "horarios") {
        const data = await listarHorarios();
        setHorarios(data);
      } else {
        const data = await listarTurnosDia({
          fecha: filtroTurnoDia.fecha || undefined,
          diaSemana: filtroTurnoDia.diaSemana || undefined,
        });
        setTurnosDia(data);
      }
    } catch (e: any) {
      const { message } = parseApiError(e, "No se pudieron cargar los turnos");
      setErrorTurnos(message);
    } finally {
      setLoadingTurnos(false);
    }
  }

  async function fetchReservas() {
    setLoadingReservas(true);
    setErrorReservas(null);
    try {
      const data = await listarReservasAdmin({
        nombreUsuario: filtrosReservas.nombreUsuario || undefined,
        numeroMesa: filtrosReservas.numeroMesa ? Number(filtrosReservas.numeroMesa) : undefined,
        fechaTurno: filtrosReservas.fechaTurno || undefined,
        diaSemana: filtrosReservas.diaSemana || undefined,
      });
      setReservas(data);
    } catch (e: any) {
      const { message } = parseApiError(e, "No se pudieron cargar las reservas");
      setErrorReservas(message);
    } finally {
      setLoadingReservas(false);
    }
  }

  async function fetchJuegos() {
    setLoadingJuegos(true);
    setErrorJuegos(null);
    try {
      if (vistaJuegoTab === "jugar") {
        const data = await listarJuegosParaJugar({
          nombre: filtrosJugar.nombre || undefined,
          categoria: filtrosJugar.categoria || undefined,
          dificultad: filtrosJugar.dificultad || undefined,
          jugadoresMax: filtrosJugar.jugadoresMax ? Number(filtrosJugar.jugadoresMax) : undefined,
        });
        setJuegosJugar(data);
      } else {
        const data = await listarJuegosParaVender({
          nombre: filtrosVender.nombre || undefined,
          categoria: filtrosVender.categoria || undefined,
          dificultad: filtrosVender.dificultad || undefined,
          jugadoresMax: filtrosVender.jugadoresMax ? Number(filtrosVender.jugadoresMax) : undefined,
          stock: filtrosVender.stock ? Number(filtrosVender.stock) : undefined,
        });
        setJuegosVender(data);
      }
    } catch (e: any) {
      const { message } = parseApiError(e, "No se pudieron cargar los juegos");
      setErrorJuegos(message);
    } finally {
      setLoadingJuegos(false);
    }
  }

  useEffect(() => {
    if (vista === "usuarios") fetchUsuarios();
    if (vista === "mesas") fetchMesas();
    if (vista === "turnos") fetchTurnos();
    if (vista === "juegos") fetchJuegos();
    if (vista === "reservas") fetchReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vista]);

  async function handleEliminarUsuario(id: number) {
    const confirmar = window.confirm("Eliminar usuario? Esta accion no se puede deshacer.");
    if (!confirmar) return;
    setEliminandoUsuario(id);
    try {
      await eliminarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (e: any) {
      const { message } = parseApiError(e, "No se pudo eliminar el usuario");
      setErrorUsuarios(message);
    } finally {
      setEliminandoUsuario(null);
    }
  }

  async function handleCrearMesa(e: React.FormEvent) {
    e.preventDefault();
    setErrorMesas(null);
    setCreandoMesa(true);
    try {
      const mesaCreada = await crearMesa({
        numero: Number(nuevaMesa.numero),
        capacidad: Number(nuevaMesa.capacidad),
      });
      setNuevaMesa({ numero: "", capacidad: "" });
      setMesas((prev) => [mesaCreada, ...prev]);
    } catch (err: any) {
      const { message } = parseApiError(err, "No se pudo crear la mesa");
      setErrorMesas(message);
    } finally {
      setCreandoMesa(false);
    }
  }

  async function handleEliminarMesa(id: number) {
    const confirmar = window.confirm("Eliminar mesa? Esta accion no se puede deshacer.");
    if (!confirmar) return;
    setEliminandoMesa(id);
    try {
      await eliminarMesa(id);
      setMesas((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      const { message } = parseApiError(err, "No se pudo eliminar la mesa");
      setErrorMesas(message);
    } finally {
      setEliminandoMesa(null);
    }
  }

  async function handleCrearJuegoJugar(e: React.FormEvent) {
    e.preventDefault();
    setErrorJuegos(null);
    setLoadingJuegos(true);
    try {
      const creado = await crearJuegoParaJugar({
        ...nuevoJuegoJugar,
        numeroMaximo: Number(nuevoJuegoJugar.numeroMaximo),
        cantidadDisponible: Number(nuevoJuegoJugar.cantidadDisponible),
      } as unknown as Omit<JuegoParaJugar, "id">);
      setNuevoJuegoJugar({
        nombre: "",
        descripcion: "",
        imagenUrl: "",
        numeroMaximo: "",
        dificultad: "",
        categoria: "",
        duracionAproximada: "",
        cantidadDisponible: "",
      });
      setJuegosJugar((prev) => [creado, ...prev]);
      setVistaJuegoTab("jugar");
    } catch (err: any) {
      const { message } = parseApiError(err, "No se pudo crear el juego");
      setErrorJuegos(message);
    } finally {
      setLoadingJuegos(false);
    }
  }

  async function handleCrearJuegoVender(e: React.FormEvent) {
    e.preventDefault();
    setErrorJuegos(null);
    setLoadingJuegos(true);
    try {
      const creado = await crearJuegoParaVender({
        ...nuevoJuegoVender,
        numeroMaximo: Number(nuevoJuegoVender.numeroMaximo),
        precio: Number(nuevoJuegoVender.precio),
        stock: Number(nuevoJuegoVender.stock),
      } as unknown as Omit<JuegoParaVender, "id">);
      setNuevoJuegoVender({
        nombre: "",
        descripcion: "",
        imagenUrl: "",
        numeroMaximo: "",
        dificultad: "",
        categoria: "",
        duracionAproximada: "",
        precio: "",
        stock: "",
      });
      setJuegosVender((prev) => [creado, ...prev]);
      setVistaJuegoTab("vender");
    } catch (err: any) {
      const { message } = parseApiError(err, "No se pudo crear el juego");
      setErrorJuegos(message);
    } finally {
      setLoadingJuegos(false);
    }
  }

  async function handleEliminarJuego(tipo: "jugar" | "vender", id: number) {
    const confirmar = window.confirm("Eliminar juego? Esta accion no se puede deshacer.");
    if (!confirmar) return;
    setEliminandoJuego({ tipo, id });
    try {
      if (tipo === "jugar") {
        await eliminarJuegoParaJugar(id);
        setJuegosJugar((prev) => prev.filter((j) => j.id !== id));
      } else {
        await eliminarJuegoParaVender(id);
        setJuegosVender((prev) => prev.filter((j) => j.id !== id));
      }
    } catch (err: any) {
      const { message } = parseApiError(err, "No se pudo eliminar el juego");
      setErrorJuegos(message);
    } finally {
      setEliminandoJuego(null);
    }
  }

  async function handleCancelarReserva(id: number) {
    const confirmar = window.confirm("Cancelar la reserva? Esta accion no se puede deshacer.");
    if (!confirmar) return;
    setEliminandoReserva(id);
    try {
      await cancelarReserva(id);
      setReservas((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      const { message } = parseApiError(err, "No se pudo cancelar la reserva");
      setErrorReservas(message);
    } finally {
      setEliminandoReserva(null);
    }
  }

  async function handleCrearTurnoHorario(e: React.FormEvent) {
    e.preventDefault();
    setErrorTurnos(null);
    setLoadingTurnos(true);
    try {
      const nuevo = await crearTurnoHorario({ ...nuevoHorario });
      setNuevoHorario({ horaInicio: "", horaFin: "" });
      setHorarios((prev) => [nuevo, ...prev]);
      setVistaTurnoTab("horarios");
    } catch (err: any) {
      const { message } = parseApiError(err, "No se pudo crear el turno horario");
      setErrorTurnos(message);
    } finally {
      setLoadingTurnos(false);
    }
  }

  async function handleCrearTurnoDia(e: React.FormEvent) {
    e.preventDefault();
    setErrorTurnos(null);
    setLoadingTurnos(true);
    try {
      const nuevo = await crearTurnoDia({
        fecha: nuevoTurnoDia.fecha,
        diaSemana: nuevoTurnoDia.diaSemana,
        turnoHorarioId: Number(nuevoTurnoDia.turnoHorarioId),
      });
      setNuevoTurnoDia({ fecha: "", diaSemana: "", turnoHorarioId: "" });
      setTurnosDia((prev) => [nuevo, ...prev]);
      setVistaTurnoTab("dias");
    } catch (err: any) {
      const { message } = parseApiError(err, "No se pudo crear el turno dia");
      setErrorTurnos(message);
    } finally {
      setLoadingTurnos(false);
    }
  }

  async function handleEliminarTurno(tipo: "horario" | "dia", id: number) {
    const confirmar = window.confirm("Eliminar? Esta accion no se puede deshacer.");
    if (!confirmar) return;
    setEliminandoTurnoId({ tipo, id });
    try {
      if (tipo === "horario") {
        await eliminarTurnoHorario(id);
        setHorarios((prev) => prev.filter((h) => h.id !== id));
      } else {
        await eliminarTurnoDia(id);
        setTurnosDia((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err: any) {
      const { message } = parseApiError(err, "No se pudo eliminar");
      setErrorTurnos(message);
    } finally {
      setEliminandoTurnoId(null);
    }
  }

  if (vista === "menu") {
    return (
      <section className="admin-menu-page">
        <div className="admin-menu-shell">
          <header className="games-heading admin-menu-heading">
            <div className="board-page-title admin-menu-title">
              <span className="title-icon">🎲</span>
              <h1>Panel de administración</h1>
              <span className="title-icon">🎲</span>
            </div>
            <p>Elegí una sección para gestionar.</p>
          </header>

          <div className="admin-menu-panel">
            {adminMenuItems.map((item) => (
              <article key={item.vista} className="admin-menu-row">
                <span className="admin-menu-icon">
                  <AdminMenuIcon type={item.icon} />
                </span>
                <div className="admin-menu-copy">
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </div>
                <button className="admin-menu-action" onClick={() => setVista(item.vista)}>
                  Abrir
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (vista === "usuarios") {
    return (
      <section className="admin-users-page">
        <div className="admin-users-shell">
          <header className="games-heading admin-users-heading">
            <div className="board-page-title admin-users-title">
              <span className="title-icon">🎲</span>
              <h1>Gestión de usuarios</h1>
              <span className="title-icon">🎲</span>
            </div>
            <p>Acceso restringido a ADMIN.</p>
          </header>

          <div className="admin-users-panel">
            <div className="admin-users-toolbar">
              <button className="admin-users-back" onClick={() => setVista("menu")}>
                <BackIcon />
                Volver
              </button>
              <button className="admin-users-refresh" onClick={fetchUsuarios} disabled={loadingUsuarios}>
                <RefreshIcon />
                {loadingUsuarios ? "Actualizando..." : "Refrescar"}
              </button>
            </div>

            <div className="admin-users-filters">
              <label className="admin-users-field">
                <span>Nombre</span>
                <div className="admin-users-input-wrap">
                  <UserIcon />
                  <input
                    className="admin-users-input"
                    placeholder="Buscar por nombre"
                    value={filtrosUsuarios.nombre}
                    onChange={(e) => setFiltrosUsuarios((f) => ({ ...f, nombre: e.target.value }))}
                  />
                </div>
              </label>

              <label className="admin-users-field">
                <span>Email</span>
                <div className="admin-users-input-wrap">
                  <MailIcon />
                  <input
                    className="admin-users-input"
                    placeholder="Buscar por email"
                    value={filtrosUsuarios.email}
                    onChange={(e) => setFiltrosUsuarios((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </label>

              <label className="admin-users-field">
                <span>Rol</span>
                <div className="admin-users-input-wrap">
                  <ShieldIcon />
                  <select
                    className="admin-users-input"
                    value={filtrosUsuarios.rol}
                    onChange={(e) => setFiltrosUsuarios((f) => ({ ...f, rol: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                  </select>
                </div>
              </label>

              <div className="admin-users-filter-actions">
                <button className="admin-users-apply" onClick={fetchUsuarios} disabled={loadingUsuarios}>
                  <FilterIcon />
                  {loadingUsuarios ? "Buscando..." : "Aplicar filtros"}
                </button>
                <button
                  className="admin-users-clear"
                  type="button"
                  onClick={() => {
                    setFiltrosUsuarios({ nombre: "", email: "", rol: "" });
                    setTimeout(fetchUsuarios, 0);
                  }}
                >
                  <BroomIcon />
                  Limpiar
                </button>
              </div>
            </div>

            {errorUsuarios && <div className="alert error admin-users-alert">{errorUsuarios}</div>}

            <div className="admin-users-table-wrap">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`admin-users-role role-${u.rol.toLowerCase()}`}>
                          <RoleIcon role={u.rol} />
                          {u.rol}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-users-delete"
                          onClick={() => handleEliminarUsuario(u.id)}
                          disabled={eliminandoUsuario === u.id}
                        >
                          <TrashIcon />
                          {eliminandoUsuario === u.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loadingUsuarios && usuarios.length === 0 && (
                    <tr>
                      <td colSpan={5} className="admin-users-state">
                        Sin resultados
                      </td>
                    </tr>
                  )}
                  {loadingUsuarios && (
                    <tr>
                      <td colSpan={5} className="admin-users-state">
                        Cargando...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (vista === "mesas") {
    return (
    <section className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn ghost" onClick={() => setVista("menu")}>{"<"}- Volver</button>
          <div>
            <h2 style={{ margin: 0 }}>Mesas</h2>
            <p className="sub" style={{ margin: 0 }}>Gestiona mesas y capacidad.</p>
          </div>
        </div>
        <button className="btn ghost" onClick={fetchMesas} disabled={loadingMesas}>
          {loadingMesas ? "Actualizando..." : "Refrescar"}
        </button>
      </div>

      <form onSubmit={handleCrearMesa} className="row" style={{ marginTop: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label className="label">Numero</label>
          <input
            className="input"
            type="number"
            min={1}
            placeholder="Ej: 5"
            value={nuevaMesa.numero}
            onChange={(e) => setNuevaMesa((m) => ({ ...m, numero: e.target.value }))}
            required
          />
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label className="label">Capacidad</label>
          <input
            className="input"
            type="number"
            min={1}
            placeholder="Ej: 4"
            value={nuevaMesa.capacidad}
            onChange={(e) => setNuevaMesa((m) => ({ ...m, capacidad: e.target.value }))}
            required
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn primary" type="submit" disabled={creandoMesa}>
            {creandoMesa ? "Creando..." : "Crear mesa"}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => setNuevaMesa({ numero: "", capacidad: "" })}
          >
            Limpiar
          </button>
        </div>
      </form>

      <div className="row" style={{ marginTop: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label className="label">Numero</label>
          <input
            className="input"
            type="number"
            placeholder="Filtrar por numero"
            value={filtrosMesas.numero}
            onChange={(e) => setFiltrosMesas((f) => ({ ...f, numero: e.target.value }))}
          />
        </div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <label className="label">Capacidad</label>
          <input
            className="input"
            type="number"
            placeholder="Filtrar por capacidad"
            value={filtrosMesas.capacidad}
            onChange={(e) => setFiltrosMesas((f) => ({ ...f, capacidad: e.target.value }))}
          />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          <button className="btn primary" type="button" onClick={fetchMesas} disabled={loadingMesas}>
            {loadingMesas ? "Buscando..." : "Aplicar filtros"}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setFiltrosMesas({ numero: "", capacidad: "" });
              setTimeout(fetchMesas, 0);
            }}
          >
            Limpiar
          </button>
        </div>
      </div>

      {errorMesas && <div className="alert error" style={{ marginTop: 12 }}>{errorMesas}</div>}

      <div style={{ marginTop: 16, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["ID", "Numero", "Capacidad", "Disponible", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "10px 8px", borderBottom: "1px solid var(--border)", color: "var(--muted)", fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mesas.map((m) => (
              <tr key={m.id}>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>{m.id}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>{m.numero}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>{m.capacidad}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>
                  {m.disponible ? "Si" : "No"}
                </td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>
                  <button
                    className="btn danger"
                    onClick={() => handleEliminarMesa(m.id)}
                    disabled={eliminandoMesa === m.id}
                  >
                    {eliminandoMesa === m.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
            {!loadingMesas && mesas.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "12px 8px", color: "var(--muted)" }}>
                  Sin resultados
                </td>
              </tr>
            )}
            {loadingMesas && (
              <tr>
                <td colSpan={5} style={{ padding: "12px 8px", color: "var(--muted)" }}>
                  Cargando...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
    );
  }

  if (vista === "juegos") {
    return (
      <section className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn ghost" onClick={() => setVista("menu")}>{"<"}- Volver</button>
            <div>
              <h2 style={{ margin: 0 }}>Juegos</h2>
              <p className="sub" style={{ margin: 0 }}>Catalogo para jugar o vender.</p>
            </div>
          </div>
          <button className="btn ghost" onClick={fetchJuegos} disabled={loadingJuegos}>
            {loadingJuegos ? "Actualizando..." : "Refrescar"}
          </button>
        </div>

        <div className="row" style={{ gap: 10, marginTop: 16, flexWrap: "wrap", borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
          <button
            className={`btn ${vistaJuegoTab === "jugar" ? "primary" : "ghost"}`}
            type="button"
            onClick={() => {
              setVistaJuegoTab("jugar");
              fetchJuegos();
            }}
          >
            Para jugar
          </button>
          <button
            className={`btn ${vistaJuegoTab === "vender" ? "primary" : "ghost"}`}
            type="button"
            onClick={() => {
              setVistaJuegoTab("vender");
              fetchJuegos();
            }}
          >
            Para vender
          </button>
        </div>

        {vistaJuegoTab === "jugar" ? (
          <>
            <div className="card" style={{ background: "rgba(17,26,46,.6)", border: "1px solid var(--border)", marginTop: 16, boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>
              <form onSubmit={handleCrearJuegoJugar} className="row" style={{ flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label className="label">Nombre</label>
                  <input className="input" value={nuevoJuegoJugar.nombre} onChange={(e) => setNuevoJuegoJugar((v) => ({ ...v, nombre: e.target.value }))} required />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label className="label">Categoria</label>
                  <select className="input" value={nuevoJuegoJugar.categoria} onChange={(e) => setNuevoJuegoJugar((v) => ({ ...v, categoria: e.target.value }))}>
                    <option value="">Seleccionar</option>
                    {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label className="label">Dificultad</label>
                  <select className="input" value={nuevoJuegoJugar.dificultad} onChange={(e) => setNuevoJuegoJugar((v) => ({ ...v, dificultad: e.target.value }))}>
                    <option value="">Seleccionar</option>
                    {dificultades.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label className="label">Max jugadores</label>
                  <input className="input" type="number" min={1} value={nuevoJuegoJugar.numeroMaximo} onChange={(e) => setNuevoJuegoJugar((v) => ({ ...v, numeroMaximo: e.target.value }))} />
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label className="label">Disponibles</label>
                  <input className="input" type="number" min={0} value={nuevoJuegoJugar.cantidadDisponible} onChange={(e) => setNuevoJuegoJugar((v) => ({ ...v, cantidadDisponible: e.target.value }))} />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label className="label">Duración</label>
                  <input className="input" placeholder="Ej: 60-90 min" value={nuevoJuegoJugar.duracionAproximada} onChange={(e) => setNuevoJuegoJugar((v) => ({ ...v, duracionAproximada: e.target.value }))} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn primary" type="submit" disabled={loadingJuegos}>{loadingJuegos ? "Creando..." : "Crear juego"}</button>
                  <button className="btn ghost" type="button" onClick={() => setNuevoJuegoJugar({
                    nombre: "",
                    descripcion: "",
                    imagenUrl: "",
                    numeroMaximo: "",
                    dificultad: "",
                    categoria: "",
                    duracionAproximada: "",
                    cantidadDisponible: "",
                  })}>Limpiar</button>
                </div>
              </form>
            </div>

            <div className="row" style={{ marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label className="label">Nombre</label>
                <input className="input" value={filtrosJugar.nombre} onChange={(e) => setFiltrosJugar((f) => ({ ...f, nombre: e.target.value }))} />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label className="label">Categoria</label>
                <select className="input" value={filtrosJugar.categoria} onChange={(e) => setFiltrosJugar((f) => ({ ...f, categoria: e.target.value }))}>
                  <option value="">Todas</option>
                  {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label className="label">Dificultad</label>
                <select className="input" value={filtrosJugar.dificultad} onChange={(e) => setFiltrosJugar((f) => ({ ...f, dificultad: e.target.value }))}>
                  <option value="">Todas</option>
                  {dificultades.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label className="label">Jugadores max</label>
                <input className="input" type="number" min={1} value={filtrosJugar.jugadoresMax} onChange={(e) => setFiltrosJugar((f) => ({ ...f, jugadoresMax: e.target.value }))} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <button className="btn primary" type="button" onClick={fetchJuegos} disabled={loadingJuegos}>
                  {loadingJuegos ? "Buscando..." : "Aplicar filtros"}
                </button>
                <button className="btn ghost" type="button" onClick={() => { setFiltrosJugar({ nombre: "", categoria: "", dificultad: "", jugadoresMax: "" }); setTimeout(fetchJuegos, 0); }}>
                  Limpiar
                </button>
              </div>
            </div>

            {errorJuegos && <div className="alert error" style={{ marginTop: 12 }}>{errorJuegos}</div>}

            <div className="card" style={{ marginTop: 12, background: "rgba(17,26,46,.6)", border: "1px solid var(--border)", boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>
              <div className="list">
                {juegosJugar.map((j) => (
                  <div key={j.id} className="item" style={{ justifyContent: "space-between" }}>
                    <div>
                      <strong>{j.nombre}</strong>
                      <div className="hint">
                        {j.categoria || "Sin categoria"} · {j.dificultad || "Sin dificultad"} · Max {j.numeroMaximo || "-"} · {j.duracionAproximada || "Duración no indicada"}
                      </div>
                      <div className="hint">Disponibles: {j.cantidadDisponible ?? "-"}</div>
                    </div>
                    <button className="btn danger" onClick={() => handleEliminarJuego("jugar", j.id)} disabled={eliminandoJuego?.tipo === "jugar" && eliminandoJuego.id === j.id}>
                      {eliminandoJuego?.tipo === "jugar" && eliminandoJuego.id === j.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                ))}
                {!loadingJuegos && juegosJugar.length === 0 && (
                  <div className="item"><span className="hint">Sin juegos cargados</span></div>
                )}
                {loadingJuegos && (
                  <div className="item"><span className="hint">Cargando...</span></div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="card" style={{ background: "rgba(17,26,46,.6)", border: "1px solid var(--border)", marginTop: 16, boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>
              <form onSubmit={handleCrearJuegoVender} className="row" style={{ flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label className="label">Nombre</label>
                  <input className="input" value={nuevoJuegoVender.nombre} onChange={(e) => setNuevoJuegoVender((v) => ({ ...v, nombre: e.target.value }))} required />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label className="label">Categoria</label>
                  <select className="input" value={nuevoJuegoVender.categoria} onChange={(e) => setNuevoJuegoVender((v) => ({ ...v, categoria: e.target.value }))}>
                    <option value="">Seleccionar</option>
                    {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label className="label">Dificultad</label>
                  <select className="input" value={nuevoJuegoVender.dificultad} onChange={(e) => setNuevoJuegoVender((v) => ({ ...v, dificultad: e.target.value }))}>
                    <option value="">Seleccionar</option>
                    {dificultades.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label className="label">Max jugadores</label>
                  <input className="input" type="number" min={1} value={nuevoJuegoVender.numeroMaximo} onChange={(e) => setNuevoJuegoVender((v) => ({ ...v, numeroMaximo: e.target.value }))} />
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label className="label">Stock</label>
                  <input className="input" type="number" min={0} value={nuevoJuegoVender.stock} onChange={(e) => setNuevoJuegoVender((v) => ({ ...v, stock: e.target.value }))} />
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label className="label">Precio</label>
                  <input className="input" type="number" min={0} step="0.01" value={nuevoJuegoVender.precio} onChange={(e) => setNuevoJuegoVender((v) => ({ ...v, precio: e.target.value }))} />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label className="label">Duración</label>
                  <input className="input" placeholder="Ej: 60-90 min" value={nuevoJuegoVender.duracionAproximada} onChange={(e) => setNuevoJuegoVender((v) => ({ ...v, duracionAproximada: e.target.value }))} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn primary" type="submit" disabled={loadingJuegos}>{loadingJuegos ? "Creando..." : "Crear juego"}</button>
                  <button className="btn ghost" type="button" onClick={() => setNuevoJuegoVender({
                    nombre: "",
                    descripcion: "",
                    imagenUrl: "",
                    numeroMaximo: "",
                    dificultad: "",
                    categoria: "",
                    duracionAproximada: "",
                    precio: "",
                    stock: "",
                  })}>Limpiar</button>
                </div>
              </form>
            </div>

            <div className="row" style={{ marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label className="label">Nombre</label>
                <input className="input" value={filtrosVender.nombre} onChange={(e) => setFiltrosVender((f) => ({ ...f, nombre: e.target.value }))} />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <label className="label">Categoria</label>
                <select className="input" value={filtrosVender.categoria} onChange={(e) => setFiltrosVender((f) => ({ ...f, categoria: e.target.value }))}>
                  <option value="">Todas</option>
                  {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label className="label">Dificultad</label>
                <select className="input" value={filtrosVender.dificultad} onChange={(e) => setFiltrosVender((f) => ({ ...f, dificultad: e.target.value }))}>
                  <option value="">Todas</option>
                  {dificultades.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label className="label">Jugadores max</label>
                <input className="input" type="number" min={1} value={filtrosVender.jugadoresMax} onChange={(e) => setFiltrosVender((f) => ({ ...f, jugadoresMax: e.target.value }))} />
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label className="label">Stock minimo</label>
                <input className="input" type="number" min={0} value={filtrosVender.stock} onChange={(e) => setFiltrosVender((f) => ({ ...f, stock: e.target.value }))} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <button className="btn primary" type="button" onClick={fetchJuegos} disabled={loadingJuegos}>
                  {loadingJuegos ? "Buscando..." : "Aplicar filtros"}
                </button>
                <button className="btn ghost" type="button" onClick={() => { setFiltrosVender({ nombre: "", categoria: "", dificultad: "", jugadoresMax: "", stock: "" }); setTimeout(fetchJuegos, 0); }}>
                  Limpiar
                </button>
              </div>
            </div>

            {errorJuegos && <div className="alert error" style={{ marginTop: 12 }}>{errorJuegos}</div>}

            <div className="card" style={{ marginTop: 12, background: "rgba(17,26,46,.6)", border: "1px solid var(--border)", boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>
              <div className="list">
                {juegosVender.map((j) => (
                  <div key={j.id} className="item" style={{ justifyContent: "space-between" }}>
                    <div>
                      <strong>{j.nombre}</strong>
                      <div className="hint">
                        {j.categoria || "Sin categoria"} · {j.dificultad || "Sin dificultad"} · Max {j.numeroMaximo || "-"} · {j.duracionAproximada || "Duración no indicada"}
                      </div>
                      <div className="hint">Precio: {j.precio ?? "-"} · Stock: {j.stock ?? "-"}</div>
                    </div>
                    <button className="btn danger" onClick={() => handleEliminarJuego("vender", j.id)} disabled={eliminandoJuego?.tipo === "vender" && eliminandoJuego.id === j.id}>
                      {eliminandoJuego?.tipo === "vender" && eliminandoJuego.id === j.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                ))}
                {!loadingJuegos && juegosVender.length === 0 && (
                  <div className="item"><span className="hint">Sin juegos cargados</span></div>
                )}
                {loadingJuegos && (
                  <div className="item"><span className="hint">Cargando...</span></div>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    );
  }

  if (vista === "reservas") {
    return (
      <section className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn ghost" onClick={() => setVista("menu")}>{"<"}- Volver</button>
            <div>
              <h2 style={{ margin: 0 }}>Reservas</h2>
              <p className="sub" style={{ margin: 0 }}>Consulta y cancela reservas (solo ADMIN).</p>
            </div>
          </div>
          <button className="btn ghost" onClick={fetchReservas} disabled={loadingReservas}>
            {loadingReservas ? "Actualizando..." : "Refrescar"}
          </button>
        </div>

        <div className="row" style={{ marginTop: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="label">Usuario</label>
            <input
              className="input"
              placeholder="Nombre o email"
              value={filtrosReservas.nombreUsuario}
              onChange={(e) => setFiltrosReservas((f) => ({ ...f, nombreUsuario: e.target.value }))}
            />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label className="label">Mesa</label>
            <input
              className="input"
              type="number"
              min={1}
              placeholder="Ej: 4"
              value={filtrosReservas.numeroMesa}
              onChange={(e) => setFiltrosReservas((f) => ({ ...f, numeroMesa: e.target.value }))}
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label className="label">Fecha turno</label>
            <input
              className="input"
              type="date"
              value={filtrosReservas.fechaTurno}
              onChange={(e) => setFiltrosReservas((f) => ({ ...f, fechaTurno: e.target.value }))}
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label className="label">Día semana</label>
            <select
              className="input"
              value={filtrosReservas.diaSemana}
              onChange={(e) => setFiltrosReservas((f) => ({ ...f, diaSemana: e.target.value }))}
            >
              <option value="">Todos</option>
              {["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <button className="btn primary" type="button" onClick={fetchReservas} disabled={loadingReservas}>
              {loadingReservas ? "Buscando..." : "Aplicar filtros"}
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                setFiltrosReservas({ nombreUsuario: "", numeroMesa: "", fechaTurno: "", diaSemana: "" });
                setTimeout(fetchReservas, 0);
              }}
            >
              Limpiar
            </button>
          </div>
        </div>

        {errorReservas && <div className="alert error" style={{ marginTop: 12 }}>{errorReservas}</div>}

        <div className="card" style={{ marginTop: 12, background: "rgba(17,26,46,.6)", border: "1px solid var(--border)", boxShadow: "0 10px 30px rgba(0,0,0,.25)" }}>
          <div className="list">
            {reservas.map((r) => (
              <div key={r.id} className="item" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong>Reserva #{r.id}</strong>
                  <div className="hint">
                    Usuario: {r.nombreUsuario || r.usuarioId} · Mesa {r.numeroMesa} · Fecha {r.fechaTurno} · {r.horaInicio}-{r.horaFin} ({r.diaSemana})
                  </div>
                  <div className="hint">Estado: {r.estado}</div>
                </div>
                {r.estado?.toUpperCase() === "RESERVADO" ? (
                  <button
                    className="btn danger"
                    onClick={() => handleCancelarReserva(r.id)}
                    disabled={eliminandoReserva === r.id}
                  >
                    {eliminandoReserva === r.id ? "Cancelando..." : "Cancelar"}
                  </button>
                ) : (
                  <span className="hint">Ya cancelada</span>
                )}
              </div>
            ))}
            {!loadingReservas && reservas.length === 0 && (
              <div className="item"><span className="hint">Sin reservas para estos filtros.</span></div>
            )}
            {loadingReservas && (
              <div className="item"><span className="hint">Cargando...</span></div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Vista turnos
  return (
    <section className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn ghost" onClick={() => setVista("menu")}>{"<"}- Volver</button>
          <div>
            <h2 style={{ margin: 0 }}>Turnos</h2>
            <p className="sub" style={{ margin: 0 }}>Gestiona horarios base y turnos por dia.</p>
          </div>
        </div>
        <button className="btn ghost" onClick={fetchTurnos} disabled={loadingTurnos}>
          {loadingTurnos ? "Actualizando..." : "Refrescar"}
        </button>
      </div>

      <div className="row" style={{ gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        <button
          className={`btn ${vistaTurnoTab === "horarios" ? "primary" : "ghost"}`}
          type="button"
          onClick={() => {
            setVistaTurnoTab("horarios");
            fetchTurnos();
          }}
        >
          Horarios base
        </button>
        <button
          className={`btn ${vistaTurnoTab === "dias" ? "primary" : "ghost"}`}
          type="button"
          onClick={() => {
            setVistaTurnoTab("dias");
            fetchTurnos();
          }}
        >
          Turnos por dia
        </button>
      </div>

      {vistaTurnoTab === "horarios" ? (
        <>
          <form onSubmit={handleCrearTurnoHorario} className="row" style={{ marginTop: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="label">Hora inicio (HH:mm)</label>
              <input
                className="input"
                type="time"
                value={nuevoHorario.horaInicio}
                onChange={(e) => setNuevoHorario((h) => ({ ...h, horaInicio: e.target.value }))}
                required
              />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="label">Hora fin (HH:mm)</label>
              <input
                className="input"
                type="time"
                value={nuevoHorario.horaFin}
                onChange={(e) => setNuevoHorario((h) => ({ ...h, horaFin: e.target.value }))}
                required
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn primary" type="submit" disabled={loadingTurnos}>
                {loadingTurnos ? "Creando..." : "Crear horario"}
              </button>
              <button
                className="btn ghost"
                type="button"
                onClick={() => setNuevoHorario({ horaInicio: "", horaFin: "" })}
              >
                Limpiar
              </button>
            </div>
          </form>

          {errorTurnos && <div className="alert error" style={{ marginTop: 12 }}>{errorTurnos}</div>}

          <div style={{ marginTop: 16, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["ID", "Inicio", "Fin", ""].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 8px", borderBottom: "1px solid var(--border)", color: "var(--muted)", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horarios.map((h) => (
                  <tr key={h.id}>
                    <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>{h.id}</td>
                    <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>{h.horaInicio}</td>
                    <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>{h.horaFin}</td>
                    <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>
                      <button
                        className="btn danger"
                        onClick={() => handleEliminarTurno("horario", h.id)}
                        disabled={eliminandoTurnoId?.tipo === "horario" && eliminandoTurnoId.id === h.id}
                      >
                        {eliminandoTurnoId?.tipo === "horario" && eliminandoTurnoId.id === h.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </td>
                  </tr>
                ))}
                {!loadingTurnos && horarios.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: "12px 8px", color: "var(--muted)" }}>
                      Sin horarios cargados
                    </td>
                  </tr>
                )}
                {loadingTurnos && (
                  <tr>
                    <td colSpan={4} style={{ padding: "12px 8px", color: "var(--muted)" }}>
                      Cargando...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleCrearTurnoDia} className="row" style={{ marginTop: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="label">Fecha</label>
              <input
                className="input"
                type="date"
                value={nuevoTurnoDia.fecha}
                onChange={(e) => setNuevoTurnoDia((t) => ({ ...t, fecha: e.target.value }))}
                required
              />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="label">Dia de semana</label>
              <select
                className="input"
                value={nuevoTurnoDia.diaSemana}
                onChange={(e) => setNuevoTurnoDia((t) => ({ ...t, diaSemana: e.target.value }))}
                required
              >
                <option value="">Seleccionar</option>
                {["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label className="label">Turno horario</label>
              <select
                className="input"
                value={nuevoTurnoDia.turnoHorarioId}
                onChange={(e) => setNuevoTurnoDia((t) => ({ ...t, turnoHorarioId: e.target.value }))}
                required
              >
                <option value="">Seleccionar</option>
                {horarios.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.horaInicio} - {h.horaFin}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn primary" type="submit" disabled={loadingTurnos}>
                {loadingTurnos ? "Creando..." : "Crear turno dia"}
              </button>
              <button
                className="btn ghost"
                type="button"
                onClick={() => setNuevoTurnoDia({ fecha: "", diaSemana: "", turnoHorarioId: "" })}
              >
                Limpiar
              </button>
            </div>
          </form>

          <div className="row" style={{ marginTop: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="label">Fecha</label>
              <input
                className="input"
                type="date"
                value={filtroTurnoDia.fecha}
                onChange={(e) => setFiltroTurnoDia((f) => ({ ...f, fecha: e.target.value }))}
              />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label className="label">Dia semana</label>
              <select
                className="input"
                value={filtroTurnoDia.diaSemana}
                onChange={(e) => setFiltroTurnoDia((f) => ({ ...f, diaSemana: e.target.value }))}
              >
                <option value="">Todos</option>
                {["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <button className="btn primary" type="button" onClick={fetchTurnos} disabled={loadingTurnos}>
                {loadingTurnos ? "Buscando..." : "Aplicar filtros"}
              </button>
              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  setFiltroTurnoDia({ fecha: "", diaSemana: "" });
                  setTimeout(fetchTurnos, 0);
                }}
              >
                Limpiar
              </button>
            </div>
          </div>

          {errorTurnos && <div className="alert error" style={{ marginTop: 12 }}>{errorTurnos}</div>}

          <div style={{ marginTop: 16, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["ID", "Fecha", "Dia", "Horario", ""].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 8px", borderBottom: "1px solid var(--border)", color: "var(--muted)", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {turnosDia.map((t) => (
                  <tr key={t.id}>
                    <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>{t.id}</td>
                    <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>{t.fecha}</td>
                    <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>{t.diaSemana}</td>
                    <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>
                      {t.horaInicio} - {t.horaFin}
                    </td>
                    <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>
                      <button
                        className="btn danger"
                        onClick={() => handleEliminarTurno("dia", t.id)}
                        disabled={eliminandoTurnoId?.tipo === "dia" && eliminandoTurnoId.id === t.id}
                      >
                        {eliminandoTurnoId?.tipo === "dia" && eliminandoTurnoId.id === t.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </td>
                  </tr>
                ))}
                {!loadingTurnos && turnosDia.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "12px 8px", color: "var(--muted)" }}>
                      Sin turnos cargados
                    </td>
                  </tr>
                )}
                {loadingTurnos && (
                  <tr>
                    <td colSpan={5} style={{ padding: "12px 8px", color: "var(--muted)" }}>
                      Cargando...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
  const dificultades = ["FACIL", "MEDIA", "DIFICIL", "EXPERTO"];
  const categorias = [
    "Roles ocultos",
    "Familiar set collection",
    "Cooperativo Familiar",
    "Familiar",
    "Trivia",
    "Party game humor",
    "Formación de patrones",
    "Familiar cartas",
    "Rol",
    "Euro game",
    "Set collection cartas",
    "Deducción",
    "Cooperativo",
    "Control de territorio",
    "Cooperativo cartas",
  ];
