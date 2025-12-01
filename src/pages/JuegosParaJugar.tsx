import { useEffect, useState } from "react";
import { listarJuegosParaJugar, type JuegoParaJugarResponseDto } from "../api/juegos.api";

export default function JuegosParaJugar() {
  const [juegos, setJuegos] = useState<JuegoParaJugarResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listarJuegosParaJugar();
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
      <h2>Juegos para jugar en la ludoteca</h2>
      <p className="sub">Consulta disponibilidad y detalles. Reservar mesa requiere iniciar sesion.</p>

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
            <span className="badge" style={{ borderColor: "#1e2a46" }}>
              {juego.cantidadDisponible != null ? `Disponibles: ${juego.cantidadDisponible}` : "En sala"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
