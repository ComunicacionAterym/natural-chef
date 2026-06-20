"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Editor({ categorias }) {
  const router = useRouter();
  const [nueva, setNueva] = useState({ nombre: "", emoji: "", es_especial: false });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  async function call(method, body) {
    setBusy(true);
    setToast(null);
    try {
      const r = await fetch("/api/admin/categorias", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error");
      router.refresh();
      return true;
    } catch (e) {
      setToast({ type: "err", msg: e.message });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function agregar() {
    if (!nueva.nombre.trim()) return;
    const ok = await call("POST", nueva);
    if (ok) setNueva({ nombre: "", emoji: "", es_especial: false });
  }

  return (
    <>
      <div className="card">
        <h3>Nueva categoría</h3>
        <div className="addbar">
          <div className="field" style={{ flex: "0 0 70px" }}>
            <label>Emoji</label>
            <input type="text" value={nueva.emoji} onChange={(e) => setNueva({ ...nueva, emoji: e.target.value })} placeholder="🍝" />
          </div>
          <div className="field" style={{ flex: "1 1 220px" }}>
            <label>Nombre</label>
            <input type="text" value={nueva.nombre} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} placeholder="Pasta Fresca" />
          </div>
          <label className="toggle" style={{ marginTop: 0 }}>
            <input type="checkbox" checked={nueva.es_especial} onChange={(e) => setNueva({ ...nueva, es_especial: e.target.checked })} />
            <span className="switch"></span> Especial
          </label>
          <button className="btn" onClick={agregar} disabled={busy || !nueva.nombre.trim()}>Agregar</button>
        </div>
      </div>

      <div className="card">
        <h3>Categorías ({categorias.length})</h3>
        <div className="list">
          {categorias.map((c) => (
            <CatRow key={c.id} c={c} call={call} busy={busy} />
          ))}
          {categorias.length === 0 && <div className="muted">Todavía no hay categorías.</div>}
        </div>
        {toast && <div className={"toast " + toast.type} style={{ marginTop: 12 }}>{toast.msg}</div>}
      </div>
    </>
  );
}

function CatRow({ c, call, busy }) {
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ ...c });

  if (!edit) {
    return (
      <div className="item">
        <span className="ico">{c.emoji || "🏷️"}</span>
        <div className="meta">
          <div className="nm">{c.nombre}</div>
          <div className="sb">
            {c.es_especial && <span className="badge amber">Especial</span>}{" "}
            {c.activa ? <span className="badge green">Activa</span> : <span className="badge">Oculta</span>}
          </div>
        </div>
        <div className="acts">
          <button className="iconbtn" onClick={() => setEdit(true)} title="Editar">✏️</button>
          <button className="iconbtn danger" disabled={busy} title="Borrar"
            onClick={() => { if (confirm("¿Borrar la categoría " + c.nombre + "?")) call("DELETE", { id: c.id }); }}>🗑️</button>
        </div>
      </div>
    );
  }

  return (
    <div className="item" style={{ flexWrap: "wrap" }}>
      <div className="addbar" style={{ width: "100%" }}>
        <div className="field" style={{ flex: "0 0 70px" }}>
          <label>Emoji</label>
          <input type="text" value={f.emoji || ""} onChange={(e) => setF({ ...f, emoji: e.target.value })} />
        </div>
        <div className="field" style={{ flex: "1 1 200px" }}>
          <label>Nombre</label>
          <input type="text" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} />
        </div>
        <label className="toggle" style={{ marginTop: 0 }}>
          <input type="checkbox" checked={!!f.es_especial} onChange={(e) => setF({ ...f, es_especial: e.target.checked })} />
          <span className="switch"></span> Especial
        </label>
        <label className="toggle" style={{ marginTop: 0 }}>
          <input type="checkbox" checked={!!f.activa} onChange={(e) => setF({ ...f, activa: e.target.checked })} />
          <span className="switch"></span> Activa
        </label>
        <button className="btn" disabled={busy} onClick={async () => { const ok = await call("PUT", f); if (ok) setEdit(false); }}>Guardar</button>
        <button className="ghost" onClick={() => { setF({ ...c }); setEdit(false); }}>Cancelar</button>
      </div>
    </div>
  );
}
