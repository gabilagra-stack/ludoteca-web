import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login as loginApi } from "../api/auth.api";
import { parseApiError } from "../api/api-error";
import { useAuthStore } from "../auth/auth.store";
import "./login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.login);

  useEffect(() => {
    const message = (location.state as any)?.message;
    if (message) setInfo(message);
  }, [location.state]);

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const { token, user } = await loginApi(email, password);
      setAuth(token, user);
      navigate("/");
    } catch (err: any) {
      const { message } = parseApiError(err, "No se pudo iniciar sesion");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* Content section with background image */}
      <div className="login-content-section">
        {/* Background image scoped to content area only */}
        <div className="login-hero-bg" />

        {/* Main two-column layout */}
        <div className="login-content">

        {/* LEFT COLUMN: Visual */}
        <div className="login-visual">
          <div className="login-visual-text">
            <h1 className="login-visual-title">
              La mesa<span>te está esperando</span>
            </h1>
            <p className="login-visual-subtitle">
              Reservá mesas, descubrí juegos y participá en eventos junto a la comunidad.
            </p>
          </div>
          <div className="login-visual-badge">
            <div className="login-visual-badge-icon">
              {/* Custom Golden Meeple SVG */}
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 20h-5a1 1 0 0 1 -1 -1c0 -2 3.378 -4.907 4 -6c-1 0 -4 -.5 -4 -2c0 -2 4 -3.5 6 -4c0 -1.5 .5 -4 3 -4s3 2.5 3 4c2 .5 6 2 6 4c0 1.5 -3 2 -4 2c.622 1.093 4 4 4 6a1 1 0 0 1 -1 1h-5c-1 0 -2 -4 -3 -4s-2 4 -3 4z"
                  fill="#facc15"
                />
              </svg>
            </div>
            <span className="login-visual-badge-text">
              Una comunidad que comparte,<br/>
              <strong>juega y se divierte.</strong>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Login Card */}
        <div className="login-card-wrapper">
          <div className="login-board-card">
            {/* Hexágono lúdico con meeple SVG */}
            <div className="login-card-hexagon">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                {/* Hexágono exterior amarillo con borde oscuro */}
                <polygon
                  points="50,4 92,26 92,74 50,96 8,74 8,26"
                  fill="#facc15"
                  stroke="#1c1917"
                  strokeWidth="8"
                  strokeLinejoin="round"
                />
                {/* Borde interior decorativo más fino */}
                <polygon
                  points="50,9 87,29 87,71 50,91 13,71 13,29"
                  fill="none"
                  stroke="#b45309"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  opacity="0.45"
                />
                {/* Silueta de meeple centrada */}
                <g transform="translate(26, 26) scale(2.0)">
                  <path
                    d="M9 20h-5a1 1 0 0 1 -1 -1c0 -2 3.378 -4.907 4 -6c-1 0 -4 -.5 -4 -2c0 -2 4 -3.5 6 -4c0 -1.5 .5 -4 3 -4s3 2.5 3 4c2 .5 6 2 6 4c0 1.5 -3 2 -4 2c.622 1.093 4 4 4 6a1 1 0 0 1 -1 1h-5c-1 0 -2 -4 -3 -4s-2 4 -3 4z"
                    fill="#1c1917"
                  />
                </g>
              </svg>
            </div>

            {/* Tornillos decorativos */}
            <span className="corner-dot corner-tl" />
            <span className="corner-dot corner-tr" />
            <span className="corner-dot corner-bl" />
            <span className="corner-dot corner-br" />

            <h2 className="login-card-title">Iniciar Sesión</h2>

            <form onSubmit={handleLogin}>
              {/* Email / Username */}
              <div className="login-field">
                <label className="login-label">Email o nombre de usuario</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Ingresa tu email o usuario"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-field">
                <label className="login-label">Contraseña</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="login-input-action"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="login-options-row">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    className="login-remember-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="login-remember-label">Recordarme</span>
                </label>
                <a href="#" className="login-forgot">¿Olvidaste tu contraseña?</a>
              </div>

              {/* Error / Info messages */}
              {error && (
                <div className="login-error">{error}</div>
              )}
              {info && !error && (
                <div className="login-info">{info}</div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </button>
            </form>

            {/* Separator */}
            <div className="login-separator">
              <span>o</span>
            </div>

            {/* Create account */}
            <p className="login-create-account">
              ¿Aún no tienes cuenta?{" "}
              <Link to="/registro">Crear usuario</Link>
            </p>
          </div>
        </div>

      </div>

      </div>{/* end login-content-section */}

      {/* FOOTER – same as Home */}
      <div className="login-footer-wrap">
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
