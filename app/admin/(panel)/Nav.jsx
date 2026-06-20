"use client";

import { usePathname } from "next/navigation";

const items = [
  { href: "/admin/sucursales", label: "Sucursales", icon: "🏪" },
  { href: "/admin/categorias", label: "Categorías", icon: "🏷️" },
  { href: "/admin/productos", label: "Productos", icon: "🍽️" },
  { href: "/admin/stock", label: "Stock", icon: "📦" },
  { label: "Pedidos", icon: "🧾", soon: true },
  { label: "Cupones", icon: "🎟️", soon: true },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav">
      {items.map((n, i) =>
        n.soon ? (
          <span key={i} className="soon">
            <span>{n.icon}</span> {n.label} <b>pronto</b>
          </span>
        ) : (
          <a key={i} href={n.href} className={path === n.href ? "active" : ""}>
            <span>{n.icon}</span> {n.label}
          </a>
        )
      )}
    </nav>
  );
}
