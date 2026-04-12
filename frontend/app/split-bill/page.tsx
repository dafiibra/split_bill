"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar, Footer } from "@/app/component/layout";
import {
  OcrUploader,
  ItemEditor,
  PersonAssigner,
  SplitResultCard,
} from "@/app/component/splitbill";
import { calculateSplitBill, saveSplitBillSession } from "@/lib/api/splitbill";
import { getToken } from "@/lib/auth";
import type {
  ItemEntry,
  Participant,
  OcrResult,
  SplitBillRequest,
  SplitBillResponse,
} from "@/lib/types/splitbill";

function SplitBillContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  /* ── Core State ── */
  const [activeTab, setActiveTab] = useState<"ocr" | "manual">("ocr");
  const [items, setItems] = useState<ItemEntry[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});

  /* ── OCR detected values ── */
  const [detectedTax, setDetectedTax] = useState<number | null>(null);
  const [detectedService, setDetectedService] = useState<number | null>(null);
  const [detectedDiscount, setDetectedDiscount] = useState<number | null>(null);

  /* ── Fallback rates (user can override) ── */
  const [taxRate, setTaxRate] = useState<number | null>(0.1);
  const [serviceRate, setServiceRate] = useState<number | null>(0.05);

  /* ── Result ── */
  const [splitResult, setSplitResult] = useState<SplitBillResponse | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState("");

  /* ── Save Bill State ── */
  const [restaurantName, setRestaurantName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  /* ── Bank Transfer ── */
  const [bankName, setBankName] = useState("Bank Central Asia (BCA)");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountOwner, setAccountOwner] = useState("");

  /* ── Apply OCR result to state ── */
  const applyOcrResult = useCallback((result: OcrResult) => {
    const newItems: ItemEntry[] = result.items.map((item, idx) => ({
      id: `ocr-${Date.now()}-${idx}`,
      name: item.name,
      price: item.price,
    }));
    setItems(newItems);
    setDetectedTax(result.detectedTax);
    setDetectedService(result.detectedService);
    setDetectedDiscount(result.detectedDiscount);

    if (result.detectedTax !== null) setTaxRate(null);
    if (result.detectedService !== null) setServiceRate(null);
  }, []);

  /* ── Load OCR result from sessionStorage if redirected from /scan ── */
  useEffect(() => {
    const source = searchParams.get("source");
    if (source === "ocr") {
      try {
        const stored = sessionStorage.getItem("ocr_result");
        if (stored) {
          const ocrResult: OcrResult = JSON.parse(stored);
          applyOcrResult(ocrResult);
          sessionStorage.removeItem("ocr_result");
        }
      } catch (err) {
        console.error("Failed to load OCR result from session:", err);
      }
    }
  }, [searchParams, applyOcrResult]);

  /* ── Handle OCR from inline uploader ── */
  const handleInlineOcr = useCallback(
    (result: OcrResult) => {
      applyOcrResult(result);
      setTimeout(() => {
        const el = document.getElementById("items-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    },
    [applyOcrResult]
  );

  /* ── Build the SplitBillRequest payload ── */
  const buildRequest = useCallback((): SplitBillRequest => {
    const people = participants.map((p) => {
      const assignedItems = items
        .filter((item) => (assignments[item.id] || []).includes(p.id))
        .map((item) => {
          const assigneeCount = (assignments[item.id] || []).length;
          const splitPrice =
            assigneeCount > 1
              ? Math.round(item.price / assigneeCount)
              : item.price;
          return { name: item.name, price: splitPrice };
        });

      return { name: p.name, items: assignedItems };
    });

    return {
      people,
      taxRate,
      serviceRate,
      detectedTax,
      detectedService,
      detectedDiscount,
    };
  }, [participants, items, assignments, taxRate, serviceRate, detectedTax, detectedService, detectedDiscount]);

  /* ── Build request and call backend ── */
  const handleCalculate = useCallback(async () => {
    setCalcError("");
    setSaveSuccess(false);
    setSaveError("");

    if (participants.length === 0) {
      setCalcError("Tambahkan minimal 1 orang dulu.");
      return;
    }

    const hasAssignment = Object.values(assignments).some(
      (ids) => ids.length > 0
    );
    if (!hasAssignment && items.length > 0) {
      setCalcError("Assign minimal 1 item ke seseorang.");
      return;
    }

    const request = buildRequest();

    try {
      setCalculating(true);
      const result = await calculateSplitBill(request);
      setSplitResult(result);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal menghitung split bill.";
      setCalcError(msg);
    } finally {
      setCalculating(false);
    }
  }, [participants, items, assignments, buildRequest]);

  /* ── Save Bill Handler ── */
  const handleSaveBill = useCallback(async () => {
    const token = getToken();
    if (!token) {
      sessionStorage.setItem(
        "pending_split_bill",
        JSON.stringify({
          items,
          participants,
          assignments,
          restaurantName,
          taxRate,
          serviceRate,
          detectedTax,
          detectedService,
          detectedDiscount,
        })
      );
      router.push("/login?redirect=/split-bill&reason=save");
      return;
    }

    if (!restaurantName.trim()) {
      setSaveError("Masukkan nama restoran dulu.");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const request = buildRequest();
      await saveSplitBillSession(request, restaurantName.trim());
      setSaveSuccess(true);
      setSaveError("");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal menyimpan split bill.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }, [
    items,
    participants,
    assignments,
    restaurantName,
    buildRequest,
    router,
    taxRate,
    serviceRate,
    detectedTax,
    detectedService,
    detectedDiscount,
  ]);

  /* ── Copy bank details ── */
  const copyBankDetails = useCallback(() => {
    const text = `${bankName}\n${accountNumber}\na.n. ${accountOwner}`;
    navigator.clipboard.writeText(text).catch(() => {});
  }, [bankName, accountNumber, accountOwner]);

  /* ── Share to WhatsApp ── */
  const shareWhatsApp = useCallback(() => {
    if (!splitResult) return;

    let msg = "🧾 *Split Bill Result*\n\n";
    splitResult.splits.forEach((s) => {
      msg += `👤 *${s.name}*\n`;
      s.items?.forEach((item) => {
        msg += `   ${item.name}: Rp ${item.price.toLocaleString("id-ID")}\n`;
      });
      if (s.tax > 0) msg += `   Tax: Rp ${s.tax.toLocaleString("id-ID")}\n`;
      if (s.service > 0)
        msg += `   Service: Rp ${s.service.toLocaleString("id-ID")}\n`;
      msg += `   *Total: Rp ${s.total.toLocaleString("id-ID")}*\n\n`;
    });

    msg += `💰 *Grand Total: Rp ${splitResult.grandTotal.toLocaleString("id-ID")}*\n`;

    if (accountNumber) {
      msg += `\n🏦 Transfer ke:\n${bankName}\n${accountNumber}\na.n. ${accountOwner}`;
    }

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  }, [splitResult, bankName, accountNumber, accountOwner]);

  const isLoggedIn = typeof window !== "undefined" && !!getToken();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          paddingTop: "1.5rem",
          paddingBottom: "3rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          maxWidth: "1000px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* ═══ Hero Title ═══ */}
        <header
          className="animate-fade-in-up"
          style={{ opacity: 0, textAlign: "center", marginBottom: "2.5rem" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--on-surface)",
              lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}
          >
            Split the Bill,
            <br />
            <span className="text-gradient" style={{ fontStyle: "italic" }}>
              Keep the Vibe.
            </span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--on-surface-variant)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Upload receipt atau input manual. Backend kami yang hitung, kamu
            tinggal enjoy dessert-nya.
          </p>
        </header>

        {/* ═══ Section 1: Input Options (OCR / Manual) ═══ */}
        <section
          className="animate-fade-in-up delay-100"
          style={{
            opacity: 0,
            background: "var(--surface-container-low)",
            padding: "0.5rem",
            borderRadius: "var(--radius-xl)",
            marginBottom: "2rem",
          }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", padding: "0.5rem" }}>
            {(["ocr", "manual"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "1rem",
                  borderRadius: "var(--radius-xl)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  background:
                    activeTab === tab
                      ? "var(--surface-container-lowest)"
                      : "transparent",
                  color:
                    activeTab === tab
                      ? "var(--primary)"
                      : "var(--on-surface-variant)",
                  boxShadow:
                    activeTab === tab ? "var(--shadow-soft)" : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {tab === "ocr" ? "🧾 OCR Scan" : "✏️ Manual Input"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div
            style={{
              background: "var(--surface-container-lowest)",
              borderRadius: "var(--radius-xl)",
              marginTop: "0.5rem",
              padding: "2rem",
            }}
          >
            {activeTab === "ocr" ? (
              <OcrUploader onResult={handleInlineOcr} />
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  ✏️
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    marginBottom: "0.5rem",
                    color: "var(--on-surface)",
                  }}
                >
                  Input manual
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "var(--on-surface-variant)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Tambahkan item dan harga secara manual di bawah.
                </p>
                <button
                  onClick={() => {
                    const el = document.getElementById("items-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-secondary"
                  style={{ padding: "0.875rem 2rem" }}
                >
                  Scroll ke Items ↓
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ═══ OCR Detected Values (if any) ═══ */}
        {(detectedTax !== null ||
          detectedService !== null ||
          detectedDiscount !== null) && (
          <section
            className="animate-fade-in-up delay-200"
            style={{
              opacity: 0,
              background: "var(--tertiary-container)",
              borderRadius: "var(--radius-xl)",
              padding: "1.25rem 1.5rem",
              marginBottom: "1.5rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "var(--on-tertiary-container)",
              }}
            >
              🤖 OCR Detected:
            </span>
            {detectedTax !== null && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--on-tertiary-container)" }}>
                Tax: Rp {detectedTax.toLocaleString("id-ID")}
              </span>
            )}
            {detectedService !== null && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--on-tertiary-container)" }}>
                Service: Rp {detectedService.toLocaleString("id-ID")}
              </span>
            )}
            {detectedDiscount !== null && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--on-tertiary-container)" }}>
                Discount: Rp {detectedDiscount.toLocaleString("id-ID")}
              </span>
            )}
          </section>
        )}

        {/* ═══ Section 2: Items + People Assignment ═══ */}
        <div
          id="items-section"
          className="split-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div className="animate-fade-in-up delay-200" style={{ opacity: 0 }}>
            <ItemEditor items={items} onItemsChange={setItems} />
          </div>
          <div className="animate-fade-in-up delay-300" style={{ opacity: 0 }}>
            <PersonAssigner
              items={items}
              participants={participants}
              onParticipantsChange={setParticipants}
              assignments={assignments}
              onAssignmentsChange={setAssignments}
            />
          </div>
        </div>

        {/* ═══ Tax/Service Rate Override (when OCR didn't detect) ═══ */}
        {detectedTax === null && detectedService === null && (
          <section
            className="animate-fade-in-up delay-300"
            style={{
              opacity: 0,
              background: "var(--surface-container-low)",
              borderRadius: "var(--radius-xl)",
              padding: "1.5rem 2rem",
              marginBottom: "2rem",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--on-surface)",
                marginBottom: "1rem",
              }}
            >
              Tax & Service Rate
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem" }}>
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  className="input-pill"
                  placeholder="10"
                  value={taxRate !== null ? taxRate * 100 : ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setTaxRate(isNaN(val) ? null : val / 100);
                  }}
                />
              </div>
              <div>
                <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem" }}>
                  Service Rate (%)
                </label>
                <input
                  type="number"
                  className="input-pill"
                  placeholder="5"
                  value={serviceRate !== null ? serviceRate * 100 : ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setServiceRate(isNaN(val) ? null : val / 100);
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ═══ Section 3: Calculate Button ═══ */}
        <section
          className="animate-fade-in-up delay-400"
          style={{ opacity: 0, marginBottom: "2rem" }}
        >
          {calcError && (
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
              {calcError}
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={calculating || items.length === 0}
            style={{
              width: "100%",
              padding: "1.5rem",
              background:
                items.length === 0
                  ? "var(--surface-container-highest)"
                  : "var(--gradient-primary)",
              color: items.length === 0 ? "var(--on-surface-variant)" : "#fff",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.5rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              cursor:
                calculating || items.length === 0
                  ? "not-allowed"
                  : "pointer",
              boxShadow:
                items.length > 0
                  ? "0 20px 40px rgba(127, 78, 77, 0.15)"
                  : "none",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              opacity: calculating ? 0.7 : 1,
              marginBottom: "1.5rem",
            }}
            onMouseEnter={(e) => {
              if (items.length > 0)
                e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {calculating ? "Menghitung..." : "Hitung Split Bill 🧮"}
          </button>

          {/* ═══ Results ═══ */}
          {splitResult && <SplitResultCard result={splitResult} />}
        </section>

        {/* ═══ Section: Save Bill ═══ */}
        {splitResult && (
          <section
            className="animate-fade-in-up"
            style={{
              opacity: 0,
              animationDelay: "450ms",
              background: "var(--surface-container-low)",
              borderRadius: "var(--radius-xl)",
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--primary-container)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.125rem",
                }}
              >
                💾
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    color: "var(--on-surface)",
                    margin: 0,
                  }}
                >
                  Simpan ke History
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--on-surface-variant)",
                    margin: 0,
                  }}
                >
                  {isLoggedIn
                    ? "Simpan hasil split bill ini agar bisa dilihat nanti."
                    : "Login dulu untuk menyimpan history split bill."}
                </p>
              </div>
            </div>

            {/* Restaurant name input */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                className="label-caps"
                style={{ display: "block", marginBottom: "0.5rem", marginLeft: "1rem", color: "var(--primary)", fontWeight: 700 }}
              >
                NAMA RESTORAN
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="input-pill"
                placeholder="e.g. Sushi Tei, Kopi Kenangan, dll."
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                }}
              />
            </div>

            {/* Save status messages */}
            {saveError && (
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
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(45, 106, 79, 0.1)",
                  color: "#2d6a4f",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  borderRadius: "var(--radius-lg)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ✅ Split bill berhasil disimpan!{" "}
                <Link
                  href="/history"
                  style={{
                    color: "#2d6a4f",
                    fontWeight: 700,
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  Lihat History →
                </Link>
              </div>
            )}

            {/* Save button */}
            <button
              onClick={handleSaveBill}
              disabled={saving || saveSuccess}
              style={{
                width: "100%",
                padding: "1rem",
                background: saveSuccess
                  ? "rgba(45, 106, 79, 0.15)"
                  : isLoggedIn
                    ? "var(--gradient-primary)"
                    : "var(--secondary-container)",
                color: saveSuccess
                  ? "#2d6a4f"
                  : isLoggedIn
                    ? "#fff"
                    : "var(--on-secondary-container)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: "var(--radius-full)",
                border: "none",
                cursor: saving || saveSuccess ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                if (!saving && !saveSuccess) e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {saving
                ? "Menyimpan..."
                : saveSuccess
                  ? "✅ Tersimpan"
                  : isLoggedIn
                    ? "💾 Simpan ke History"
                    : "🔐 Login untuk Simpan"}
            </button>
          </section>
        )}

        {/* ═══ Section 4: Bank Transfer ═══ */}
        {splitResult && (
          <section
            className="animate-fade-in-up"
            style={{
              opacity: 0,
              animationDelay: "500ms",
              background: "var(--surface-container-low)",
              borderRadius: "var(--radius-xl)",
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.75rem",
                color: "var(--on-surface)",
                marginBottom: "2rem",
              }}
            >
              Transfer Pembayaran
            </h2>

            <div
              className="transfer-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2.5rem",
              }}
            >
              {/* Form side */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", marginLeft: "1rem", color: "var(--primary)", fontWeight: 700 }}>
                    BANK NAME
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    style={{
                      width: "100%",
                      background: "var(--surface-container-lowest)",
                      border: "none",
                      borderRadius: "var(--radius-full)",
                      padding: "1rem 1.5rem",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: "var(--on-surface)",
                      outline: "none",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option>Bank Central Asia (BCA)</option>
                    <option>Bank Mandiri</option>
                    <option>Bank Rakyat Indonesia (BRI)</option>
                    <option>Bank Negara Indonesia (BNI)</option>
                    <option>GoPay</option>
                    <option>OVO</option>
                    <option>DANA</option>
                    <option>ShopeePay</option>
                  </select>
                </div>
                <div>
                  <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", marginLeft: "1rem", color: "var(--primary)", fontWeight: 700 }}>
                    ACCOUNT NUMBER
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="input-pill"
                    placeholder="Nomor rekening"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                  />
                </div>
                <div>
                  <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem", marginLeft: "1rem", color: "var(--primary)", fontWeight: 700 }}>
                    ACCOUNT OWNER
                  </label>
                  <input
                    type="text"
                    value={accountOwner}
                    onChange={(e) => setAccountOwner(e.target.value)}
                    className="input-pill"
                    placeholder="Nama pemilik rekening"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                  />
                </div>
              </div>

              {/* Display card side */}
              <div
                style={{
                  background: "var(--surface-container-lowest)",
                  borderRadius: "var(--radius-xl)",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "var(--shadow-soft)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, padding: "1rem", opacity: 0.05, fontSize: "6rem" }}>
                  💳
                </div>
                <div>
                  <p className="label-caps" style={{ letterSpacing: "0.15em", marginBottom: "0.5rem" }}>
                    Transfer ke rekening berikut
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "1.75rem",
                      color: "var(--on-surface)",
                      margin: 0,
                    }}
                  >
                    {bankName.split("(")[0].trim()}{" "}
                    {accountNumber || "___________"}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.125rem",
                      color: "var(--secondary)",
                      marginTop: "0.25rem",
                    }}
                  >
                    a.n. {accountOwner || "___________"}
                  </p>
                </div>
                <button
                  onClick={copyBankDetails}
                  disabled={!accountNumber}
                  style={{
                    marginTop: "2rem",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    padding: "1rem",
                    background: accountNumber
                      ? "var(--secondary-container)"
                      : "var(--surface-container-highest)",
                    color: accountNumber
                      ? "var(--on-secondary-container)"
                      : "var(--on-surface-variant)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    borderRadius: "var(--radius-full)",
                    border: "none",
                    cursor: accountNumber ? "pointer" : "not-allowed",
                    transition: "transform 0.3s ease",
                    opacity: accountNumber ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => {
                    if (accountNumber) e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  📋 Copy Details
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ═══ Final Actions ═══ */}
        {splitResult && (
          <section
            className="actions-grid animate-fade-in-up"
            style={{
              opacity: 0,
              animationDelay: "600ms",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              paddingTop: "1rem",
            }}
          >
            <button
              onClick={shareWhatsApp}
              style={{
                padding: "1rem",
                borderRadius: "var(--radius-full)",
                border: "none",
                cursor: "pointer",
                background: "#25D366",
                color: "#fff",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.9375rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                boxShadow: "0 8px 24px rgba(37, 211, 102, 0.3)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ↗️ Share to WhatsApp
            </button>
            <button
              onClick={() => {
                setItems([]);
                setParticipants([]);
                setAssignments({});
                setSplitResult(null);
                setDetectedTax(null);
                setDetectedService(null);
                setDetectedDiscount(null);
                setTaxRate(0.1);
                setServiceRate(0.05);
                setCalcError("");
                setRestaurantName("");
                setSaveSuccess(false);
                setSaveError("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                padding: "1rem",
                borderRadius: "var(--radius-full)",
                border: "none",
                cursor: "pointer",
                background: "var(--surface-container-highest)",
                color: "var(--on-surface)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.9375rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                transition: "all 0.3s ease",
              }}
            >
              🔄 Split Bill Baru
            </button>
          </section>
        )}
      </main>

      <Footer />

      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          .split-grid {
            grid-template-columns: 1fr !important;
          }
          .transfer-grid {
            grid-template-columns: 1fr !important;
          }
          .actions-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function SplitBillPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "2rem",
              height: "2rem",
              border: "3px solid var(--surface-container-highest)",
              borderTopColor: "var(--primary)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <SplitBillContent />
    </Suspense>
  );
}