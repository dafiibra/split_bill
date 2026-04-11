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
    </footer>
  );
}