import { useEffect, useMemo, useState } from "react";
import { listarJuegosParaComprar, type JuegoParaVenderResponseDto } from "../api/juegos.api";
import { parseApiError } from "../api/api-error";

type Filters = {
  nombre: string;
  categoria: string;
  dificultad: string;
  jugadoresMax: string;
  stock: string;
};

type PaginationItem = number | "ellipsis";

const juegosParaComprarPageSize = 6;
const dificultades = ["FACIL", "MEDIA", "DIFICIL", "EXPERTO"];
const jugadoresMaximos = [2, 4, 6, 8, 10, 12];
const categorias = [
  "Roles ocultos",
  "Familiar set collection",
  "Cooperativo Familiar",
  "Familiar",
  "Trivia",
  "Party game humor",
  "Formaci\u00f3n de patrones",
  "Familiar cartas",
  "Rol",
  "Euro game",
  "Set collection cartas",
  "Deducci\u00f3n",
  "Cooperativo",
  "Control de territorio",
  "Cooperativo cartas",
];

const emptyFilters: Filters = {
  nombre: "",
  categoria: "",
  dificultad: "",
  jugadoresMax: "",
  stock: "",
};

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

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

function formatPrice(precio: number | null | undefined) {
  return precio != null ? priceFormatter.format(precio).replace(/\s/g, "") : "Consultar";
}

export default function JuegosParaComprar() {
  const [juegos, setJuegos] = useState<JuegoParaVenderResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const totalPages = Math.max(1, Math.ceil(juegos.length / juegosParaComprarPageSize));
  const visibleGames = useMemo(() => {
    const start = (page - 1) * juegosParaComprarPageSize;
    return juegos.slice(start, start + juegosParaComprarPageSize);
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
        stock: nextFilters.stock ? Number(nextFilters.stock) : undefined,
      };
      const data = await listarJuegosParaComprar(params);
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
    <section className="games-page games-buy-page">
      <div className="games-shell">
        <header className="games-heading">
          <div className="board-page-title">
            <span className="title-icon">{"\uD83C\uDFB2"}</span>
            <h1>Juegos para comprar</h1>
            <span className="title-icon">{"\uD83C\uDFB2"}</span>
          </div>
          <p>Revisa stock y titulos disponibles. Reservas requieren iniciar sesion.</p>
        </header>

        <form
          className="games-filters games-buy-filters"
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
            <span>Categoria</span>
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
            <span>Jugadores max.</span>
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

          <label className="games-field games-stock-field">
            <span>Stock minimo</span>
            <input
              className="games-input"
              type="number"
              min={0}
              placeholder="Ej. 1"
              value={filters.stock}
              onChange={(event) => setFilters({ ...filters, stock: event.target.value })}
            />
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
                  <article key={juego.id} className="games-list-row games-buy-row game-row">
                    <div className="games-buy-main">
                      {juego.imagenUrl && (
                        <img className="games-cover" src={juego.imagenUrl} alt="" loading="lazy" />
                      )}
                      <div className="games-row-copy">
                        <strong>{juego.nombre}</strong>
                        <div className="games-row-meta">
                          <span>{juego.categoria ?? "Sin categoria"}</span>
                          <span>{dificultad}</span>
                          {juego.numeroMaximo ? <span>Hasta {juego.numeroMaximo} jugadores</span> : null}
                          {juego.duracionAproximada ? <span>{juego.duracionAproximada}</span> : null}
                        </div>
                      </div>
                    </div>

                    <div className="games-buy-actions">
                      <span className="games-price">{formatPrice(juego.precio)}</span>
                      {typeof juego.stock === "number" ? (
                        <span className="games-stock">Stock: {juego.stock}</span>
                      ) : (
                        <span className="games-stock">Stock: consultar</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <nav className="games-pagination" aria-label="Paginado de juegos para comprar">
              <button
                type="button"
                className="games-page-button icon"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                aria-label="Pagina anterior"
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
                aria-label="Pagina siguiente"
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
