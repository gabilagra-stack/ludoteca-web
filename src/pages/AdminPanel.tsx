export default function AdminPanel(){
  return (
    <section className="card">
      <h2>Panel de administración</h2>
      <p className="sub">Acceso restringido a rol ADMIN.</p>
      <ul className="list">
        <li className="item">Próximamente: ABM Mesas</li>
        <li className="item">Próximamente: ABM Turnos</li>
        <li className="item">Próximamente: Juegos (para jugar / vender)</li>
      </ul>
    </section>
  );
}
