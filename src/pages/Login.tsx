import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Checkbox } from "../components/ui/Checkbox";
import { Label } from "../components/ui/Label";
import { login as loginApi } from "../api/auth.api";
import { useAuthStore } from "../auth/auth.store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.login);

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await loginApi(email, password);
      setAuth(token, user);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo iniciar sesion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 via-orange-600 to-yellow-400 px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/30 shadow-2xl" />
        <div className="relative rounded-3xl p-10 flex flex-col items-center space-y-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-200 shadow-lg bg-white flex items-center justify-center">
            <img
              src="/dragon-logo.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center space-y-1">
            <p className="text-sm text-white/80 tracking-wide uppercase">Bienvenido</p>
            <h1 className="text-2xl font-semibold text-white drop-shadow">Ludoteca</h1>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <Input
              placeholder="Email o nombre de usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border border-white/40 text-white placeholder-white/70"
            />
            <Input
              placeholder="Contrasena"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border border-white/40 text-white placeholder-white/70"
            />

            <div className="flex items-center justify-between text-sm text-white/80">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="bg-white/20 border-white/60"
                />
                <Label htmlFor="remember" className="text-white">
                  Recordarme
                </Label>
              </label>
              <span className="text-white/60">Olvide la clave?</span>
            </div>

            {error && (
              <div className="text-center text-sm text-white bg-red-500/70 rounded-md py-2 px-3">
                {error}
              </div>
            )}

            <Button
              className="w-full mt-2 bg-white/20 text-white border border-white/40 hover:bg-white/30 disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar Sesion"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
