import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🍽️</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--on-surface)", marginBottom: "0.5rem" }}>
          Halaman nggak ketemu
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface-variant)", marginBottom: "2rem" }}>
          Kayaknya kamu salah jalan. Balik ke meja yuk!
        </p>
        <Link href="/" className="btn-primary">← Kembali ke Home</Link>
      </div>
    </div>
  );
}