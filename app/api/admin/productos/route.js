import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { isAuthed } from "@/lib/auth";

function stockRows(productoId, stock) {
  return (stock || []).map((s) => ({
    producto_id: productoId,
    sucursal_id: s.sucursal_id,
    cantidad: Number(s.cantidad) || 0,
    disponible: s.disponible !== false,
  }));
}

export async function POST(request) {
  if (!isAuthed()) return NextResponse.json({ error: "no_auth" }, { status: 401 });
  const b = await request.json();
  const sb = supabaseAdmin();
  const { data: max } = await sb.from("productos").select("orden").order("orden", { ascending: false }).limit(1).maybeSingle();
  const { data: prod, error } = await sb.from("productos").insert({
    categoria_id: b.categoria_id || null,
    nombre: b.nombre,
    descripcion: b.descripcion || null,
    precio: Number(b.precio) || 0,
    cantidad: b.cantidad || null,
    gramos: b.gramos ? Number(b.gramos) : null,
    activo: b.activo !== false,
    orden: (max?.orden ?? 0) + 1,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = stockRows(prod.id, b.stock);
  if (rows.length) {
    const { error: e2 } = await sb.from("stock").upsert(rows, { onConflict: "producto_id,sucursal_id" });
    if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function PUT(request) {
  if (!isAuthed()) return NextResponse.json({ error: "no_auth" }, { status: 401 });
  const b = await request.json();
  const sb = supabaseAdmin();
  const { error } = await sb.from("productos").update({
    categoria_id: b.categoria_id || null,
    nombre: b.nombre,
    descripcion: b.descripcion || null,
    precio: Number(b.precio) || 0,
    cantidad: b.cantidad || null,
    gramos: b.gramos ? Number(b.gramos) : null,
    activo: b.activo !== false,
  }).eq("id", b.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = stockRows(b.id, b.stock);
  if (rows.length) {
    const { error: e2 } = await sb.from("stock").upsert(rows, { onConflict: "producto_id,sucursal_id" });
    if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  if (!isAuthed()) return NextResponse.json({ error: "no_auth" }, { status: 401 });
  const b = await request.json();
  const sb = supabaseAdmin();
  const { error } = await sb.from("productos").delete().eq("id", b.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
