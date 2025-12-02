import { useEffect, useState } from "react";
import { listarJuegosParaComprar, type JuegoParaVenderResponseDto } from "../api/juegos.api";

type Filters = {
  nombre: string;
  categoria: string;
  dificultad: string;
  jugadoresMax: string;
  stock: string;
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

export default function JuegosParaComprar() {
  const [juegos, setJuegos] = useState<JuegoParaVenderResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    nombre: "",
    categoria: "",
    dificultad: "",
    jugadoresMax: "",
    stock: "",
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
        stock: filters.stock ? Number(filters.stock) : undefined,
      };
      const data = await listarJuegosParaComprar(params);
      setJuegos(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudieron cargar los juegos");
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
      <h2>Juegos para comprar</h2>
      <p className="sub">Revisa stock y titulos disponibles. Reservas requieren iniciar sesion.</p>

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
              placeholder="Ticket to Ride..."
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
          <div style={{ flex: 1 }}>
            <label className="label">Stock mínimo</label>
            <input
              className="input"
              type="number"
              min={0}
              placeholder="Ej: 1"
              value={filters.stock}
              onChange={(e) => setFilters({ ...filters, stock: e.target.value })}
            />
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 8 }}>
            <button className="btn primary" disabled={loading}>{loading ? "Cargando..." : "Filtrar"}</button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setFilters({ nombre: "", categoria: "", dificultad: "", jugadoresMax: "", stock: "" });
                load();
              }}
            >
              Limpiar
            </button>
          </div>
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
            <div className="badge" style={{ borderColor: "#1e2a46", display: "inline-flex", gap: 6 }}>
              {juego.precio != null ? <span>${juego.precio}</span> : <span>Precio al consultar</span>}
              {typeof juego.stock === "number" ? <span>| Stock: {juego.stock}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
