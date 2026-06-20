import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { isAuthed } from "@/lib/auth";

export async function PUT(request) {
  if (!isAuthed()) return NextResponse.json({ error: "no_auth" }, { status: 401 });
  const { updates } = await request.json();
  const rows = (updates || []).map((u) => ({
    producto_id: u.producto_id,
    sucursal_id: u.sucursal_id,
    cantidad: Number(u.cantidad) || 0,
    disponible: u.disponible !== false,
  }));
  if (!rows.length) return NextResponse.json({ ok: true });
  const sb = supabaseAdmin();
  const { error } = await sb.from("stock").upsert(rows, { onConflict: "producto_id,sucursal_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
