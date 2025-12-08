import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/auth.store";

export default function Home() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="grid cols-2" style={{ gap: 24 }}>
      <section className="card hero" style={{ gridColumn: "span 2" }}>
        <h1>Gestiona tus partidas con Ludoteca</h1>
        <p className="sub">
          Explora el catalogo de juegos (publico) y reserva mesas cuando inicies sesion.
        </p>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <Link to="/juegos-para-jugar" className="btn ghost">
            Ver juegos para jugar
          </Link>
          <Link to="/juegos-para-comprar" className="btn ghost">
            Ver juegos para comprar
          </Link>
          {!user ? (
            <Link to="/login" className="btn primary">
              Iniciar sesion para reservar
            </Link>
          ) : (
            <>
              <Link to="/reservar" className="btn primary">
                Reservar turno
              </Link>
              <Link to="/mis-reservas" className="btn ghost">
                Mis reservas
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="card">
        <h2>Juegos para jugar</h2>
        <p className="sub">Consulta titulos disponibles en sala sin iniciar sesion.</p>
        <div className="list">
          <div className="item" style={{ justifyContent: "space-between" }}>
            <div>
              <strong>Explora el catalogo</strong>
              <div className="hint">Categorias, dificultad y jugadores max.</div>
            </div>
            <Link to="/juegos-para-jugar" className="btn ghost" style={{ padding: "8px 12px" }}>
              Ver lista
            </Link>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Juegos para comprar</h2>
        <p className="sub">Precios y stock visibles sin cuenta.</p>
        <div className="list">
          <div className="item" style={{ justifyContent: "space-between" }}>
            <div>
              <strong>Catálogo de compra</strong>
              <div className="hint">Consulta stock y detalles antes de visitar.</div>
            </div>
            <Link to="/juegos-para-comprar" className="btn ghost" style={{ padding: "8px 12px" }}>
              Ver lista
            </Link>
          </div>
        </div>
      </section>

      {user && (
        <section className="card" style={{ gridColumn: "span 2" }}>
          <h2>Reservas (solo con inicio de sesion)</h2>
          <p className="sub">
            Agenda turnos, cancela reservas y administra tus mesas. Necesitas estar logueado.
          </p>
          <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
            <Link to="/reservar" className="btn primary">
              Nueva reserva
            </Link>
            <Link to="/mis-reservas" className="btn ghost">
              Ver mis reservas
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
