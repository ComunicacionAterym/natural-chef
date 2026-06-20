export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
      <div>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🥗</div>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Natural Chef</h1>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>La tienda se arma en la Fase 3.</p>
        <a href="/admin" style={{ color: "#16a34a", fontWeight: 600 }}>Ir al panel admin →</a>
      </div>
    </main>
  );
}
