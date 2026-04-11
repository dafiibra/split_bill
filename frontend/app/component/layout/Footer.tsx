import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        borderRadius: "3rem 3rem 0 0",
        marginTop: "5rem",
        background: "var(--surface-container-low)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "3rem 1.5rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--on-primary-fixed-variant, #704241)",
        }}
      >
        Designed with warmth by Ibrahim Dafi
      </p>
      <div style={{ display: "flex", gap: "2rem" }}>
        <Link
          href="#"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--on-primary-fixed-variant, #704241)",
            opacity: 0.5,
            textDecoration: "none",
            transition: "opacity 0.3s ease",
          }}
        >
          Privacy
        </Link>
        <Link
          href="#"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--on-primary-fixed-variant, #704241)",
            opacity: 0.5,
            textDecoration: "none",
            transition: "opacity 0.3s ease",
          }}
        >
          Terms
        </Link>
      </div>
      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", opacity: 0.3 }}>
        <span style={{ fontSize: "1.25rem" }}>☕</span>
        <span style={{ fontSize: "1.25rem" }}>🍜</span>
        <span style={{ fontSize: "1.25rem" }}>❤️</span>
      </div>
    </footer>
  );
}