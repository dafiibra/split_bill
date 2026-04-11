"use client";

import Link from "next/link";
import { Navbar, Footer } from "@/app/component/layout";

export default function GroupsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card" style={{ textAlign: "center", maxWidth: "420px", width: "100%" }}>
          <div style={{ width: "4rem", height: "4rem", borderRadius: "var(--radius-xl)", background: "var(--secondary-container)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", margin: "0 auto 1.25rem" }}>👥</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--on-surface)", marginBottom: "0.5rem" }}>Group Sharing</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.6, marginBottom: "1.5rem" }}>Undang teman masuk ke group via link belanja bareng. Fitur ini segera hadir!</p>
          <Link href="/" className="btn-primary" style={{ justifyContent: "center" }}>← Kembali ke Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}