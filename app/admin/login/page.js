"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function entrar(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error || "No se pudo entrar");
      }
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <form className="box" onSubmit={entrar}>
        <div className="dot">🥗</div>
        <h1 style={{ textAlign: "center", fontSize: 20, fontWeight: 800 }}>Panel Natural Chef</h1>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
          Ingresá tu contraseña
        </p>
        <div className="field" style={{ marginTop: 18 }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoFocus
          />
        </div>
        {error && <div className="err">{error}</div>}
        <button className="btn full" style={{ marginTop: 16 }} disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
