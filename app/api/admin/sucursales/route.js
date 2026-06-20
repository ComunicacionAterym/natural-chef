import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { isAuthed } from "@/lib/auth";

export async function PUT(request) {
  if (!isAuthed()) return NextResponse.json({ error: "no_auth" }, { status: 401 });

  const { sucursal, horarios } = await request.json();
  const sb = supabaseAdmin();

  const { error: e1 } = await sb
    .from("sucursales")
    .update({
      nombre: sucursal.nombre,
      direccion: sucursal.direccion,
      telefono: sucursal.telefono,
      hace_envio: sucursal.hace_envio,
      costo_envio: Number(sucursal.costo_envio) || 0,
      envio_minimo: Number(sucursal.envio_minimo) || 0,
      envio_gratis_desde: sucursal.envio_gratis_desde === "" || sucursal.envio_gratis_desde == null
        ? null : Number(sucursal.envio_gratis_desde),
      activa: sucursal.activa,
    })
    .eq("id", sucursal.id);
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });

  const rows = (horarios || []).map((h) => ({
    sucursal_id: sucursal.id,
    dia: h.dia,
    abre: h.cerrado ? null : (h.abre || null),
    cierra: h.cerrado ? null : (h.cierra || null),
    cerrado: !!h.cerrado,
  }));
  const { error: e2 } = await sb.from("horarios").upsert(rows, { onConflict: "sucursal_id,dia" });
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
