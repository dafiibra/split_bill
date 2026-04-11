"use client";

import { Navbar, Footer } from "@/app/component/layout";

export default function PricingPage() {
  const plans = [
    { name: "Gratis", price: "Rp 0", desc: "Untuk split bill sehari-hari", features: ["Split bill unlimited", "2 group aktif", "History 30 hari"], cta: "Mulai Gratis", primary: false },
    { name: "Pro", price: "Rp 29k", period: "/bulan", desc: "Untuk yang sering nongkrong", features: ["Semua fitur Gratis", "Unlimited groups", "Scan receipt AI", "History selamanya", "Export PDF"], cta: "Upgrade ke Pro", primary: true },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--on-surface)" }}>
            Harga yang <span className="text-gradient">fair</span>
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--on-surface-variant)", marginTop: "0.5rem" }}>Pilih plan yang sesuai kebutuhan kamu.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {plans.map((plan) => (
            <div key={plan.name} className="card hover-lift" style={{ position: "relative", ...(plan.primary ? { boxShadow: "var(--shadow-float)" } : {}) }}>
              {plan.primary && (
                <div style={{ position: "absolute", top: "1rem", right: "1rem", padding: "0.25rem 0.75rem", background: "var(--gradient-primary)", color: "#fff", fontFamily: "var(--font-body)", fontSize: "0.6875rem", fontWeight: 600, borderRadius: "var(--radius-full)" }}>Popular</div>
              )}
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--on-surface)", marginBottom: "0.25rem" }}>{plan.name}</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--on-surface-variant)", marginBottom: "1rem" }}>{plan.desc}</p>
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--on-surface)" }}>{plan.price}</span>
                {plan.period && <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--outline)" }}>{plan.period}</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>
                    <span style={{ color: "#2d6a4f" }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button className={plan.primary ? "btn-primary" : "btn-secondary"} style={{ width: "100%", justifyContent: "center" }}>{plan.cta}</button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}