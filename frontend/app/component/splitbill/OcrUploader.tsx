"use client";

import { useState, useRef } from "react";
import type { OcrResult } from "@/lib/types/splitbill";
import { extractReceipt } from "@/lib/api/ocr";

interface OcrUploaderProps {
  onResult: (result: OcrResult) => void;
}

export default function OcrUploader({ onResult }: OcrUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setScanning(true);
    setError("");

    try {
      const result = await extractReceipt(selectedFile);
      onResult(result);
    } catch (err: any) {
      const msg =
        err.response?.data?.detail ||
        "Gagal memproses receipt. Coba foto yang lebih jelas.";
      setError(msg);
    } finally {
      setScanning(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ width: "100%" }}>
      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#fef2f2",
            color: "#ba1a1a",
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            borderRadius: "var(--radius-lg)",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {preview ? (
        <div style={{ marginBottom: "1.25rem", textAlign: "center" }}>
          <img
            src={preview}
            alt="Receipt preview"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              borderRadius: "var(--radius-lg)",
              objectFit: "contain",
            }}
          />
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: "3rem 2rem",
            background: "var(--surface-container-low)",
            borderRadius: "var(--radius-xl)",
            cursor: "pointer",
            marginBottom: "1.25rem",
            textAlign: "center",
            transition: "background 0.3s ease",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📷</div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--on-surface)",
              marginBottom: "0.375rem",
            }}
          >
            Tap untuk upload foto bill
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--outline)",
            }}
          >
            JPG, PNG — Max 10MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div style={{ display: "flex", gap: "0.75rem" }}>
        {preview && (
          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: "center" }}
          >
            Ganti Foto
          </button>
        )}
        <button
          onClick={preview ? handleScan : () => fileInputRef.current?.click()}
          className="btn-primary"
          style={{
            flex: 1,
            justifyContent: "center",
            opacity: scanning ? 0.6 : 1,
          }}
          disabled={scanning}
        >
          {scanning
            ? "Scanning..."
            : preview
              ? "Scan Sekarang 🔍"
              : "Pilih Foto 📷"}
        </button>
      </div>
    </div>
  );
}
