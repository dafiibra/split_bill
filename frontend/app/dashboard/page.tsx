"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { removeToken } from "@/lib/auth";
import AuthGuard from "@/app/component/auth/AuthGuard";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <AuthGuard requireAuth={true}>
      <div style={{ minHeight: "100vh", background: "var(--surface)", display: "flex", flexDirection: "column", padding: "1.5rem" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-container-lowest)", padding: "1.25rem 1.75rem", borderRadius: "var(--radius-xl)", maxWidth: "1000px", width: "100%", margin: "0 auto 1.5rem", boxShadow: "var(--shadow-soft)" }}>
          <div>
            <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>← Back to Home</Link>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--on-surface)", marginTop: "0.25rem" }}>Dashboard</h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>Welcome to your protected area</p>
          </div>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.625rem 1.25rem", background: "#fef2f2", color: "#ba1a1a", fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 600, borderRadius: "var(--radius-full)", border: "none", cursor: "pointer" }}>
            🚪 Sign Out
          </button>
        </header>
        <main style={{ flex: 1, maxWidth: "1000px", width: "100%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-container-lowest)", borderRadius: "var(--radius-xl)", padding: "3rem" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "4rem", height: "4rem", borderRadius: "50%", background: "var(--tertiary-container)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", margin: "0 auto 1rem" }}>✅</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--on-surface)", marginBottom: "0.5rem" }}>You are logged in</h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>This page is protected and only visible to authenticated users.</p>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}