import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth.api";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleRegister(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ nombre, email, password });
      navigate("/login", { state: { message: "Cuenta creada. Inicia sesión para continuar." } });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo crear el usuario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <section className="card" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
          <span className="sub" style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>Crear usuario</span>
          <h1 style={{ margin: 0 }}>Ludoteca</h1>
        </div>

        <form onSubmit={handleRegister} className="form">
          <div>
            <label htmlFor="nombre" className="label">Nombre</label>
            <input
              id="nombre"
              className="input"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="label">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert error">{error}</div>}

          <button
            className="btn primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="hint" style={{ marginTop: 14 }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Inicia sesión
          </Link>
        </p>
      </section>
    </div>
  );
}
