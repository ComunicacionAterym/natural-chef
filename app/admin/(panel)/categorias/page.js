import { supabaseAdmin } from "@/lib/supabase-server";
import Editor from "./Editor";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const sb = supabaseAdmin();
  const { data: categorias } = await sb.from("categorias").select("*").order("orden");
  return (
    <div className="page">
      <div>
        <div className="h-title">Categorías</div>
        <div className="h-sub">Las secciones del menú (Pasta Fresca, Ensaladas, etc.). Las "especiales" se muestran destacadas.</div>
      </div>
      <Editor categorias={categorias || []} />
    </div>
  );
}
