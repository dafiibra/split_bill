"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useSlowWarning } from "@/lib/useSlowWarning";
import GoogleButton from "@/app/component/auth/GoogleButton";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const slow = useSlowWarning(loading);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/register", { name, email, password });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-content">
      {/* Header Text */}
      <div className="auth-form-header">
        <h2 className="auth-form-title">Join the table</h2>
        <p className="auth-form-subtitle">Create an account and start splitting bills effortlessly.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="auth-form">
        {error && <div className="auth-error">{error}</div>}
        {slow && (
          <div style={{ padding: "0.75rem 1rem", background: "var(--primary-container)", color: "var(--on-primary-container, #663938)", fontFamily: "var(--font-body)", fontSize: "0.8125rem", borderRadius: "var(--radius-lg, 2rem)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            ⏳ Server lagi bangun, tunggu sebentar ya 🙏
          </div>
        )}


        <div className="auth-field">
          <label className="auth-label" htmlFor="reg-email">
            Email Address
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="hello@socialtable.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="reg-password">
            Password
          </label>
          <div className="auth-input-wrapper">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="Minimal 8 karakter"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          type="submit"
          disabled={loading}
          className="auth-submit-btn"
        >
          {loading ? "Creating account..." : "Register\u2019 🍽️"}
        </button>
      </form>

      {/* Divider */}
      <div className="auth-divider">
        <div className="auth-divider-line" />
        <span className="auth-divider-text">Or continue with</span>
        <div className="auth-divider-line" />
      </div>

      {/* Google Button */}
      <GoogleButton />

      {/* Footer micro-copy (mobile) */}
      <p className="auth-micro-copy">
        By joining, you agree to our{" "}
        <span className="auth-micro-link">Table Manners</span> policy.
      </p>

      {/* Switch to Login (desktop) */}
      <p className="auth-switch-text desktop-only-switch">
        Sudah punya akun?{" "}
        <Link href="/login" className="auth-switch-link">
          Sign in
        </Link>
      </p>

      <style jsx>{`
        .auth-form-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .auth-form-header {
          text-align: center;
        }
        .auth-form-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.875rem;
          color: var(--on-surface);
          margin: 0 0 0.5rem 0;
        }
        .auth-form-subtitle {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: var(--on-surface-variant);
          margin: 0;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .auth-error {
          padding: 0.75rem 1rem;
          background: #fef2f2;
          color: #ba1a1a;
          font-family: var(--font-body);
          font-size: 0.8125rem;
          border-radius: var(--radius-lg, 2rem);
        }
        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .auth-label {
          font-family: var(--font-body);
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--on-surface-variant);
          margin-left: 1rem;
        }
        .auth-input-wrapper {
          position: relative;
        }
        .auth-input {
          width: 100%;
          padding: 1rem 1.5rem;
          background: var(--surface-container-lowest, #ffffff);
          border: none;
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: var(--on-surface);
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-input::placeholder {
          color: var(--outline-variant, #b2aca9);
        }
        .auth-input:focus {
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(127, 78, 77, 0.2);
        }
        .auth-eye-btn {
          position: absolute;
          right: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--outline-variant, #b2aca9);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          transition: color 0.3s ease;
        }
        .auth-eye-btn:hover {
          color: var(--on-surface-variant);
        }
        .auth-submit-btn {
          width: 100%;
          padding: 1.125rem;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, #7f4e4d 0%, #923f5f 100%);
          color: #ffffff;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.125rem;
          border: none;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 12px 24px rgba(127, 78, 77, 0.2);
        }
        .auth-submit-btn:hover:not(:disabled) {
          transform: scale(1.02);
        }
        .auth-submit-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }
        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: var(--outline-variant, #b2aca9);
          opacity: 0.2;
        }
        .auth-divider-text {
          font-family: var(--font-body);
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--outline-variant, #b2aca9);
          white-space: nowrap;
        }
        .auth-micro-copy {
          text-align: center;
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--on-surface-variant);
          line-height: 1.6;
          margin: 0;
          padding-top: 0.5rem;
        }
        .auth-micro-link {
          color: var(--primary);
          font-weight: 700;
          cursor: pointer;
        }
        .auth-switch-text {
          text-align: center;
          font-family: var(--font-body);
          font-size: 0.8125rem;
          color: var(--on-surface-variant);
          margin: 0;
        }
        .auth-switch-link {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
        }
        .desktop-only-switch {
          display: none;
        }
        @media (min-width: 768px) {
          .auth-form-header {
            text-align: left;
          }
          .auth-micro-copy {
            display: none;
          }
          .desktop-only-switch {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}