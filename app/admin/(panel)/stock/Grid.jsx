"use client";

import { useState } from "react";

export default function Grid({ productos, sucursales, stock }) {
  // estado: clave "productoId:sucursalId" -> { cantidad, disponible }
  const [cells, setCells] = useState(() => {
    const m = {};
    for (const p of productos) {
      for (const s of sucursales) {
        const ex = stock.find((x) => x.producto_id === p.id && x.sucursal_id === s.id);
        m[p.id + ":" + s.id] = {
          cantidad: ex ? ex.cantidad : 0,
          disponible: ex ? ex.disponible : true,
        };
      }
    }
    return m;
  });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  function set(pid, sid, patch) {
    const k = pid + ":" + sid;
    setCells((c) => ({ ...c, [k]: { ...c[k], ...patch } }));
  }

  async function guardar() {
    setBusy(true);
    setToast(null);
    const updates = [];
    for (const p of productos) {
      for (const s of sucursales) {
        const c = cells[p.id + ":" + s.id];
        updates.push({ producto_id: p.id, sucursal_id: s.id, cantidad: c.cantidad, disponible: c.disponible });
      }
    }
    try {
      const r = await fetch("/api/admin/stock", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error al guardar");
      setToast({ type: "ok", msg: "Stock guardado ✓" });
    } catch (e) {
      setToast({ type: "err", msg: e.message });
    } finally {
      setBusy(false);
    }
  }

  if (productos.length === 0) {
    return <div className="card"><span className="muted">No hay productos todavía. Cargá productos en la pestaña Productos.</span></div>;
  }

  return (
    <div className="card">
      <div className="tablewrap">
        <table className="stock">
          <thead>
            <tr>
              <th>Producto</th>
              {sucursales.map((s) => <th key={s.id}>{s.nombre}</th>)}
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="pn">{p.nombre}</div>
                  <div className="pc">{p.categorias?.nombre || "Sin categoría"}</div>
                </td>
                {sucursales.map((s) => {
                  const c = cells[p.id + ":" + s.id];
                  return (
                    <td className="cell" key={s.id}>
                      <div className="cellbox">
                        <input className="smallinput" type="number" value={c.cantidad}
                          onChange={(e) => set(p.id, s.id, { cantidad: e.target.value })} />
                        <label className="toggle" style={{ marginTop: 0 }} title="Disponible">
                          <input type="checkbox" checked={c.disponible} onChange={(e) => set(p.id, s.id, { disponible: e.target.checked })} />
                          <span className="switch"></span>
                        </label>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bar">
        <button className="btn" onClick={guardar} disabled={busy}>{busy ? "Guardando…" : "Guardar stock"}</button>
        {toast && <span className={"toast " + toast.type}>{toast.msg}</span>}
      </div>
    </div>
  );
}
