"use client";

interface TagProps {
  label: string;
  onRemove?: () => void;
}

export default function Tag({ label, onRemove }: TagProps) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.375rem",
      padding: "0.35rem 0.75rem", background: "var(--primary-container)",
      color: "var(--on-primary-container)", fontFamily: "var(--font-body)",
      fontSize: "0.8125rem", fontWeight: 500, borderRadius: "var(--radius-full)",
    }}>
      @{label}
      {onRemove && (
        <button onClick={onRemove} style={{ background: "none", border: "none", color: "var(--on-primary-container)", cursor: "pointer", fontSize: "0.875rem", lineHeight: 1, padding: 0, opacity: 0.6 }} aria-label={`Remove ${label}`}>
          ×
        </button>
      )}
    </span>
  );
}