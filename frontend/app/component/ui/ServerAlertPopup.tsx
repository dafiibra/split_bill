"use client";

import { useState, useEffect } from "react";
import { warmupServer } from "@/lib/warmup";

export default function ServerAlertPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    warmupServer();
    const dismissed = sessionStorage.getItem("server-alert-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("server-alert-dismissed", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface-container-lowest)",
          borderRadius: "var(--radius-xl)",
          padding: "2rem 1.75rem",
          maxWidth: "380px",
          width: "100%",
          boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
          animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
        }}
      >
  

        {/* Content */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 700, color: "var(--on-surface)", margin: 0 }}>
            Halo Temen Nongs!
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--on-surface-variant)", lineHeight: 1.6, margin: 0 }}>
            Kalau web-nya agak lama pas pertama dibuka, itu normal ya  Kami masih pakai server gratis, jadi butuh sedikit waktu untuk &quot;bangun&quot; 😄 🙏
          </p>
         <span></span>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--on-surface-variant)", lineHeight: 1.6, margin: 0 }}>
            Thanks a lot for your patience!
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--on-surface-variant)", lineHeight: 1.6, margin: 0 }}>
            Hope this web helps you ✨
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            marginTop: "1.5rem",
            width: "100%",
            padding: "0.875rem",
            borderRadius: "var(--radius-full)",
            background: "linear-gradient(135deg, #7f4e4d 0%, #923f5f 100%)",
            color: "#fff",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.9375rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(127,78,77,0.25)",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Iya Gapapa, dimaafin kok
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
