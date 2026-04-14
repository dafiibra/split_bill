"use client";

import Link from "next/link";
import { ReactNode, useEffect } from "react";
import { warmupServer } from "@/lib/warmup";

/* ─── Floating Decorative Cards ─── */
function FloatingCards() {
  return (
    <div className="floating-cards-container">
      {/* Coffee Run Card */}
      <div className="floating-card card-coffee">
        <div className="floating-card-icon" style={{ background: "var(--primary-container)" }}>
          <span style={{ fontSize: "1rem" }}>☕</span>
        </div>
        <div>
          <p className="floating-card-label">COFFEE RUN</p>
          <p className="floating-card-value" style={{ color: "var(--primary)" }}>Rp 45.000</p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="floating-card card-balance">
        <div className="floating-card-icon" style={{ background: "var(--tertiary-container, #ffd1dc)" }}>
          <span style={{ fontSize: "1rem" }}>💳</span>
        </div>
        <div>
          <p className="floating-card-label">BALANCE</p>
          <p className="floating-card-value" style={{ color: "var(--secondary)" }}>Split Sent!</p>
        </div>
      </div>

      <style jsx>{`
        .floating-cards-container {
          position: relative;
          width: 100%;
          height: 160px;
          margin-top: 1rem;
        }
        .floating-card {
          position: absolute;
          background: var(--surface-container-lowest, #ffffff);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-xl, 3rem);
          box-shadow: 0 20px 40px rgba(127, 78, 77, 0.08);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .card-coffee {
          top: 0;
          left: 0;
          transform: rotate(-6deg);
          animation: floatA 4s ease-in-out infinite;
        }
        .card-balance {
          bottom: 0;
          right: 2.5rem;
          transform: rotate(4deg);
          animation: floatB 5s ease-in-out infinite 1s;
        }
        .floating-card-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: var(--radius-full, 9999px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .floating-card-label {
          font-family: var(--font-body);
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--on-surface-variant);
          opacity: 0.6;
          margin: 0 0 0.125rem 0;
        }
        .floating-card-value {
          font-family: var(--font-display);
          font-size: 0.9375rem;
          font-weight: 700;
          margin: 0;
        }
        @keyframes floatA {
          0%, 100% { transform: rotate(-6deg) translateY(0px); }
          50% { transform: rotate(-6deg) translateY(-10px); }
        }
        @keyframes floatB {
          0%, 100% { transform: rotate(4deg) translateY(0px); }
          50% { transform: rotate(4deg) translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

/* ─── Floating Icon Bubbles (Mobile) ─── */
function FloatingBubbles() {
  return (
    <div className="floating-bubbles">
      <div className="bubble bubble-wallet">
        <span>💳</span>
      </div>
      <div className="bubble bubble-payment">
        <span>💰</span>
      </div>
      <div className="bubble bubble-food">
        <span>🍽️</span>
      </div>

      <style jsx>{`
        .floating-bubbles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .bubble {
          position: absolute;
          border-radius: var(--radius-full, 9999px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }
        .bubble-wallet {
          top: 0;
          right: 1rem;
          width: 3.5rem;
          height: 3.5rem;
          background: var(--tertiary-container, #ffd1dc);
          font-size: 1.25rem;
          animation: floatA 4s ease-in-out infinite;
        }
        .bubble-payment {
          bottom: 1rem;
          left: 50%;
          transform: translateX(-3rem);
          width: 3rem;
          height: 3rem;
          background: var(--primary-container);
          font-size: 1rem;
          animation: floatB 5s ease-in-out infinite 1s;
        }
        .bubble-food {
          top: 50%;
          right: 0;
          width: 2.5rem;
          height: 2.5rem;
          background: var(--secondary-container);
          font-size: 0.875rem;
          animation: floatA 6s ease-in-out infinite 0.5s;
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateX(-3rem) translateY(0px); }
          50% { transform: translateX(-3rem) translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

/* ─── Main Auth Layout ─── */
interface AuthLayoutProps {
  children: ReactNode;
  activeTab: "login" | "register";
}

export default function AuthLayout({ children, activeTab }: AuthLayoutProps) {
  useEffect(() => {
    warmupServer();
  }, []);

  return (
    <div className="auth-page">
      {/* ── Glassmorphism Header ── */}
      <header className="auth-header glass-header">
        <Link href="/" className="auth-logo">
          <span className="auth-logo-icon">☕</span>
          <span className="auth-logo-text">The Social Table</span>
        </Link>
        <div className="auth-header-action">
          <button className="help-btn" aria-label="Help">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
        </div>
      </header>

      <main className="auth-main">
        {/* ── Left: Marketing Hero (Desktop Only) ── */}
        <section className="auth-hero">
          <div className="auth-hero-content">
            {/* Badge */}
            <div className="hero-badge">
              <span style={{ fontSize: "0.75rem" }}>✨</span>
              <span>MEET THE MODERN HOST</span>
            </div>

            {/* Headline */}
            <h1 className="hero-headline">
              Effortless clarity for every transaction.
            </h1>

            {/* Subtext */}
            <p className="hero-subtext">
              Stop the awkward &ldquo;who-owes-what&rdquo; math. From boutique lattes to dinner banquets, we handle the split while you handle the memories.
            </p>

            {/* Floating Cards */}
            <FloatingCards />
          </div>

          {/* Abstract Background Shapes */}
          <div className="hero-bg-shape hero-bg-shape-1" />
          <div className="hero-bg-shape hero-bg-shape-2" />
        </section>

        {/* ── Right: Auth Form Container ── */}
        <section className="auth-form-section">
          <div className="auth-form-wrapper">
            {/* Mobile Hero (shown only on mobile) */}
            <div className="mobile-hero">
              <div className="mobile-hero-inner">
                <h1 className="mobile-hero-headline">
                  Effortless clarity for every transaction
                </h1>
                <p className="mobile-hero-subtext">
                  Gather your friends, split the bill, and savor the moment.
                </p>
                <FloatingBubbles />
              </div>
            </div>

            {/* Auth Card */}
            <div className="auth-card">
              {/* Tab Switcher */}
              <nav
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#e3dbd8",
                  padding: "6px",
                  borderRadius: "9999px",
                  gap: 0,
                }}
              >
                <Link
                  href="/login"
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    borderRadius: "9999px",
                    textAlign: "center" as const,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "block",
                    lineHeight: 1,
                    ...(activeTab === "login"
                      ? {
                          background: "#ffffff",
                          color: "#7f4e4d",
                          boxShadow: "0 2px 8px rgba(127, 78, 77, 0.1)",
                        }
                      : {
                          background: "transparent",
                          color: "#5f5b59",
                          boxShadow: "none",
                        }),
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    borderRadius: "9999px",
                    textAlign: "center" as const,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "block",
                    lineHeight: 1,
                    ...(activeTab === "register"
                      ? {
                          background: "#ffffff",
                          color: "#7f4e4d",
                          boxShadow: "0 2px 8px rgba(127, 78, 77, 0.1)",
                        }
                      : {
                          background: "transparent",
                          color: "#5f5b59",
                          boxShadow: "none",
                        }),
                  }}
                >
                  Register
                </Link>
              </nav>

              {/* Form Content (injected) */}
              {children}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="auth-footer">
        <p className="auth-footer-copy">
          © 2025 THE SOCIAL TABLE. ALL RIGHTS RESERVED.
        </p>
        <div className="auth-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>

      {/* ── Decorative blur (mobile bottom) ── */}
      <div className="auth-bottom-glow" />

      <style jsx>{`
        /* ═══════════════════════════════════════
           AUTH PAGE — FULL LAYOUT
           ═══════════════════════════════════════ */
        .auth-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--surface);
          position: relative;
        }

        /* ── Header ── */
        .auth-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: rgba(252, 245, 242, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .auth-logo-icon {
          font-size: 1.25rem;
          display: none;
        }
        .auth-logo-text {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.125rem;
          letter-spacing: -0.02em;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .help-btn {
          background: none;
          border: none;
          color: var(--on-primary-container, #704241);
          opacity: 0.6;
          cursor: pointer;
          padding: 0.25rem;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
        }
        .help-btn:hover {
          opacity: 1;
        }

        /* ── Main Split Layout ── */
        .auth-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-top: 4rem;
        }

        /* ── Hero Section (Desktop) ── */
        .auth-hero {
          display: none;
          flex: 1;
          position: relative;
          overflow: hidden;
          background: var(--surface-container-low);
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }
        .auth-hero-content {
          position: relative;
          z-index: 10;
          max-width: 32rem;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--secondary-container);
          color: var(--on-secondary-container, #7a2b4a);
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .hero-headline {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          color: var(--on-surface);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin: 0 0 1.5rem 0;
        }
        .hero-subtext {
          font-family: var(--font-body);
          font-size: 1.0625rem;
          color: var(--on-surface-variant);
          line-height: 1.7;
          max-width: 26rem;
          margin: 0 0 2.5rem 0;
        }
        .hero-bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
        }
        .hero-bg-shape-1 {
          bottom: -6rem;
          left: -6rem;
          width: 24rem;
          height: 24rem;
          background: rgba(127, 78, 77, 0.05);
        }
        .hero-bg-shape-2 {
          top: 6rem;
          right: 0;
          width: 16rem;
          height: 16rem;
          background: rgba(146, 63, 95, 0.05);
        }

        /* ── Form Section ── */
        .auth-form-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: var(--surface);
        }
        .auth-form-wrapper {
          width: 100%;
          max-width: 28rem;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* ── Mobile Hero ── */
        .mobile-hero {
          display: block;
          position: relative;
          padding: 2rem 0 1rem;
        }
        .mobile-hero-inner {
          position: relative;
        }
        .mobile-hero-headline {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 2rem;
          color: var(--primary);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 0.75rem 0;
        }
        .mobile-hero-subtext {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: var(--on-surface-variant);
          font-weight: 500;
          margin: 0;
          line-height: 1.5;
        }

        /* ── Auth Card ── */
        .auth-card {
          background: var(--surface-container-low);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          flex-grow: 1;
        }

        /* ── Tabs (inline styled, CSS removed) ── */

        /* ── Footer ── */
        .auth-footer {
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 2rem 3rem;
          display: none;
          justify-content: space-between;
          align-items: center;
        }
        .auth-footer-copy {
          font-family: var(--font-body);
          font-size: 0.6875rem;
          color: var(--on-surface-variant);
          opacity: 0.6;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .auth-footer-links {
          display: flex;
          gap: 2rem;
        }
        .auth-footer-links a {
          font-family: var(--font-body);
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--on-surface-variant);
          opacity: 0.8;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: color 0.3s ease;
        }
        .auth-footer-links a:hover {
          color: var(--primary);
        }

        /* ── Bottom Glow (Mobile) ── */
        .auth-bottom-glow {
          display: block;
          position: fixed;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 16rem;
          height: 16rem;
          background: rgba(146, 63, 95, 0.1);
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.2;
        }

        /* ═══════════════════════════════════════
           DESKTOP BREAKPOINT (768px+)
           ═══════════════════════════════════════ */
        @media (min-width: 768px) {
          .auth-main {
            flex-direction: row;
            padding-top: 4rem;
            min-height: 100vh;
          }
          .auth-hero {
            display: flex;
          }
          .mobile-hero {
            display: none;
          }
          .auth-logo-icon {
            display: none;
          }
          .auth-form-section {
            padding: 3rem;
          }
          .auth-card {
            padding: 1.5rem;
            background: transparent;
          }
          .auth-footer {
            display: flex;
          }
          .auth-bottom-glow {
            display: none;
          }
          .auth-form-wrapper {
            max-width: 28rem;
          }
        }

        /* ── Mobile Small (below 380px) ── */
        @media (max-width: 380px) {
          .auth-card {
            padding: 1.25rem;
          }
          .mobile-hero-headline {
            font-size: 1.75rem;
          }
        }

        /* ── Mobile (below 768px) ── */
        @media (max-width: 767px) {
          .auth-logo-icon {
            display: inline;
          }
          .auth-main {
            padding-top: 5rem;
            padding-bottom: 2rem;
          }
          .auth-form-section {
            padding: 0 1.5rem 2rem;
          }
          .auth-card {
            flex-grow: 1;
          }
        }
      `}</style>
    </div>
  );
}