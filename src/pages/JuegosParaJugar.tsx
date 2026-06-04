import { useEffect, useMemo, useState } from "react";
import {
  JUEGOS_PARA_JUGAR_PAGE_SIZE,
  listarJuegosParaJugar,
  type JuegoParaJugarResponseDto,
} from "../api/juegos.api";
import { parseApiError } from "../api/api-error";

type Filters = {
  nombre: string;
  categoria: string;
  dificultad: string;
  jugadoresMax: string;
};

type PaginationItem = number | "ellipsis";

const dificultades = ["FACIL", "MEDIA", "DIFICIL", "EXPERTO"];
const jugadoresMaximos = [2, 4, 6, 8, 10, 12];
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

const emptyFilters: Filters = {
  nombre: "",
  categoria: "",
  dificultad: "",
  jugadoresMax: "",
};

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z" />
    </svg>
  );
}

function BroomIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 8a7 7 0 1 0 1 5" />
      <path d="M19 4v4h-4" />
    </svg>
  );
}

function PlayerIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 9a7 7 0 0 1 14 0Z" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {direction === "prev" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage, "ellipsis", totalPages];
}

export default function JuegosParaJugar() {
  const [juegos, setJuegos] = useState<JuegoParaJugarResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const totalPages = Math.max(1, Math.ceil(juegos.length / JUEGOS_PARA_JUGAR_PAGE_SIZE));
  const visibleGames = useMemo(() => {
    const start = (page - 1) * JUEGOS_PARA_JUGAR_PAGE_SIZE;
    return juegos.slice(start, start + JUEGOS_PARA_JUGAR_PAGE_SIZE);
  }, [juegos, page]);
  const paginationItems = getPaginationItems(page, totalPages);

  async function load(nextFilters = filters) {
    setLoading(true);
    setError(null);
    try {
      const params = {
        nombre: nextFilters.nombre || undefined,
        categoria: nextFilters.categoria || undefined,
        dificultad: nextFilters.dificultad || undefined,
        jugadoresMax: nextFilters.jugadoresMax ? Number(nextFilters.jugadoresMax) : undefined,
      };
      const data = await listarJuegosParaJugar(params);
      setJuegos(data);
    } catch (err: unknown) {
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

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  return (
    <section className="games-page">
      <div className="games-shell">
        <header className="games-heading">
          <div className="board-page-title">
            <span className="title-icon">🎲</span>
            <h1>Juegos para jugar</h1>
            <span className="title-icon">🎲</span>
          </div>
          <p>Consulta disponibilidad y detalles. Reservar mesa requiere iniciar sesión.</p>
        </header>

        <form
          className="games-filters"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            load(filters);
          }}
        >
          <label className="games-field">
            <span>Nombre</span>
            <div className="games-input-wrap">
              <input
                className="games-input"
                placeholder="Buscar juego..."
                value={filters.nombre}
                onChange={(event) => setFilters({ ...filters, nombre: event.target.value })}
              />
              <SearchIcon />
            </div>
          </label>

          <label className="games-field">
            <span>Categoría</span>
            <select
              className="games-input"
              value={filters.categoria}
              onChange={(event) => setFilters({ ...filters, categoria: event.target.value })}
            >
              <option value="">Todas</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </label>

          <label className="games-field">
            <span>Dificultad</span>
            <select
              className="games-input"
              value={filters.dificultad}
              onChange={(event) => setFilters({ ...filters, dificultad: event.target.value })}
            >
              <option value="">Todas</option>
              {dificultades.map((dificultad) => (
                <option key={dificultad} value={dificultad}>
                  {dificultad}
                </option>
              ))}
            </select>
          </label>

          <label className="games-field">
            <span>Jugadores máx.</span>
            <div className="games-input-wrap games-input-wrap-player">
              <PlayerIcon />
              <select
                className="games-input"
                value={filters.jugadoresMax}
                onChange={(event) => setFilters({ ...filters, jugadoresMax: event.target.value })}
              >
                <option value="">Todos</option>
                {jugadoresMaximos.map((jugadores) => (
                  <option key={jugadores} value={jugadores}>
                    {jugadores}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <div className="games-filter-actions">
            <button className="games-action primary" disabled={loading}>
              <FilterIcon />
              {loading ? "Cargando" : "Filtrar"}
            </button>
            <button
              type="button"
              className="games-action ghost"
              onClick={() => {
                setFilters(emptyFilters);
                setPage(1);
                load(emptyFilters);
              }}
            >
              <BroomIcon />
              Limpiar
            </button>
          </div>
        </form>

        {loading && <p className="games-state">Cargando juegos...</p>}
        {error && <div className="alert error games-alert">{error}</div>}
        {!loading && !error && juegos.length === 0 && (
          <p className="games-state">No hay juegos disponibles con esos filtros.</p>
        )}

        {!loading && !error && juegos.length > 0 && (
          <>
            <div className="games-list">
              {visibleGames.map((juego) => {
                const dificultad = juego.dificultad ?? "Nivel libre";

                return (
                  <article key={juego.id} className="games-list-row game-row">
                    <div className="games-row-copy">
                      <strong>{juego.nombre}</strong>
                      <div className="games-row-meta">
                        <span>{juego.categoria ?? "Sin categoría"}</span>
                        <span>{dificultad}</span>
                        {juego.numeroMaximo ? <span>Hasta {juego.numeroMaximo} jugadores</span> : null}
                        {juego.duracionAproximada ? <span>{juego.duracionAproximada}</span> : null}
                      </div>
                    </div>
                    <span className="games-availability">
                      {juego.cantidadDisponible != null
                        ? `Disponibles: ${juego.cantidadDisponible}`
                        : "En sala"}
                    </span>
                  </article>
                );
              })}
            </div>

            <nav className="games-pagination" aria-label="Paginado de juegos">
              <button
                type="button"
                className="games-page-button icon"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                aria-label="Página anterior"
              >
                <ChevronIcon direction="prev" />
              </button>
              {paginationItems.map((item, index) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${index}`} className="games-page-ellipsis">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    className={`games-page-button ${page === item ? "active" : ""}`}
                    onClick={() => setPage(item)}
                    aria-current={page === item ? "page" : undefined}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                className="games-page-button icon"
                disabled={page === totalPages}
                onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                aria-label="Página siguiente"
              >
                <ChevronIcon direction="next" />
              </button>
            </nav>
          </>
        )}
      </div>
    </section>
  );
}
