import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import Nav from "./Nav";

export const dynamic = "force-dynamic";

export default function PanelLayout({ children }) {
  if (!isAuthed()) redirect("/admin/login");

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
      <Nav />
      {children}
    </div>
  );
}
