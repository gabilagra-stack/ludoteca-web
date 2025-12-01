import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/auth.store";

export default function Home(){
  const Home = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <section className="card hero">
        <h1>Gestioná tus partidas con Ludoteca</h1>
        <p>Reservá mesa, controlá turnos y recibí confirmaciones en minutos.</p>
        <Link to="/login" className="btn primary">
          Iniciar sesión para reservar
        </Link>
        <ul className="list">
          <li>Agenda centralizada</li>
          <li>Cancelaciones simples</li>
          <li>Panel administrador</li>
        </ul>
      </section>
    );
  }

  return (
    <div className="grid cols-2">
      {/* bloques con Nueva reserva / Mis reservas */}
    </div>
  );
};
}
