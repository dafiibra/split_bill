interface SectionBadgeProps {
  icon?: string;
  text: string;
}

export default function SectionBadge({ icon, text }: SectionBadgeProps) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.375rem",
      padding: "0.4rem 0.875rem", background: "var(--primary-container)",
      color: "var(--on-primary-container)", fontFamily: "var(--font-body)",
      fontSize: "0.75rem", fontWeight: 600, borderRadius: "var(--radius-full)",
    }}>
      {icon && <span>{icon}</span>}
      {text}
    </span>
  );
}