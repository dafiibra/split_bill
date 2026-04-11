import { ReactNode } from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  bg?: string;
  children?: ReactNode;
}

export default function FeatureCard({ icon, title, description, bg = "var(--surface-container-lowest)", children }: FeatureCardProps) {
  return (
    <div className="hover-lift" style={{ background: bg, borderRadius: "var(--radius-xl)", padding: "2rem 1.75rem 2.25rem", border: "none" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-lg)",
        background: bg === "var(--secondary-container)" ? "rgba(255,255,255,0.5)" : "var(--surface-container-low)",
        fontSize: "1.25rem", marginBottom: "1rem",
      }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--on-surface)", marginBottom: "0.5rem" }}>
        {title}
      </h3>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--on-surface-variant)", lineHeight: 1.6, margin: 0 }}>
        {description}
      </p>
      {children}
    </div>
  );
}