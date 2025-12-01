import { useEffect, useState } from "react";
import { listarJuegosParaComprar, type JuegoParaVenderResponseDto } from "../api/juegos.api";

export default function JuegosParaComprar() {
  const [juegos, setJuegos] = useState<JuegoParaVenderResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listarJuegosParaComprar();
        setJuegos(data);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "No se pudieron cargar los juegos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="card">
      <h2>Juegos para comprar</h2>
      <p className="sub">Revisa stock y titulos disponibles. Reservas requieren iniciar sesion.</p>

      {loading && <p className="hint">Cargando juegos...</p>}
      {error && <div className="alert error">{error}</div>}

      {!loading && !error && juegos.length === 0 && (
        <p className="hint">No hay juegos disponibles en este momento.</p>
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
