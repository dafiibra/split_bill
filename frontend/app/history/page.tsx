"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/app/component/layout";
import { getToken } from "@/lib/auth";
import { getSplitBillHistory } from "@/lib/api/splitbill";

/* ─── Types ─── */
interface HistoryEntry {
  id: string;
  createdAt: string;
  restaurantName: string;
  grandTotal: number;
  totalTax: number;
  totalService: number;
  totalDiscount: number;
  splits: {
    personName: string;
    subtotal: number;
    tax: number;
    service: number;
    discount: number;
    total: number;
    items: { name: string; price: number }[];
  }[];
}

/* ─── Helpers ─── */
function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "Hari ini";
  if (diff === 1) return "Kemarin";
  if (diff < 7) return `${diff} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getRestaurantIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("sushi") || lower.includes("jepang")) return "🍣";
  if (lower.includes("kopi") || lower.includes("coffee") || lower.includes("cafe")) return "☕";
  if (lower.includes("udon") || lower.includes("ramen") || lower.includes("mie")) return "🍜";
  if (lower.includes("pizza")) return "🍕";
  if (lower.includes("nasi") || lower.includes("rice")) return "🍛";
  if (lower.includes("burger")) return "🍔";
  if (lower.includes("bakso") || lower.includes("soto")) return "🍲";
  return "🍽️";
}

/* ─── Sub-components ─── */
function HistoryCard({ entry }: { entry: HistoryEntry }) {
  const [expanded, setExpanded] = useState(false);
  const icon = getRestaurantIcon(entry.restaurantName);

  return (
    <div
      style={{
        background: "var(--surface-container-lowest)",
        borderRadius: "var(--radius-xl)",
        padding: "1.5rem 1.75rem",
        cursor: "pointer",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div
            style={{
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "var(--radius-lg)",
              background: "var(--tertiary-container)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--on-surface)",
                margin: 0,
                marginBottom: "0.125rem",
              }}
            >
              {entry.restaurantName}
            </h3>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--on-surface-variant)",
              }}
            >
              {formatDate(entry.createdAt)} · {entry.splits.length} orang
            </span>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.125rem",
              color: "var(--on-surface)",
              margin: 0,
            }}
          >
            {formatRupiah(entry.grandTotal)}
          </p>
        </div>
      </div>

      {/* Participant avatars row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
        {entry.splits.map((s, idx) => (
          <div
            key={idx}
            style={{
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "var(--radius-full)",
              background: [
                "var(--primary)",
                "var(--secondary)",
                "var(--tertiary, #75525b)",
                "var(--primary-container)",
              ][idx % 4],
              color: idx < 3 ? "#fff" : "var(--on-primary-container)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: "0.625rem",
              fontWeight: 700,
              border: "2px solid var(--surface-container-lowest)",
              marginLeft: idx > 0 ? "-0.375rem" : 0,
            }}
          >
            {s.personName.charAt(0).toUpperCase()}
          </div>
        ))}
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            color: "var(--on-surface-variant)",
            marginLeft: "0.375rem",
          }}
        >
          {entry.splits.length} orang
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--on-surface-variant)",
            transition: "transform 0.2s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(178, 172, 169, 0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
          }}
        >
          {entry.splits.map((s, idx) => (
            <div
              key={idx}
              style={{
                padding: "1rem",
                background: "var(--surface-container-low)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <div
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "var(--radius-full)",
                      background: [
                        "var(--primary)",
                        "var(--secondary)",
                        "var(--tertiary, #75525b)",
                        "var(--primary-container)",
                      ][idx % 4],
                      color: idx < 3 ? "#fff" : "var(--on-primary-container)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.5625rem",
                      fontWeight: 700,
                    }}
                  >
                    {s.personName.charAt(0).toUpperCase()}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--on-surface)",
                    }}
                  >
                    {s.personName}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.9375rem",
                    fontWeight: 800,
                    color: "var(--on-surface)",
                  }}
                >
                  {formatRupiah(s.total)}
                </span>
              </div>

              {/* Item details */}
              {s.items && s.items.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                    paddingLeft: "2.125rem",
                  }}
                >
                  {s.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        color: "var(--on-surface-variant)",
                      }}
                    >
                      <span>{item.name}</span>
                      <span>{formatRupiah(item.price)}</span>
                    </div>
                  ))}
                  {s.tax > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        color: "var(--on-surface-variant)",
                      }}
                    >
                      <span>Tax</span>
                      <span>{formatRupiah(s.tax)}</span>
                    </div>
                  )}
                  {s.service > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.75rem",
                        color: "var(--on-surface-variant)",
                      }}
                    >
                      <span>Service</span>
                      <span>{formatRupiah(s.service)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Summary row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "space-between",
              padding: "0.75rem 1rem",
              background: "var(--primary-container)",
              borderRadius: "var(--radius-lg)",
              marginTop: "0.25rem",
            }}
          >
            {entry.totalTax > 0 && (
              <div style={{ textAlign: "center" }}>
                <p className="label-caps" style={{ marginBottom: "0.125rem", fontSize: "0.5625rem" }}>Tax</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem", color: "var(--on-primary-container)", margin: 0 }}>{formatRupiah(entry.totalTax)}</p>
              </div>
            )}
            {entry.totalService > 0 && (
              <div style={{ textAlign: "center" }}>
                <p className="label-caps" style={{ marginBottom: "0.125rem", fontSize: "0.5625rem" }}>Service</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem", color: "var(--on-primary-container)", margin: 0 }}>{formatRupiah(entry.totalService)}</p>
              </div>
            )}
            {entry.totalDiscount > 0 && (
              <div style={{ textAlign: "center" }}>
                <p className="label-caps" style={{ marginBottom: "0.125rem", fontSize: "0.5625rem" }}>Discount</p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8125rem", color: "#2d6a4f", margin: 0 }}>-{formatRupiah(entry.totalDiscount)}</p>
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <p className="label-caps" style={{ marginBottom: "0.125rem", fontSize: "0.5625rem" }}>Grand Total</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9375rem", color: "var(--primary)", margin: 0 }}>{formatRupiah(entry.grandTotal)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Login Required State ─── */
function LoginRequiredState() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
      }}
    >
      <div
        className="card"
        style={{
          textAlign: "center",
          padding: "3rem 2.5rem",
          maxWidth: "460px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "5rem",
            height: "5rem",
            borderRadius: "50%",
            background: "var(--primary-container)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.25rem",
            margin: "0 auto 1.5rem",
          }}
        >
          🔐
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--on-surface)",
            marginBottom: "0.625rem",
          }}
        >
          Login dulu, yuk!
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9375rem",
            color: "var(--on-surface-variant)",
            lineHeight: 1.6,
            marginBottom: "0.5rem",
            maxWidth: "320px",
            margin: "0 auto 1.75rem",
          }}
        >
          Untuk melihat riwayat split bill, kamu harus login terlebih dahulu. 
          History split bill kamu akan tersimpan aman di akun kamu.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/login"
            className="btn-primary"
            style={{ padding: "0.875rem 2.5rem", fontSize: "0.9375rem" }}
          >
            Login Sekarang
          </Link>
          <Link
            href="/register"
            className="btn-secondary"
            style={{ padding: "0.875rem 2rem", fontSize: "0.9375rem" }}
          >
            Buat Akun Baru
          </Link>
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--outline)",
            marginTop: "1.5rem",
            lineHeight: 1.5,
          }}
        >
          Belum punya akun? Gratis kok, cuma perlu email.
        </p>
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState() {
  return (
    <div
      className="card"
      style={{
        textAlign: "center",
        padding: "4rem 2rem",
        maxWidth: "420px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          width: "4rem",
          height: "4rem",
          borderRadius: "var(--radius-xl)",
          background: "var(--tertiary-container)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem",
          margin: "0 auto 1.25rem",
        }}
      >
        🧾
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--on-surface)",
          marginBottom: "0.5rem",
        }}
      >
        Belum ada history
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--on-surface-variant)",
          lineHeight: 1.6,
          marginBottom: "1.5rem",
        }}
      >
        Mulai split bill pertama kamu dan simpan hasilnya. History-nya akan muncul di sini.
      </p>
      <Link
        href="/split-bill"
        className="btn-primary"
        style={{ justifyContent: "center" }}
      >
        🧾 Mulai Split Bill
      </Link>
    </div>
  );
}

/* ─── Loading State ─── */
function LoadingState() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "2.5rem",
            height: "2.5rem",
            border: "3px solid var(--surface-container-highest)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 1rem",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            color: "var(--on-surface-variant)",
          }}
        >
          Memuat history...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function HistoryPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = checking
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);
    setLoading(true);

    getSplitBillHistory()
      .then((data) => {
        setHistory(data || []);
      })
      .catch((err) => {
        console.error("Failed to load history:", err);
        if (err.response?.status === 401) {
          setIsLoggedIn(false);
        } else {
          setError("Gagal memuat history. Coba lagi nanti.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Still checking auth
  if (isLoggedIn === null) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--surface)" }}>
        <Navbar />
        <LoadingState />
        <Footer />
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--surface)" }}>
        <Navbar />
        <LoginRequiredState />
        <Footer />
      </div>
    );
  }

  // Logged in — show history
  const filteredHistory = history.filter((entry) => {
    if (searchQuery && !entry.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalSpent = history.reduce((sum, e) => sum + e.grandTotal, 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--surface)" }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem", width: "100%" }}>
        {/* Header */}
        <div className="animate-fade-in-up" style={{ opacity: 0, marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--on-surface)",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            Riwayat <span className="text-gradient">Split Bill</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              color: "var(--on-surface-variant)",
            }}
          >
            Semua history patungan kamu ada di sini.
          </p>
        </div>

        {/* Stats cards */}
        <div
          className="animate-fade-in-up delay-100 stats-grid"
          style={{
            opacity: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              background: "var(--surface-container-lowest)",
              borderRadius: "var(--radius-xl)",
              padding: "1.25rem 1.5rem",
            }}
          >
            <p className="label-caps" style={{ marginBottom: "0.25rem" }}>
              Total Spent
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "var(--on-surface)",
                margin: 0,
              }}
            >
              {formatRupiah(totalSpent)}
            </p>
          </div>
          <div
            style={{
              background: "var(--surface-container-lowest)",
              borderRadius: "var(--radius-xl)",
              padding: "1.25rem 1.5rem",
            }}
          >
            <p className="label-caps" style={{ marginBottom: "0.25rem" }}>
              Sessions
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "var(--on-surface)",
                margin: 0,
              }}
            >
              {history.length}
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <div
            style={{
              padding: "1rem 1.25rem",
              background: "#fef2f2",
              color: "#ba1a1a",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              borderRadius: "var(--radius-lg)",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        ) : (
          <>
            {/* Search */}
            {history.length > 0 && (
              <div
                className="animate-fade-in-up delay-200"
                style={{
                  opacity: 0,
                  marginBottom: "1.5rem",
                }}
              >
                <input
                  type="text"
                  className="input-pill"
                  placeholder="Cari restoran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {/* History list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filteredHistory.length > 0
                ? filteredHistory.map((entry, idx) => (
                    <div
                      key={entry.id}
                      className="animate-fade-in-up"
                      style={{
                        opacity: 0,
                        animationDelay: `${300 + idx * 100}ms`,
                      }}
                    >
                      <HistoryCard entry={entry} />
                    </div>
                  ))
                : <EmptyState />
              }
            </div>
          </>
        )}
      </main>

      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}