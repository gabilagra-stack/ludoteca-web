import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/auth.store";

export default function Home(){
  const user = useAuthStore(s => s.user);

  return (
    <div className="grid cols-2">
      <section className="card">
        <h1>Bienvenido a la Ludoteca</h1>
        <p className="sub">MVP de reservas — versión demo para validación con dueños.</p>
        <div className="row" style={{marginTop:10}}>
          <Link to="/reservar" className="btn primary">Nueva reserva</Link>
          <Link to="/mis-reservas" className="btn ghost">Mis reservas</Link>
        </div>
        {!user && <p className="hint">Para reservar necesitás iniciar sesión.</p>}
      </section>

      <section className="card">
        <h2>¿Qué puedo hacer?</h2>
        <ul className="list">
          <li className="item">Ver y crear reservas indicando mesa y turno.</li>
          <li className="item">Cancelar reservas vigentes.</li>
          <li className="item">Vista de administración (solo rol ADMIN).</li>
        </ul>
      </section>
    </div>
  );
}
