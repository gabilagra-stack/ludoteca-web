import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../auth/auth.store";

export default function Layout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isLogin = location.pathname === "/login";
  const useBoardNav =
    isHome ||
    isLogin ||
    location.pathname.startsWith("/juegos-para-") ||
    location.pathname === "/reservar" ||
    location.pathname === "/mis-reservas";
  const userInitial = user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <>
      <header className={`nav ${useBoardNav ? "nav-home" : ""}`}>
        <div className="nav-inner">
          <Link to="/" className="brand">Ludoteca</Link>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Inicio</NavLink>
          <NavLink to="/juegos-para-jugar" className={({ isActive }) => (isActive ? "active" : "")}>Juegos para jugar</NavLink>
          <NavLink to="/juegos-para-comprar" className={({ isActive }) => (isActive ? "active" : "")}>Juegos para comprar</NavLink>
          {user && (
            <>
              <NavLink to="/reservar" className={({ isActive }) => (isActive ? "active" : "")}>Reservar</NavLink>
              <NavLink to="/mis-reservas" className={({ isActive }) => (isActive ? "active" : "")}>Mis reservas</NavLink>
            </>
          )}
          {user?.roles?.includes("ADMIN") && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>Admin</NavLink>
          )}
          <div className="spacer" />
          {user ? (
            <div className="nav-user">
              <span className="nav-user-avatar" aria-hidden="true">{userInitial}</span>
              <span className="badge nav-user-email">{user.email}</span>
              <button
                className="nav-btn-logout"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Salir
              </button>
            </div>
          ) : (
            !isLogin && (
              <NavLink to="/login" className={({ isActive }) => "nav-btn-login " + (isActive ? "active" : "")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Iniciar sesión
              </NavLink>
            )
          )}
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
