"use client";

import { useState } from "react";

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function Editor({ data }) {
  const [items, setItems] = useState(data);
  const [sel, setSel] = useState(0);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const current = items[sel];

  function setSucursal(patch) {
    setItems((prev) =>
      prev.map((it, i) => (i === sel ? { ...it, sucursal: { ...it.sucursal, ...patch } } : it))
    );
  }
  function setHorario(dia, patch) {
    setItems((prev) =>
      prev.map((it, i) =>
        i === sel
          ? { ...it, horarios: it.horarios.map((h) => (h.dia === dia ? { ...h, ...patch } : h)) }
          : it
      )
    );
  }

  async function guardar() {
    setSaving(true);
    setToast(null);
    try {
      const r = await fetch("/api/admin/sucursales", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sucursal: current.sucursal, horarios: current.horarios }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error al guardar");
      setToast({ type: "ok", msg: "Guardado ✓" });
    } catch (e) {
      setToast({ type: "err", msg: e.message });
    } finally {
      setSaving(false);
    }
  }

  const s = current.sucursal;

  return (
    <>
      <div className="tabs">
        {items.map((it, i) => (
          <button key={it.sucursal.id} className={"tab" + (i === sel ? " active" : "")} onClick={() => { setSel(i); setToast(null); }}>
            {it.sucursal.nombre}
          </button>
        ))}
      </div>

      {/* Datos */}
      <div className="card">
        <h3>Datos de la sucursal</h3>
        <div className="row">
          <div className="field"><label>Nombre</label>
            <input type="text" value={s.nombre || ""} onChange={(e) => setSucursal({ nombre: e.target.value })} /></div>
          <div className="field"><label>Dirección</label>
            <input type="text" value={s.direccion || ""} onChange={(e) => setSucursal({ direccion: e.target.value })} /></div>
        </div>
        <div className="row">
          <div className="field"><label>Teléfono</label>
            <input type="text" value={s.telefono || ""} onChange={(e) => setSucursal({ telefono: e.target.value })} /></div>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={!!s.activa} onChange={(e) => setSucursal({ activa: e.target.checked })} />
          <span className="switch"></span> Sucursal activa (visible en la tienda)
        </label>
      </div>

      {/* Horarios */}
      <div className="card">
        <h3>Horarios por día</h3>
        <div className="dias">
          {current.horarios.map((h) => (
            <div key={h.dia} className={"dia" + (h.cerrado ? " cerrado" : "")}>
              <div className="nombre">{DIAS[h.dia]}</div>
              <div>
                <div className="minilabel">Abre</div>
                <input type="time" value={h.abre || ""} onChange={(e) => setHorario(h.dia, { abre: e.target.value })} />
              </div>
              <div>
                <div className="minilabel">Cierra</div>
                <input type="time" value={h.cierra || ""} onChange={(e) => setHorario(h.dia, { cierra: e.target.value })} />
              </div>
              <label className="toggle" style={{ marginTop: 0 }}>
                <input type="checkbox" checked={!!h.cerrado} onChange={(e) => setHorario(h.dia, { cerrado: e.target.checked })} />
                <span className="switch"></span> Cerrado
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Envío */}
      <div className="card">
        <h3>Envío</h3>
        <label className="toggle">
          <input type="checkbox" checked={!!s.hace_envio} onChange={(e) => setSucursal({ hace_envio: e.target.checked })} />
          <span className="switch"></span> Esta sucursal hace envíos
        </label>
        {s.hace_envio && (
          <div className="row">
            <div className="field"><label>Costo de envío ($)</label>
              <input type="number" value={s.costo_envio ?? 0} onChange={(e) => setSucursal({ costo_envio: e.target.value })} /></div>
            <div className="field"><label>Pedido mínimo para envío ($)</label>
              <input type="number" value={s.envio_minimo ?? 0} onChange={(e) => setSucursal({ envio_minimo: e.target.value })} /></div>
            <div className="field"><label>Envío gratis desde ($) — opcional</label>
              <input type="number" value={s.envio_gratis_desde ?? ""} onChange={(e) => setSucursal({ envio_gratis_desde: e.target.value })} /></div>
          </div>
        )}
      </div>

      <div className="bar">
        <button className="btn" onClick={guardar} disabled={saving}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {toast && <span className={"toast " + toast.type}>{toast.msg}</span>}
      </div>
    </>
  );
}
