"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "@/app/component/layout";
import { OcrUploader } from "@/app/component/splitbill";
import type { OcrResult } from "@/lib/types/splitbill";

export default function ScanPage() {
  const router = useRouter();
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);

  const handleOcrResult = useCallback(
    (result: OcrResult) => {
      setOcrResult(result);
      // Store result in sessionStorage so split-bill page can pick it up
      sessionStorage.setItem("ocr_result", JSON.stringify(result));
      // Navigate to split-bill page with OCR data
      router.push("/split-bill?source=ocr");
    },
    [router]
  );

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <main
        style={{
          flex: 1,
          maxWidth: "600px",
          margin: "0 auto",
          padding: "2.5rem 1.5rem",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--on-surface)",
            }}
          >
            Scan bill{" "}
            <span className="text-gradient">secepat kilat</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--on-surface-variant)",
              marginTop: "0.5rem",
            }}
          >
            Foto receipt kamu, biar kami yang deteksi menu dan harganya.
          </p>
        </div>

        <div className="card" style={{ textAlign: "center" }}>
          <OcrUploader onResult={handleOcrResult} />
        </div>

        {/* Info about how it works */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {[
            {
              icon: "📷",
              title: "1. Upload Foto",
              desc: "Foto receipt kamu atau upload dari galeri",
            },
            {
              icon: "🤖",
              title: "2. AI Deteksi",
              desc: "Sistem OCR langsung deteksi item & harga",
            },
            {
              icon: "✏️",
              title: "3. Review & Edit",
              desc: "Koreksi jika ada yang salah, lalu assign ke orang",
            },
            {
              icon: "🧮",
              title: "4. Auto Split",
              desc: "Kalkulasi proporsional otomatis termasuk tax & service",
            },
          ].map((step) => (
            <div
              key={step.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.25rem",
                background: "var(--surface-container-lowest)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                {step.icon}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "var(--on-surface)",
                    margin: 0,
                    marginBottom: "0.125rem",
                  }}
                >
                  {step.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--on-surface-variant)",
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
