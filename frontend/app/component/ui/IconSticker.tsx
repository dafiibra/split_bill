import { CSSProperties, ReactNode } from "react";

interface IconStickerProps {
  children: ReactNode;
  bg?: string;
  size?: "sm" | "md" | "lg";
  style?: CSSProperties;
}

const sizes = {
  sm: { width: "2rem", height: "2rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem" },
  md: { width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-lg)", fontSize: "1.25rem" },
  lg: { width: "3.5rem", height: "3.5rem", borderRadius: "var(--radius-xl)", fontSize: "1.5rem" },
};

export default function IconSticker({ children, bg = "var(--tertiary-container)", size = "md", style }: IconStickerProps) {
  const s = sizes[size];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: s.width, height: s.height, borderRadius: s.borderRadius, background: bg, fontSize: s.fontSize, flexShrink: 0, ...style }}>
      {children}
    </div>
  );
}