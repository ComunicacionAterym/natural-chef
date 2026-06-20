import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function PanelLayout({ children }) {
  if (!isAuthed()) redirect("/admin/login");

  const nav = [
    { href: "/admin/sucursales", label: "Sucursales", icon: "🏪", ready: true },
    { label: "Categorías", icon: "🏷️", ready: false },
    { label: "Productos", icon: "🍽️", ready: false },
    { label: "Stock", icon: "📦", ready: false },
    { label: "Pedidos", icon: "🧾", ready: false },
    { label: "Cupones", icon: "🎟️", ready: false },
  ];

  return (
    <div className="admin">
      <div className="topbar">
        <div className="brand">
          <span className="dot">🥗</span>
          <span>
            Admin Panel
            <small>Natural Chef</small>
          </span>
        </div>
        <a className="ghost" href="/api/admin/logout-redirect">Salir</a>
      </div>
      <nav className="nav">
        {nav.map((n, i) =>
          n.ready ? (
            <a key={i} href={n.href} className={n.label === "Sucursales" ? "active" : ""}>
              <span>{n.icon}</span> {n.label}
            </a>
          ) : (
            <span key={i} className="soon">
              <span>{n.icon}</span> {n.label} <b>pronto</b>
            </span>
          )
        )}
      </nav>
      {children}
    </div>
  );
}
