"use client";

import Link from "next/link";
import SectionBadge from "../ui/SectionBadge";

/** Floating receipt preview card shown in the hero */
function ReceiptPreview() {
  const items = [
    { initial: "ID", color: "#ba4a4a", name: "Dafi – Coffee & Pasta", price: "Rp 125k" },
    { initial: "N", color: "#923f5f", name: "Nafisa – Salad Bowl", price: "Rp 85k" },
    { initial: "S", color: "#4a6fa5", name: "Shakila – Wagyu Steak", price: "Rp 240k" },
  ];

  return (
    <div
      className="animate-float"
      style={{
        background: "var(--surface-container-lowest)",
        borderRadius: "var(--radius-xl)",
        padding: "1.5rem",
        boxShadow: "var(--shadow-ambient)",
        width: "100%",
        maxWidth: "340px",
        position: "relative",
      }}
    >
      <span style={{ position: "absolute", top: "-12px", right: "-8px", fontSize: "3rem", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>🧾</span>

      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <span style={{ width: "1.75rem", height: "1.75rem", borderRadius: "var(--radius-md)", background: "var(--primary-container)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>🍽️</span>
          <span className="label-caps">Total Bill</span>
        </div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "var(--on-surface)", margin: 0 }}>Rp 450.000</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {items.map((item) => (
          <div key={item.initial} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", background: "var(--surface-container-low)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span style={{ width: "1.5rem", height: "1.5rem", borderRadius: "var(--radius-sm)", background: item.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>{item.initial}</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--on-surface)" }}>{item.name}</span>
            </div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 600, color: "var(--on-surface)" }}>{item.price}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", paddingTop: "0.75rem" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>Split equally?</span>
        <div style={{ width: "2.75rem", height: "1.5rem", borderRadius: "var(--radius-full)", background: "var(--gradient-primary)", position: "relative", cursor: "pointer" }}>
          <div style={{ width: "1.125rem", height: "1.125rem", borderRadius: "50%", background: "#fff", position: "absolute", top: "50%", right: "3px", transform: "translateY(-50%)", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "4rem 1.5rem 3rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "3rem",
        alignItems: "center",
      }}
      className="hero-grid"
    >
      {/* Left: Text */}
      <div className="animate-fade-in-up" style={{ opacity: 0 }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <SectionBadge icon="🍕" text="Modern Split Billing" />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--on-surface)",
            marginBottom: "1.25rem",
          }}
        >
          Split the Bill,{" "}
          <br />
          <span className="text-gradient" style={{ fontStyle: "italic" }}>Keep the Vibe.</span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--on-surface-variant)",
            lineHeight: 1.7,
            maxWidth: "420px",
            marginBottom: "2rem",
          }}
        >
          Upload your receipt or enter items manually. We&apos;ll handle the math while you enjoy the dessert.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/split-bill" className="btn-primary">
            🧾 Mulai Split Bill
          </Link>
          <Link href="/split-bill" className="btn-secondary">
            📷 Foto Bill
          </Link>
        </div>
      </div>

      {/* Right: Floating receipt */}
<div
  className="animate-fade-in-up delay-300"
  style={{
    opacity: 0,
    display: "flex",
    justifyContent: "center",
    position: "relative",
  }}
>
  <span
    style={{
      position: "absolute",
      top: "10%",
      left: "15%",
      fontSize: "2rem",
      zIndex: 1
    }}
  >
    🍝
  </span>

  {/* 💸 floating + gede + shadow */}
  <span
    className="floating-emoji"
    style={{
      position: "absolute",
      bottom: "20%",
      left: "5%",
      fontSize: "3rem",
      zIndex: 1,
      textShadow: "0 8px 20px rgba(0,0,0,0.35)"
    }}
  >
    💸
  </span>

  {/* 😊 floating + delay dikit biar ga barengan */}
  <span
    className="floating-emoji"
    style={{
      position: "absolute",
      bottom: "10%",
      right: "5%",
      fontSize: "3rem",
      zIndex: 1,
      textShadow: "0 8px 20px rgba(0,0,0,0.35)",
      animationDelay: "0.5s"
    }}
  >
    😊
  </span>

  <ReceiptPreview />
</div>

      {/* Responsive override */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding-top: 2.5rem !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}