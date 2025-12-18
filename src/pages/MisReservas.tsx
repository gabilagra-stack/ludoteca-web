import { useEffect, useState } from "react";
import { cancelarReserva, listarMisReservas } from "../api/reservas.api";
import type { ReservaResponseDto } from "../api/reservas.api";
import { parseApiError } from "../api/api-error";

export default function MisReservas(){
  const [data, setData] = useState<ReservaResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{type:"error"|"success"; text:string}|null>(null);

  async function load(){
    setMsg(null);
    setLoading(true);
    try{
      const res = await listarMisReservas();
      setData(res);
    }catch(e:any){
      const { message } = parseApiError(e, "Error cargando reservas");
      setMsg({type:"error", text: message});
    }finally{
      setLoading(false);
    }
  }
  useEffect(()=>{ load(); }, []);

  async function cancelar(id:number){
    if(!confirm(`¿Cancelar la reserva #${id}?`)) return;
    try{
      await cancelarReserva(id);
      setMsg({type:"success", text:`Reserva #${id} cancelada`});
      await load();
    }catch(e:any){
      const { message } = parseApiError(e, "Error cancelando");
      setMsg({type:"error", text: message});
    }
  }

  return (
    <section className="card">
      <h2>Mis reservas</h2>
      <p className="sub">Listado de tus reservas activas y pasadas.</p>

      {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}
      {loading ? <p className="hint">Cargando…</p> : (
        data.length === 0 ? <p className="hint">No tenés reservas.</p> : (
          <ul className="list">
            {data.map(r=>(
              <li key={r.id} className="item">
                <span>#{r.id}</span>
                <span>· Mesa <b>{r.numeroMesa}</b></span>
                <span>· {r.fechaTurno} {r.horaInicio}-{r.horaFin}</span>
                <span className="badge">{r.estado}</span>
                <span className="spacer" />
                {r.estado !== "CANCELADO" && (
                  <button className="btn danger" onClick={()=>cancelar(r.id)}>Cancelar</button>
                )}
              </li>
            ))}
          </ul>
        )
      )}
    </section>
  );
}
