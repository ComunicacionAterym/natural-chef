import { supabaseAdmin } from "@/lib/supabase-server";
import Grid from "./Grid";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const sb = supabaseAdmin();
  const { data: productos } = await sb.from("productos").select("*, categorias(nombre)").order("orden");
  const { data: sucursales } = await sb.from("sucursales").select("*").order("orden");
  const { data: stock } = await sb.from("stock").select("*");
  return (
    <div className="page">
      <div>
        <div className="h-title">Stock</div>
        <div className="h-sub">Cantidad disponible por sucursal. El switch fuerza "no disponible" aunque haya stock.</div>
      </div>
      <Grid productos={productos || []} sucursales={sucursales || []} stock={stock || []} />
    </div>
  );
}
