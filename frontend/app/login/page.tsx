"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { setToken } from "@/lib/auth";
import GoogleButton from "@/app/component/auth/GoogleButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const reason = searchParams.get("reason");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Masukkan email dan password kamu.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data?.token) {
        setToken(res.data.token);
        router.push(redirectTo);
      } else {
        throw new Error("No token received");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login gagal. Cek email dan password kamu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        position: "relative",
      }}
    >
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          fontFamily: "var(--font-display)",
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--on-surface)",
          textDecoration: "none",
        }}
      >
        ← The Social Table
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--surface-container-lowest)",
          borderRadius: "var(--radius-xl)",
          padding: "2.5rem 2rem",
          boxShadow: "var(--shadow-ambient)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--on-surface)",
              marginBottom: "0.375rem",
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--on-surface-variant)",
            }}
          >
            Masuk ke akun kamu untuk lanjut split bill
          </p>
        </div>

        {/* Reason banner */}
        {reason === "save" && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "var(--primary-container)",
              color: "var(--on-primary-container)",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              borderRadius: "var(--radius-lg)",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            💾 Login dulu untuk menyimpan hasil split bill kamu.
          </div>
        )}

        <form onSubmit={handleLogin}>
          {error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "#fef2f2",
                color: "#ba1a1a",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                borderRadius: "var(--radius-lg)",
                marginBottom: "1.25rem",
              }}
            >
              {error}
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <label
                className="label-caps"
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-pill"
                placeholder="nama@email.com"
                required
              />
            </div>
            <div>
              <label
                className="label-caps"
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-pill"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "1.5rem 0",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "var(--outline-variant)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--outline)",
            }}
          >
            or continue with
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "var(--outline-variant)",
            }}
          />
        </div>

        <GoogleButton />

        <p
          style={{
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--on-surface-variant)",
            marginTop: "1.75rem",
          }}
        >
          Belum punya akun?{" "}
          <Link
            href="/register"
            style={{
              color: "var(--primary)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}