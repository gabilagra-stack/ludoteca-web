import { useState } from "react";
import { crearReserva } from "../api/reservas.api";

export default function Reservar(){
  const [mesaId, setMesaId] = useState<number>(1);
  const [turnoDiaId, setTurnoDiaId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{type:"error"|"success"; text:string}|null>(null);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    setMsg(null);
    if(!mesaId || !turnoDiaId){
      setMsg({type:"error", text:"Completá Mesa y Turno Día"});
      return;
    }
    setLoading(true);
    try{
      const res = await crearReserva({ mesaId, turnoDiaId });
      setMsg({type:"success", text:`Reserva #${res.id} creada (${res.estado}).`});
    }catch(e:any){
      setMsg({type:"error", text: e?.response?.data?.message ?? "Error creando reserva"});
    }finally{
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{maxWidth:520}}>
      <h2>Nueva reserva</h2>
      <p className="sub">Ingresá los identificadores por ahora (MVP).</p>
      <form onSubmit={submit} className="form">
        <div className="row">
          <div style={{flex:1}}>
            <label className="label">Mesa ID</label>
            <input className="input" type="number" value={mesaId} onChange={e=>setMesaId(Number(e.target.value))}/>
          </div>
          <div style={{flex:1}}>
            <label className="label">Turno Día ID</label>
            <input className="input" type="number" value={turnoDiaId} onChange={e=>setTurnoDiaId(Number(e.target.value))}/>
          </div>
        </div>

        <div className="row">
          <button className="btn primary" disabled={loading}>{loading ? "Creando..." : "Crear reserva"}</button>
          <button type="button" className="btn ghost" onClick={()=>{ setMesaId(1); setTurnoDiaId(1); }}>Reset</button>
        </div>

        {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}
        <p className="hint">Luego reemplazamos estos campos por selects con datos reales.</p>
      </form>
    </section>
  );
}
