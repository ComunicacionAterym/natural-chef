import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { isAuthed } from "@/lib/auth";

export async function POST(request) {
  if (!isAuthed()) return NextResponse.json({ error: "no_auth" }, { status: 401 });
  const b = await request.json();
  const sb = supabaseAdmin();
  const { data: max } = await sb.from("categorias").select("orden").order("orden", { ascending: false }).limit(1).maybeSingle();
  const { error } = await sb.from("categorias").insert({
    nombre: b.nombre, emoji: b.emoji || null, es_especial: !!b.es_especial, activa: true, orden: (max?.orden ?? 0) + 1,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PUT(request) {
  if (!isAuthed()) return NextResponse.json({ error: "no_auth" }, { status: 401 });
  const b = await request.json();
  const sb = supabaseAdmin();
  const { error } = await sb.from("categorias").update({
    nombre: b.nombre, emoji: b.emoji || null, es_especial: !!b.es_especial, activa: !!b.activa, orden: Number(b.orden) || 0,
  }).eq("id", b.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  if (!isAuthed()) return NextResponse.json({ error: "no_auth" }, { status: 401 });
  const b = await request.json();
  const sb = supabaseAdmin();
  const { error } = await sb.from("categorias").delete().eq("id", b.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
