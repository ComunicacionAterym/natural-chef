import { supabaseAdmin } from "@/lib/supabase-server";
import Editor from "./Editor";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const sb = supabaseAdmin();
  const { data: productos } = await sb.from("productos").select("*").order("orden");
  const { data: categorias } = await sb.from("categorias").select("*").order("orden");
  const { data: sucursales } = await sb.from("sucursales").select("*").order("orden");
  const { data: stock } = await sb.from("stock").select("*");
  return (
    <div className="page">
      <div>
        <div className="h-title">Productos</div>
        <div className="h-sub">Precio, descripción, cantidad y gramos. El stock por sucursal se carga en cada producto.</div>
      </div>
      <Editor
        productos={productos || []}
        categorias={categorias || []}
        sucursales={sucursales || []}
        stock={stock || []}
      />
    </div>
  );
}
