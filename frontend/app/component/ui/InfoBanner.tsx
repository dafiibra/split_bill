interface InfoBannerProps {
  message: string;
  icon?: string;
}

export default function InfoBanner({ message, icon = "ℹ️" }: InfoBannerProps) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "0.625rem",
      padding: "0.875rem 1rem", background: "var(--surface-container-low)",
      borderRadius: "var(--radius-lg)", fontFamily: "var(--font-body)",
      fontSize: "0.75rem", color: "var(--on-surface-variant)", lineHeight: 1.5,
    }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}