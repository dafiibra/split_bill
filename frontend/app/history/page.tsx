"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/app/component/layout";

/* ─── Types ─── */
interface HistoryEntry {
  id: string;
  date: string;
  restaurant: string;
  totalBill: number;
  participants: { name: string; amount: number; paid: boolean }[];
  icon: string;
}

/* ─── Mock Data ─── */
const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: "1",
    date: "2025-04-10",
    restaurant: "Sushi Tei - Grand Indonesia",
    totalBill: 485000,
    icon: "🍣",
    participants: [
      { name: "Ibrahim", amount: 185000, paid: true },
      { name: "Dafi", amount: 150000, paid: true },
      { name: "Sarah", amount: 150000, paid: false },
    ],
  },
  {
    id: "2",
    date: "2025-04-07",
    restaurant: "Kopi Kenangan - Sudirman",
    totalBill: 128000,
    icon: "☕",
    participants: [
      { name: "Ibrahim", amount: 42000, paid: true },
      { name: "Rina", amount: 46000, paid: true },
      { name: "Budi", amount: 40000, paid: true },
    ],
  },
  {
    id: "3",
    date: "2025-04-03",
    restaurant: "Marugame Udon - PIK",
    totalBill: 267000,
    icon: "🍜",
    participants: [
      { name: "Ibrahim", amount: 89000, paid: true },
      { name: "Dafi", amount: 89000, paid: true },
      { name: "Ayu", amount: 89000, paid: false },
    ],
  },
  {
    id: "4",
    date: "2025-03-28",
    restaurant: "Pizza Marzano - Senayan City",
    totalBill: 520000,
    icon: "🍕",
    participants: [
      { name: "Ibrahim", amount: 130000, paid: true },
      { name: "Sarah", amount: 130000, paid: true },
      { name: "Dafi", amount: 130000, paid: true },
      { name: "Rina", amount: 130000, paid: true },
    ],
  },
  {
    id: "5",
    date: "2025-03-21",
    restaurant: "Nasi Goreng Kebon Sirih",
    totalBill: 95000,
    icon: "🍛",
    participants: [
      { name: "Ibrahim", amount: 47500, paid: true },
      { name: "Budi", amount: 47500, paid: true },
    ],
  },
];

/* ─── Helpers ─── */
function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Hari ini";
  if (diff === 1) return "Kemarin";
  if (diff < 7) return `${diff} hari lalu`;

  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/* ─── Sub-components ─── */
function StatusBadge({ paid }: { paid: boolean }) {
  return (
    <span
      className="label-caps"
      style={{
        padding: "0.25rem 0.625rem",
        borderRadius: "var(--radius-full)",
        fontSize: "0.625rem",
        fontWeight: 700,
        background: paid ? "rgba(45, 106, 79, 0.1)" : "rgba(176, 37, 0, 0.1)",
        color: paid ? "#2d6a4f" : "#b02500",
      }}
    >
      {paid ? "PAID" : "PENDING"}
    </span>
  );
}

function HistoryCard({ entry, style: customStyle }: { entry: HistoryEntry; style?: React.CSSProperties }) {
  const [expanded, setExpanded] = useState(false);
  const paidCount = entry.participants.filter((p) => p.paid).length;
  const allPaid = paidCount === entry.participants.length;

  return (
    <div
      style={{
        background: "var(--surface-container-lowest)",
        borderRadius: "var(--radius-xl)",
        padding: "1.5rem 1.75rem",
        cursor: "pointer",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        ...customStyle,
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
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
            {entry.icon}
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
              {entry.restaurant}
            </h3>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--on-surface-variant)",
              }}
            >
              {formatDate(entry.date)} · {entry.participants.length} orang
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
              marginBottom: "0.25rem",
            }}
          >
            {formatRupiah(entry.totalBill)}
          </p>
          <StatusBadge paid={allPaid} />
        </div>
      </div>

      {/* Participant avatars row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
        {entry.participants.map((p, idx) => (
          <div
            key={idx}
            style={{
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "var(--radius-full)",
              background: ["var(--primary)", "var(--secondary)", "var(--tertiary, #75525b)", "var(--primary-container)"][idx % 4],
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
            {p.name.charAt(0)}
          </div>
        ))}
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", color: "var(--on-surface-variant)", marginLeft: "0.375rem" }}>
          {paidCount}/{entry.participants.length} paid
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
          {entry.participants.map((p, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                background: "var(--surface-container-low)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <div
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "var(--radius-full)",
                    background: ["var(--primary)", "var(--secondary)", "var(--tertiary, #75525b)", "var(--primary-container)"][idx % 4],
                    color: idx < 3 ? "#fff" : "var(--on-primary-container)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.5625rem",
                    fontWeight: 700,
                  }}
                >
                  {p.name.charAt(0)}
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--on-surface)" }}>{p.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 700, color: "var(--on-surface)" }}>{formatRupiah(p.amount)}</span>
                <StatusBadge paid={p.paid} />
              </div>
            </div>
          ))}

          {/* Action buttons for this entry */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              onClick={(e) => { e.stopPropagation(); }}
              style={{
                flex: 1,
                padding: "0.625rem 1rem",
                borderRadius: "var(--radius-full)",
                border: "none",
                cursor: "pointer",
                background: "var(--secondary-container)",
                color: "var(--on-secondary-container)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.375rem",
              }}
            >
              ↗️ Share
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); }}
              style={{
                flex: 1,
                padding: "0.625rem 1rem",
                borderRadius: "var(--radius-full)",
                border: "none",
                cursor: "pointer",
                background: "var(--surface-container-highest)",
                color: "var(--on-surface)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.375rem",
              }}
            >
              📋 Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
        Mulai split bill pertama kamu dan history-nya akan muncul di sini.
      </p>
      <Link href="/split-bill" className="btn-primary" style={{ justifyContent: "center" }}>
        🧾 Mulai Split Bill
      </Link>
    </div>
  );
}

/* ─── Filters ─── */
type FilterType = "all" | "pending" | "completed";

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = MOCK_HISTORY.filter((entry) => {
    const allPaid = entry.participants.every((p) => p.paid);
    if (filter === "pending" && allPaid) return false;
    if (filter === "completed" && !allPaid) return false;
    if (searchQuery && !entry.restaurant.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalSpent = MOCK_HISTORY.reduce((sum, e) => sum + e.totalBill, 0);
  const totalSessions = MOCK_HISTORY.length;
  const pendingCount = MOCK_HISTORY.filter((e) => e.participants.some((p) => !p.paid)).length;

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
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--on-surface-variant)" }}>
            Semua history patungan kamu ada di sini.
          </p>
        </div>

        {/* Stats cards */}
        <div
          className="animate-fade-in-up delay-100 stats-grid"
          style={{
            opacity: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
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
            <p className="label-caps" style={{ marginBottom: "0.25rem" }}>Total Spent</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--on-surface)", margin: 0 }}>{formatRupiah(totalSpent)}</p>
          </div>
          <div
            style={{
              background: "var(--surface-container-lowest)",
              borderRadius: "var(--radius-xl)",
              padding: "1.25rem 1.5rem",
            }}
          >
            <p className="label-caps" style={{ marginBottom: "0.25rem" }}>Sessions</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--on-surface)", margin: 0 }}>{totalSessions}</p>
          </div>
          <div
            style={{
              background: "var(--surface-container-lowest)",
              borderRadius: "var(--radius-xl)",
              padding: "1.25rem 1.5rem",
            }}
          >
            <p className="label-caps" style={{ marginBottom: "0.25rem" }}>Pending</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: pendingCount > 0 ? "#b02500" : "#2d6a4f", margin: 0 }}>{pendingCount}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div
          className="animate-fade-in-up delay-200"
          style={{
            opacity: 0,
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            className="input-pill"
            placeholder="Cari restoran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
          />
          <div
            style={{
              display: "flex",
              gap: "0.25rem",
              padding: "0.25rem",
              background: "var(--surface-container-low)",
              borderRadius: "var(--radius-full)",
            }}
          >
            {(["all", "pending", "completed"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-full)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: filter === f ? "var(--surface-container-lowest)" : "transparent",
                  color: filter === f ? "var(--on-surface)" : "var(--on-surface-variant)",
                  boxShadow: filter === f ? "var(--shadow-soft)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {f === "all" ? "Semua" : f === "pending" ? "Pending" : "Lunas"}
              </button>
            ))}
          </div>
        </div>

        {/* History list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filteredHistory.length > 0 ? (
            filteredHistory.map((entry, idx) => (
              <div
                key={entry.id}
                className="animate-fade-in-up"
                style={{ opacity: 0, animationDelay: `${300 + idx * 100}ms` }}
              >
                <HistoryCard entry={entry} />
              </div>
            ))
          ) : (
            <EmptyState />
          )}
        </div>
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