"use client";

import type { SplitBillResponse } from "@/lib/types/splitbill";

interface SplitResultCardProps {
  result: SplitBillResponse;
}

function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

const BORDER_COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--tertiary, #75525b)",
  "var(--primary)",
  "var(--outline)",
];

export default function SplitResultCard({ result }: SplitResultCardProps) {
  return (
    <div>
      {/* Summary bar */}
      <div
        style={{
          background: "var(--surface-container-low)",
          borderRadius: "var(--radius-xl)",
          padding: "1.5rem 2rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {[
          { label: "Subtotal", value: result.grandSubtotal },
          { label: "Tax", value: result.totalTax },
          { label: "Service", value: result.totalService },
          ...(result.totalDiscount > 0
            ? [{ label: "Discount", value: -result.totalDiscount }]
            : []),
          { label: "Grand Total", value: result.grandTotal },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center", minWidth: "100px" }}>
            <p className="label-caps" style={{ marginBottom: "0.25rem" }}>
              {item.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.125rem",
                color:
                  item.label === "Grand Total"
                    ? "var(--primary)"
                    : item.label === "Discount"
                      ? "#2d6a4f"
                      : "var(--on-surface)",
                margin: 0,
              }}
            >
              {formatRupiah(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Per-person cards */}
      <div
        className="result-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(result.splits.length, 3)}, 1fr)`,
          gap: "1.5rem",
        }}
      >
        {result.splits.map((split, idx) => (
          <div
            key={split.name + idx}
            className="hover-lift"
            style={{
              background: "var(--surface-container-low)",
              borderRadius: "var(--radius-xl)",
              padding: "1.5rem",
              borderTop: `8px solid ${BORDER_COLORS[idx % BORDER_COLORS.length]}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Person icon */}
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                background: BORDER_COLORS[idx % BORDER_COLORS.length],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                color: "#fff",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
              }}
            >
              {split.name.charAt(0).toUpperCase()}
            </div>

            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "var(--on-surface)",
                marginBottom: "1rem",
                paddingRight: "2.5rem",
              }}
            >
              {split.name}
            </h4>

            {/* Items breakdown */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
                marginBottom: "1rem",
              }}
            >
              {split.items?.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--on-surface-variant)",
                  }}
                >
                  <span>{item.name}</span>
                  <span>{formatRupiah(item.price)}</span>
                </div>
              ))}

              {/* Separator before extras */}
              {(split.tax > 0 || split.service > 0 || split.discount > 0) && (
                <div
                  style={{
                    height: "1px",
                    background: "rgba(178,172,169,0.15)",
                    margin: "0.25rem 0",
                  }}
                />
              )}

              {split.tax > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--on-surface-variant)",
                  }}
                >
                  <span>Tax</span>
                  <span>{formatRupiah(split.tax)}</span>
                </div>
              )}
              {split.service > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--on-surface-variant)",
                  }}
                >
                  <span>Service</span>
                  <span>{formatRupiah(split.service)}</span>
                </div>
              )}
              {split.discount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "#2d6a4f",
                  }}
                >
                  <span>Discount</span>
                  <span>-{formatRupiah(split.discount)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div
              style={{
                paddingTop: "1rem",
                borderTop: "1px solid rgba(178,172,169,0.2)",
              }}
            >
              <p
                className="label-caps"
                style={{
                  color: BORDER_COLORS[idx % BORDER_COLORS.length],
                  fontWeight: 700,
                  marginBottom: "0.125rem",
                }}
              >
                TOTAL DUE
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  color: "var(--on-surface)",
                  margin: 0,
                }}
              >
                {formatRupiah(split.total)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .result-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
