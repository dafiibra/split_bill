"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/app/component/layout";
import { getToken } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";

interface Person { id: string; name: string; amount: number; }
type SplitMethod = "equal" | "custom";

function LoginNotification({ onClose }: { onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 8000); return () => clearTimeout(t); }, [onClose]);

  return (
    <div className="animate-slide-in" style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 100 }}>
      <div style={{ background: "var(--surface-container-lowest)", borderRadius: "var(--radius-xl)", padding: "1.25rem 1.5rem", maxWidth: "340px", boxShadow: "var(--shadow-float)", position: "relative", overflow: "hidden" }}>
        <div className="animate-shrink-bar" style={{ position: "absolute", bottom: 0, left: 0, height: "3px", background: "var(--gradient-primary)" }} />
        <button onClick={onClose} style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "none", border: "none", color: "var(--outline)", cursor: "pointer", fontSize: "1rem" }} aria-label="Close">✕</button>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
          <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "var(--radius-lg)", background: "var(--primary-container)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.125rem", flexShrink: 0 }}>🕐</div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 700, color: "var(--on-surface)", marginBottom: "0.25rem" }}>Simpan riwayat split bill?</p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--on-surface-variant)", lineHeight: 1.5, marginBottom: "0.75rem" }}>Login atau register untuk menyimpan dan melihat history split bill kamu.</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link href="/login" className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.75rem" }}>Login</Link>
              <Link href="/register" className="btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.75rem" }}>Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const avatarColors = ["#7f4e4d", "#923f5f", "#4a6fa5", "#6b7b3a", "#8b6914", "#5c3d6e", "#2d6a4f", "#b85c38"];

export default function SplitPage() {
  const [billTotal, setBillTotal] = useState("");
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "", amount: 0 },
    { id: "2", name: "", amount: 0 },
  ]);
  const [splitMethod, setSplitMethod] = useState<SplitMethod>("equal");
  const [showNotification, setShowNotification] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
    if (!token) { const t = setTimeout(() => setShowNotification(true), 2000); return () => clearTimeout(t); }
  }, []);

  const handleCloseNotification = useCallback(() => setShowNotification(false), []);

  const addPerson = () => setPeople([...people, { id: Date.now().toString(), name: "", amount: 0 }]);
  const removePerson = (id: string) => { if (people.length > 2) setPeople(people.filter((p) => p.id !== id)); };
  const updatePersonName = (id: string, name: string) => setPeople(people.map((p) => (p.id === id ? { ...p, name } : p)));
  const updatePersonAmount = (id: string, amount: string) => setPeople(people.map((p) => (p.id === id ? { ...p, amount: parseFloat(amount) || 0 } : p)));

  const totalBill = parseFloat(billTotal) || 0;
  const perPerson = people.length > 0 ? totalBill / people.length : 0;
  const customTotal = people.reduce((sum, p) => sum + p.amount, 0);
  const remaining = totalBill - customTotal;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      {showNotification && !isLoggedIn && <LoginNotification onClose={handleCloseNotification} />}

      <main style={{ flex: 1, maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--on-surface)", letterSpacing: "-0.02em" }}>
            Bagi rata, <span className="text-gradient">tanpa drama.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--on-surface-variant)", marginTop: "0.5rem" }}>
            Masukkan total bill, tambah orang, langsung split.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1.5rem", alignItems: "start" }}>
          {/* LEFT: Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Bill Total */}
            <div className="card">
              <label className="label-caps" style={{ display: "block", marginBottom: "0.625rem" }}>Total Tagihan</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-body)", fontSize: "1.125rem", fontWeight: 500, color: "var(--outline)" }}>Rp</span>
                <input
                  type="number" value={billTotal} onChange={(e) => setBillTotal(e.target.value)} placeholder="0"
                  style={{ width: "100%", padding: "1rem 1.25rem 1rem 3rem", background: "var(--surface-container-low)", border: "none", borderRadius: "var(--radius-lg)", fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "var(--on-surface)", outline: "none", transition: "background 0.3s ease, box-shadow 0.3s ease" }}
                  onFocus={(e) => { e.currentTarget.style.background = "var(--surface-container-lowest)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(127,78,77,0.12)"; }}
                  onBlur={(e) => { e.currentTarget.style.background = "var(--surface-container-low)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Split Method + People */}
            <div className="card">
              <div style={{ display: "flex", gap: "0.375rem", padding: "0.25rem", background: "var(--surface-container-low)", borderRadius: "var(--radius-full)", marginBottom: "1.5rem" }}>
                {(["equal", "custom"] as SplitMethod[]).map((method) => (
                  <button key={method} onClick={() => setSplitMethod(method)} style={{
                    flex: 1, padding: "0.625rem 1rem", fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 600,
                    borderRadius: "var(--radius-full)", border: "none", cursor: "pointer",
                    background: splitMethod === method ? "var(--surface-container-lowest)" : "transparent",
                    color: splitMethod === method ? "var(--on-surface)" : "var(--on-surface-variant)",
                    boxShadow: splitMethod === method ? "var(--shadow-soft)" : "none",
                    transition: "all 0.3s ease",
                  }}>
                    {method === "equal" ? "Bagi Rata" : "Custom"}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {people.map((person, index) => (
                  <div key={person.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "var(--radius-full)", background: avatarColors[index % avatarColors.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
                      {person.name ? person.name.charAt(0).toUpperCase() : index + 1}
                    </div>
                    <input type="text" value={person.name} onChange={(e) => updatePersonName(person.id, e.target.value)} className="input-pill" placeholder={`Orang ${index + 1}`} style={{ flex: 1, padding: "0.625rem 1rem" }} />
                    {splitMethod === "custom" && (
                      <div style={{ position: "relative", width: "140px" }}>
                        <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--outline)" }}>Rp</span>
                        <input type="number" value={person.amount || ""} onChange={(e) => updatePersonAmount(person.id, e.target.value)} className="input-pill" placeholder="0" style={{ paddingLeft: "2.25rem" }} />
                      </div>
                    )}
                    {people.length > 2 && (
                      <button onClick={() => removePerson(person.id)} style={{ background: "none", border: "none", color: "var(--outline)", cursor: "pointer", fontSize: "1rem", padding: "0.25rem", flexShrink: 0 }} aria-label="Remove">🗑️</button>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={addPerson} style={{ marginTop: "1rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: "var(--primary-container)", color: "var(--on-primary-container)", fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 600, borderRadius: "var(--radius-full)", border: "none", cursor: "pointer", transition: "transform 0.3s ease" }}>
                👤 Tambah Orang
              </button>
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div style={{ position: "sticky", top: "5rem" }}>
            <div className="card-elevated">
              <h3 className="label-caps" style={{ marginBottom: "1.25rem" }}>Ringkasan</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>Total Tagihan</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 700, color: "var(--on-surface)" }}>{formatCurrency(totalBill)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>Jumlah Orang</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 700, color: "var(--on-surface)" }}>{people.length}</span>
                </div>
                {splitMethod === "custom" && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>Sisa</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 700, color: remaining === 0 ? "#2d6a4f" : remaining > 0 ? "#8b6914" : "#ba1a1a" }}>{formatCurrency(remaining)}</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", paddingTop: "1rem" }}>
                {people.map((person, index) => (
                  <div key={person.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", background: "var(--surface-container-low)", borderRadius: "var(--radius-lg)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "var(--radius-full)", background: avatarColors[index % avatarColors.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-display)", fontSize: "0.625rem", fontWeight: 700 }}>
                        {person.name ? person.name.charAt(0).toUpperCase() : index + 1}
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--on-surface-variant)", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {person.name || `Orang ${index + 1}`}
                      </span>
                    </div>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", fontWeight: 700, color: "var(--on-surface)" }}>
                      {formatCurrency(splitMethod === "equal" ? perPerson : person.amount)}
                    </span>
                  </div>
                ))}
              </div>

              {splitMethod === "equal" && totalBill > 0 && (
                <div style={{ marginTop: "1.25rem", padding: "1.25rem", background: "var(--primary-container)", borderRadius: "var(--radius-xl)", textAlign: "center" }}>
                  <p className="label-caps" style={{ marginBottom: "0.25rem" }}>Per orang</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)", margin: 0 }}>{formatCurrency(perPerson)}</p>
                </div>
              )}

              {totalBill > 0 && (
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1.25rem", padding: "1rem" }}>
                  Split it! 🎉
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}