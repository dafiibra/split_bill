"use client";

import { useState } from "react";
import Tag from "../ui/Tag";
import InfoBanner from "../ui/InfoBanner";

function InputDetailCard() {
  const [participants, setParticipants] = useState(["Andi", "Siska"]);

  const removeParticipant = (name: string) => {
    setParticipants(participants.filter((p) => p !== name));
  };

  return (
    <div className="card" style={{ height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
        <div
          style={{
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "var(--radius-md)",
            background: "var(--primary-container)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
          }}
        >
          📋
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--on-surface)",
            margin: 0,
          }}
        >
          Input Detail
        </h3>
      </div>

      {/* Manage Participants */}
      <label className="label-caps" style={{ display: "block", marginBottom: "0.625rem" }}>
        Manage Participants
      </label>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <input
          type="text"
          className="input-pill"
          placeholder="Add friend name..."
          style={{ flex: 1 }}
        />
        <button
          className="btn-primary"
          style={{
            padding: "0.75rem",
            borderRadius: "var(--radius-lg)",
            fontSize: "1rem",
            width: "2.75rem",
            height: "2.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Add participant"
        >
          👤
        </button>
      </div>

      {/* Bill Items */}
      <label className="label-caps" style={{ display: "block", marginBottom: "0.625rem" }}>
        Bill Items
      </label>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <input
          type="text"
          className="input-pill"
          placeholder="Item name"
          style={{ flex: 1 }}
        />
        <input
          type="text"
          className="input-pill"
          placeholder="Price"
          style={{ width: "120px" }}
        />
        <button
          className="btn-primary"
          style={{
            padding: "0.75rem",
            borderRadius: "var(--radius-full)",
            fontSize: "1.25rem",
            width: "2.75rem",
            height: "2.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Add item"
        >
          +
        </button>
      </div>

      {/* Participant tags */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {participants.map((p) => (
          <Tag key={p} label={p} onRemove={() => removeParticipant(p)} />
        ))}
      </div>
    </div>
  );
}

function BankTransferCard() {
  return (
    <div className="card" style={{ height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
        <div
          style={{
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-container)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
          }}
        >
          🏛️
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--on-surface)",
            margin: 0,
          }}
        >
          Bank Transfer
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem" }}>
            Bank Name
          </label>
          <input
            type="text"
            className="input-pill"
            placeholder="e.g. BCA, Mandiri, GoPay"
          />
        </div>

        <div>
          <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem" }}>
            Account Number
          </label>
          <input
            type="text"
            className="input-pill"
            placeholder="123-456-7890"
          />
        </div>

        <div>
          <label className="label-caps" style={{ display: "block", marginBottom: "0.5rem" }}>
            Account Owner Name
          </label>
          <input
            type="text"
            className="input-pill"
            placeholder="Your Full Name"
          />
        </div>

        <InfoBanner message="This info will be shared with your friends so they can easily pay you back." />
      </div>
    </div>
  );
}

export default function InputDetailSection() {
  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
      }}
    >
      <div
        className="detail-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          alignItems: "stretch",
        }}
      >
        <div className="animate-fade-in-up delay-100" style={{ opacity: 0 }}>
          <InputDetailCard />
        </div>
        <div className="animate-fade-in-up delay-300" style={{ opacity: 0 }}>
          <BankTransferCard />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}