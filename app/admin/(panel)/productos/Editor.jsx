"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function buildStock(sucursales, stock, productoId) {
  return sucursales.map((su) => {
    const ex = (stock || []).find((s) => s.producto_id === productoId && s.sucursal_id === su.id);
    return {
      sucursal_id: su.id,
      nombre: su.nombre,
      cantidad: ex ? ex.cantidad : 0,
      disponible: ex ? ex.disponible : true,
    };
  });
}

export default function Editor({ productos, categorias, sucursales, stock }) {
  const router = useRouter();
  const [form, setForm] = useState(null); // null = cerrado
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const catById = useMemo(() => Object.fromEntries(categorias.map((c) => [c.id, c])), [categorias]);

  function nuevo() {
    setToast(null);
    setForm({
      id: null,
      categoria_id: categorias[0]?.id || "",
      nombre: "",
      descripcion: "",
      precio: "",
      cantidad: "",
      gramos: "",
      activo: true,
      stock: buildStock(sucursales, [], null),
    });
  }

  function editar(p) {
    setToast(null);
    setForm({
      id: p.id,
      categoria_id: p.categoria_id || "",
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      precio: p.precio ?? "",
      cantidad: p.cantidad || "",
      gramos: p.gramos ?? "",
      activo: p.activo !== false,
      stock: buildStock(sucursales, stock, p.id),
    });
  }

  async function guardar() {
    if (!form.nombre.trim()) { setToast({ type: "err", msg: "Falta el nombre" }); return; }
    setBusy(true);
    setToast(null);
    try {
      const r = await fetch("/api/admin/productos", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error al guardar");
      setForm(null);
      router.refresh();
    } catch (e) {
      setToast({ type: "err", msg: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function borrar(p) {
    if (!confirm("¿Borrar el producto " + p.nombre + "?")) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/productos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error");
      router.refresh();
    } catch (e) {
      setToast({ type: "err", msg: e.message });
    } finally {
      setBusy(false);
    }
  }

  // agrupo productos por categoría (en el orden de las categorías)
  const grupos = categorias.map((c) => ({
    cat: c,
    items: productos.filter((p) => p.categoria_id === c.id),
  }));
  const sinCat = productos.filter((p) => !p.categoria_id);

  return (
    <>
      {!form && (
        <div style={{ marginTop: 18 }}>
          <button className="btn full" onClick={nuevo}>+ Nuevo producto</button>
        </div>
      )}

      {form && (
        <div className="panel">
          <h3>{form.id ? "Editar producto" : "Nuevo producto"}</h3>
          <div className="row">
            <div className="field" style={{ flex: "1 1 220px" }}>
              <label>Nombre</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>
            <div className="field" style={{ flex: "1 1 180px" }}>
              <label>Categoría</label>
              <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                style={{ background: "var(--bg2)", border: "1px solid var(--line)", color: "var(--text)", padding: "11px 13px", borderRadius: 10, fontSize: 14 }}>
                <option value="">— sin categoría —</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.emoji ? c.emoji + " " : ""}{c.nombre}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Descripción</label>
            <input type="text" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="ej: Tallarines con estofado de carne" />
          </div>
          <div className="row">
            <div className="field"><label>Precio ($)</label>
              <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} /></div>
            <div className="field"><label>Cantidad (texto)</label>
              <input type="text" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: e.target.value })} placeholder="x6, 1 porción…" /></div>
            <div className="field"><label>Gramos</label>
              <input type="number" value={form.gramos} onChange={(e) => setForm({ ...form, gramos: e.target.value })} placeholder="500" /></div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
            <span className="switch"></span> Producto activo
          </label>

          <div className="stockbox">
            <div className="minilabel" style={{ marginBottom: 6 }}>STOCK POR SUCURSAL</div>
            {form.stock.map((s, i) => (
              <div className="srow" key={s.sucursal_id}>
                <span className="sname">{s.nombre}</span>
                <div className="cellbox">
                  <span className="minilabel">Cantidad</span>
                  <input className="smallinput" type="number" value={s.cantidad}
                    onChange={(e) => { const st = [...form.stock]; st[i] = { ...st[i], cantidad: e.target.value }; setForm({ ...form, stock: st }); }} />
                </div>
                <label className="toggle" style={{ marginTop: 0 }}>
                  <input type="checkbox" checked={s.disponible}
                    onChange={(e) => { const st = [...form.stock]; st[i] = { ...st[i], disponible: e.target.checked }; setForm({ ...form, stock: st }); }} />
                  <span className="switch"></span> Disponible
                </label>
              </div>
            ))}
          </div>

          <div className="bar">
            <button className="btn" onClick={guardar} disabled={busy}>{busy ? "Guardando…" : "Guardar producto"}</button>
            <button className="ghost" onClick={() => setForm(null)}>Cancelar</button>
            {toast && <span className={"toast " + toast.type}>{toast.msg}</span>}
          </div>
        </div>
      )}

      {[...grupos, { cat: { id: "_sin", nombre: "Sin categoría", emoji: "📂" }, items: sinCat }]
        .filter((g) => g.items.length > 0)
        .map((g) => (
          <div className="catgroup" key={g.cat.id}>
            <div className="ghead">
              <span>{g.cat.emoji || "🏷️"}</span> {g.cat.nombre}
              {g.cat.es_especial && <span className="badge amber">Especial</span>}
            </div>
            <div className="card" style={{ marginTop: 8 }}>
              <div className="list">
                {g.items.map((p) => (
                  <div className="item" key={p.id}>
                    <span className="ico">🍽️</span>
                    <div className="meta">
                      <div className="nm">{p.nombre} {!p.activo && <span className="badge">Oculto</span>}</div>
                      <div className="sb">
                        ${Number(p.precio).toLocaleString("es-AR")}
                        {p.cantidad ? " · " + p.cantidad : ""}{p.gramos ? " · " + p.gramos + " g" : ""}
                        {p.descripcion ? " · " + p.descripcion : ""}
                      </div>
                    </div>
                    <div className="acts">
                      <button className="iconbtn" onClick={() => editar(p)} title="Editar">✏️</button>
                      <button className="iconbtn danger" disabled={busy} onClick={() => borrar(p)} title="Borrar">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

      {productos.length === 0 && !form && (
        <div className="card"><span className="muted">Todavía no cargaste productos. Tocá “Nuevo producto”.</span></div>
      )}
    </>
  );
}
