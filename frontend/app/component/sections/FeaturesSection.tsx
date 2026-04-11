import Link from "next/link";
import FeatureCard from "@/app/component/ui/FeatureCard";

export default function FeaturesSection() {
  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: "1.5rem" }}>
        {/* Scan Bill — left column spans 2 rows */}
        <div className="animate-fade-in-up delay-100" style={{ opacity: 0, gridColumn: "1 / 2", gridRow: "1 / 3" }}>
          <div className="hover-lift" style={{ background: "var(--surface-container-lowest)", borderRadius: "var(--radius-xl)", padding: "2rem 1.75rem 2.25rem", height: "100%", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--on-surface)", marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Scan bill secepat kilat
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "280px" }}>
              Nggak perlu ketik manual satu-satu. Cukup foto receipt, sistem cerdas kami langsung deteksi menu dan harganya.
            </p>
            <Link href="/scan" className="btn-primary" style={{ alignSelf: "flex-start", marginBottom: "1.5rem" }}>
              Coba Scan
            </Link>
            {/* Image placeholder */}
            <div style={{ flex: 1, minHeight: "180px", borderRadius: "var(--radius-lg)", background: "var(--surface-container)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--outline)" }}>📷 Image placeholder</span>
            </div>
          </div>
        </div>

        {/* Group Sharing — replaced with Split Bill CTA */}
        <div className="animate-fade-in-up delay-300" style={{ opacity: 0 }}>
          <FeatureCard icon="🧾" title="Split Bill Instan" description="Masukkan item manual atau scan receipt, langsung bagi rata tanpa drama.">
            <Link href="/split-bill" style={{ display: "inline-flex", marginTop: "1rem", fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>
              Mulai Split →
            </Link>
          </FeatureCard>
        </div>

        {/* History Records */}
        <div className="animate-fade-in-up delay-500" style={{ opacity: 0 }}>
          <FeatureCard icon="🕐" title="History Records" description="Lacak semua pengeluaran patungan kamu sebelumnya." bg="var(--surface-container-low)">
            <Link href="/history" style={{ display: "inline-flex", marginTop: "1rem", fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>
              Lihat History →
            </Link>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}