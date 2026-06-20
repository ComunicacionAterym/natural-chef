import { supabaseAdmin } from "@/lib/supabase-server";
import Editor from "./Editor";

export const dynamic = "force-dynamic";

export default async function SucursalesPage() {
  const sb = supabaseAdmin();
  const { data: sucursales } = await sb.from("sucursales").select("*").order("orden");
  const { data: horarios } = await sb.from("horarios").select("*");

  // Agrupo los horarios por sucursal y aseguro los 7 días.
  const data = (sucursales || []).map((s) => {
    const dias = [];
    for (let d = 0; d < 7; d++) {
      const h = (horarios || []).find((x) => x.sucursal_id === s.id && x.dia === d);
      dias.push(
        h
          ? { dia: d, abre: h.abre ? h.abre.slice(0, 5) : "", cierra: h.cierra ? h.cierra.slice(0, 5) : "", cerrado: h.cerrado }
          : { dia: d, abre: "", cierra: "", cerrado: false }
      );
    }
    return { sucursal: s, horarios: dias };
  });

  return (
    <div className="page">
      <div>
        <div className="h-title">Sucursales</div>
        <div className="h-sub">Datos, horarios por día y configuración de envío de cada sede.</div>
      </div>
      {data.length === 0 ? (
        <div className="card">No hay sucursales. Revisá que el SQL se haya corrido bien en Supabase.</div>
      ) : (
        <Editor data={data} />
      )}
    </div>
  );
}
