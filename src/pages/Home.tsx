import { useEffect, useState } from "react";
import { parseApiError } from "../api/api-error";
import { listarProximosEventos, type Evento } from "../api/eventos.api";
import { useAuthStore } from "../auth/auth.store";
import "./home.css";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [errorEventos, setErrorEventos] = useState<string | null>(null);

  const destacados = [
    { titulo: "Catan", jugadores: "3-4", tiempo: "90 min", badge: "POPULAR", badgeClass: "badge-yellow", color: "#b45309" },
    { titulo: "Dixit", jugadores: "3-6", tiempo: "30 min", badge: "NUEVO", badgeClass: "badge-green", color: "#1e3a8a" },
    { titulo: "Carcassonne", jugadores: "2-5", tiempo: "45 min", badge: "CLÁSICO", badgeClass: "badge-blue", color: "#14532d" },
  ];

  useEffect(() => {
    let activo = true;

    async function cargarEventos() {
      setLoadingEventos(true);
      setErrorEventos(null);
      try {
        const data = await listarProximosEventos();
        if (activo) setEventos(data);
      } catch (err) {
        const { message } = parseApiError(err, "No se pudieron cargar los eventos");
        if (activo) setErrorEventos(message);
      } finally {
        if (activo) setLoadingEventos(false);
      }
    }

    cargarEventos();

    return () => {
      activo = false;
    };
  }, []);

  function formatEventDate(fecha: string) {
    const [, month, day] = fecha.split("-").map(Number);
    if (!month || !day) return fecha;

    const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    return `${String(day).padStart(2, "0")} ${meses[month - 1] ?? month}`;
  }

  return (
    <div className="board-home">
      <div className="board-container">
        <section className="board-hero">
          <div className="board-hero-content">
            <h1>La Mesa Está Lista</h1>
            <div className="sub-heading">Eventos, Juegos y<br />Encuentros de <span className="purple-text">Mesa</span></div>
            <p>Vení a jugar, descubrir y compartir juegos de mesa<br />con amigos, familia y la comunidad.</p>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
              <button className="board-btn primary">Próximos eventos ➔</button>
              <button className="board-btn">Ver juegos</button>
            </div>
            {!user && (
              <div className="lock-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Iniciá sesión para reservar tu mesa
              </div>
            )}
          </div>
          <div className="hero-image-wrapper">
            <img
              src="/hero-original.png"
              alt="Juegos de mesa en la ludoteca"
              className="hero-image"
            />
          </div>
        </section>

        <div className="board-path-wrapper">
          <div className="board-section">
            <div className="board-cards-grid">
              {eventos.map((ev) => (
                <div key={ev.id} className="board-card">
                  <div className="board-card-date">{formatEventDate(ev.fecha)}</div>
                  <h3>{ev.titulo}</h3>
                  <p>{ev.descripcion}</p>
                  <a className="board-btn beige" href={ev.url} target="_blank" rel="noreferrer">
                    VER EVENTO
                  </a>
                </div>
              ))}

              {loadingEventos && (
                <div className="board-card board-card-state">
                  <p>Cargando eventos...</p>
                </div>
              )}

              {!loadingEventos && errorEventos && (
                <div className="board-card board-card-state">
                  <p>{errorEventos}</p>
                </div>
              )}

              {!loadingEventos && !errorEventos && eventos.length === 0 && (
                <div className="board-card board-card-state">
                  <p>No hay eventos próximos cargados.</p>
                </div>
              )}
            </div>
          </div>

          <div className="board-section">
            <div className="happenings-unified">
              <div className="happening-item">
                <div className="h-icon" style={{ background: "#7f1d1d", border: "3px solid #111", borderRadius: "8px" }}></div>
                <div className="h-text">
                  <span className="h-title">Nuevo juego agregado</span>
                  <span className="h-sub">Dixit</span>
                </div>
              </div>
              <div className="happening-item">
                <div className="h-icon" style={{ background: "#fcd34d", border: "3px solid #111", borderRadius: "8px", clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}></div>
                <div className="h-text">
                  <span className="h-title">Juego más jugado esta semana</span>
                  <span className="h-sub">Carcassonne</span>
                </div>
              </div>
              <div className="happening-item">
                <div className="h-icon" style={{ background: "#475569", border: "3px solid #111", borderRadius: "8px" }}></div>
                <div className="h-text">
                  <span className="h-title">7 mesas reservadas</span>
                  <span className="h-sub">hoy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="board-section">
            <div className="featured-grid">
              {destacados.map((item) => (
                <div key={item.titulo} className="game-box-item">
                  <div className="game-image-box" style={{ background: item.color }}>
                    <span className={`box-badge ${item.badgeClass}`}>{item.badge}</span>
                    <span style={{ fontSize: "32px", color: "#fff", fontWeight: "900", fontFamily: "serif", opacity: 0.8 }}>{item.titulo}</span>
                  </div>
                  <div className="game-info-text">
                    <h4>{item.titulo}</h4>
                    <p>
                      <span>👥 {item.jugadores} jugadores</span>
                      <span>⏱️ {item.tiempo}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="board-footer-wrap">
        <div className="board-footer">
          <h2>¡Seguinos y mirá lo que se juega!</h2>
          <div className="social-links-row">
            <a href="#" className="social-badge">
              <img src="/Logo_ig.png" alt="Instagram" className="social-ig-logo" /> Instagram
            </a>
            <a href="#" className="social-badge">
              <img src="/logo_wp.png" alt="WhatsApp" className="social-wa-logo" /> WhatsApp
            </a>
            <a href="#" className="social-badge">
              <img src="/Logo_fb.png" alt="Facebook" className="social-fb-logo" /> Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
