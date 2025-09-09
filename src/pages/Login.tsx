import { useState } from "react";
import { login } from "../api/auth.api";
import { useAuthStore } from "../auth/auth.store";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{type:"error"|"success"; text:string}|null>(null);
  const doLogin = useAuthStore(s => s.login);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try{
      const { token, user } = await login(email, password);
      doLogin(token, user);
      setMsg({type:"success", text:"Ingreso exitoso. Redirigiendo..."});
      setTimeout(()=> navigate("/"), 600);
    }catch(err:any){
      setMsg({type:"error", text: err?.response?.data?.message ?? "Error de login"});
    }finally{
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{maxWidth:520}}>
      <h2>Ingresar</h2>
      <p className="sub">Autenticación requerida para gestionar reservas.</p>
      <form onSubmit={onSubmit} className="form">
        <label className="label">Email</label>
        <input className="input" placeholder="email@dominio.com" value={email} onChange={e=>setEmail(e.target.value)} />

        <label className="label">Contraseña</label>
        <input className="input" type="password" placeholder="********" value={password} onChange={e=>setPassword(e.target.value)} />

        <div className="row">
          <button className="btn primary" disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</button>
          <button type="button" className="btn ghost" onClick={()=>{ setEmail(""); setPassword(""); }}>Limpiar</button>
        </div>

        {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}
      </form>
    </section>
  );
}
