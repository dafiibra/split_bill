"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Split your bill", href: "/", active: true },
  { label: "History", href: "/history" },
];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  return (
    <header className="glass-header sticky top-0 z-50">
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            fontWeight: 800,
            color: "transparent",
            backgroundImage: "var(--gradient-primary)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            fontStyle: "italic",
          }}
        >
          Split Bill
        </Link>

        {/* Nav links — desktop */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.875rem",
                fontWeight: link.active ? 600 : 400,
                color: link.active
                  ? "var(--on-surface)"
                  : "var(--on-surface-variant)",
                textDecoration: link.active ? "underline" : "none",
                textUnderlineOffset: "6px",
                textDecorationThickness: "2px",
                transition: "color 0.3s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--on-surface-variant)",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
              >
                Login
              </Link>
              <Link href="/register" className="btn-primary" style={{ padding: "0.625rem 1.25rem", fontSize: "0.8125rem" }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile responsive inline style */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}