import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth/auth.store";

export default function Layout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand">Ludoteca</Link>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Inicio</NavLink>
          <NavLink to="/juegos-para-jugar" className={({ isActive }) => (isActive ? "active" : "")}>Juegos para jugar</NavLink>
          <NavLink to="/juegos-para-comprar" className={({ isActive }) => (isActive ? "active" : "")}>Juegos para comprar</NavLink>
          <NavLink to="/reservar" className={({ isActive }) => (isActive ? "active" : "")}>Reservar</NavLink>
          <NavLink to="/mis-reservas" className={({ isActive }) => (isActive ? "active" : "")}>Mis reservas</NavLink>
          {user?.roles?.includes("ADMIN") && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>Admin</NavLink>
          )}
          <div className="spacer" />
          {user ? (
            <>
              <span className="badge">{user.email}</span>
              <button
                className="link"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>Ingresar</NavLink>
          )}
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
