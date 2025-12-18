import { useEffect, useState } from "react";
import { listarJuegosParaJugar, type JuegoParaJugarResponseDto } from "../api/juegos.api";
import { parseApiError } from "../api/api-error";

type Filters = {
  nombre: string;
  categoria: string;
  dificultad: string;
  jugadoresMax: string;
};

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

export default function JuegosParaJugar() {
  const [juegos, setJuegos] = useState<JuegoParaJugarResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    nombre: "",
    categoria: "",
    dificultad: "",
    jugadoresMax: "",
  });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = {
        nombre: filters.nombre || undefined,
        categoria: filters.categoria || undefined,
        dificultad: filters.dificultad || undefined,
        jugadoresMax: filters.jugadoresMax ? Number(filters.jugadoresMax) : undefined,
      };
      const data = await listarJuegosParaJugar(params);
      setJuegos(data);
    } catch (err: any) {
      const { message } = parseApiError(err, "No se pudieron cargar los juegos");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="card">
      <h2>Juegos para jugar en la ludoteca</h2>
      <p className="sub">Consulta disponibilidad y detalles. Reservar mesa requiere iniciar sesion.</p>

      <form
        className="form"
        style={{ marginTop: 12, marginBottom: 16 }}
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <div className="row">
          <div style={{ flex: 1 }}>
            <label className="label">Nombre</label>
            <input
              className="input"
              placeholder="Catan, Azul..."
              value={filters.nombre}
              onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Categoria</label>
            <select
              className="input select"
              value={filters.categoria}
              onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
            >
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label className="label">Dificultad</label>
            <select
              className="input select"
              value={filters.dificultad}
              onChange={(e) => setFilters({ ...filters, dificultad: e.target.value })}
            >
              <option value="">Todas</option>
              {dificultades.map((dif) => (
                <option key={dif} value={dif}>{dif}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Jugadores max.</label>
            <input
              className="input"
              type="number"
              min={1}
              placeholder="4"
              value={filters.jugadoresMax}
              onChange={(e) => setFilters({ ...filters, jugadoresMax: e.target.value })}
            />
          </div>
        </div>
        <div className="row">
          <button className="btn primary" disabled={loading}>{loading ? "Cargando..." : "Filtrar"}</button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setFilters({ nombre: "", categoria: "", dificultad: "", jugadoresMax: "" });
              load();
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {loading && <p className="hint">Cargando juegos...</p>}
      {error && <div className="alert error">{error}</div>}

      {!loading && !error && juegos.length === 0 && (
        <p className="hint">No hay juegos disponibles con esos filtros.</p>
      )}

      <div className="list">
        {juegos.map((juego) => (
          <div key={juego.id} className="item" style={{ justifyContent: "space-between" }}>
            <div>
              <strong>{juego.nombre}</strong>
              <div className="hint">
                {juego.categoria ?? "Sin categoria"} • {juego.dificultad ?? "Nivel libre"}
                {juego.numeroMaximo ? ` • Hasta ${juego.numeroMaximo} jugadores` : ""}
                {juego.duracionAproximada ? ` • ${juego.duracionAproximada}` : ""}
              </div>
              {juego.descripcion && <div className="hint">{juego.descripcion}</div>}
            </div>
            <span className="badge" style={{ borderColor: "#1e2a46" }}>
              {juego.cantidadDisponible != null ? `Disponibles: ${juego.cantidadDisponible}` : "En sala"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
