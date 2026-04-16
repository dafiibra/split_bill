"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Split your bill", href: "/split-bill", active: true },
  { label: "History", href: "/history" },
];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="glass-header" style={{ position: "sticky", top: 0, zIndex: 50 }}>
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
        <nav className="nav-desktop">
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

        {/* Auth actions — desktop */}
        <div className="auth-desktop">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--primary)",
                background: "none",
                border: "1px solid var(--primary)",
                borderRadius: "9999px",
                padding: "0.5rem 1.25rem",
                cursor: "pointer",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)";
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)";
              }}
            >
              Logout
            </button>
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

        {/* Hamburger button — mobile only */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            style={{
              display: "block",
              width: "1.25rem",
              height: "2px",
              background: "var(--on-surface)",
              borderRadius: "1px",
              transition: "all 0.3s ease",
              transform: mobileMenuOpen ? "rotate(45deg) translateY(5px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "1.25rem",
              height: "2px",
              background: "var(--on-surface)",
              borderRadius: "1px",
              transition: "all 0.3s ease",
              opacity: mobileMenuOpen ? 0 : 1,
              margin: "3px 0",
            }}
          />
          <span
            style={{
              display: "block",
              width: "1.25rem",
              height: "2px",
              background: "var(--on-surface)",
              borderRadius: "1px",
              transition: "all 0.3s ease",
              transform: mobileMenuOpen ? "rotate(-45deg) translateY(-5px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              padding: "0.5rem 1.5rem 1.25rem",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--on-surface)",
                  textDecoration: "none",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--surface-container-low)",
                  transition: "background 0.2s ease",
                }}
              >
                {link.label === "Split your bill" ? "🧾 " : "🕐 "}
                {link.label}
              </Link>
            ))}

            {/* Auth links in mobile menu */}
            <div style={{ marginTop: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid var(--outline-variant)" }}>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--primary)",
                    background: "none",
                    border: "1px solid var(--primary)",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-lg)",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: "center", padding: "0.75rem", fontSize: "0.8125rem" }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: "center", padding: "0.75rem", fontSize: "0.8125rem" }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      <style jsx>{`
        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .auth-desktop {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .hamburger-btn {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          transition: background 0.2s ease;
        }
        .hamburger-btn:hover {
          background: var(--surface-container-low);
        }
        .mobile-menu {
          display: none;
          border-top: 1px solid var(--outline-variant);
        }

        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
          .auth-desktop {
            display: none !important;
          }
          .hamburger-btn {
            display: flex !important;
          }
          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}