"use client";

import Link from "next/link";
import LoginForm from "@/app/component/auth/LoginForm";

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", position: "relative" }}>
      <Link href="/" style={{ position: "absolute", top: "1.5rem", left: "1.5rem", fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "var(--on-surface)", textDecoration: "none" }}>
        ← The Social Table
      </Link>
      <LoginForm />
    </div>
  );
}