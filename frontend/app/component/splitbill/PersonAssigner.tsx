"use client";

import { useState } from "react";
import type { ItemEntry, Participant } from "@/lib/types/splitbill";

interface PersonAssignerProps {
  items: ItemEntry[];
  participants: Participant[];
  onParticipantsChange: (p: Participant[]) => void;
  /** Map of itemId → participantId[] */
  assignments: Record<string, string[]>;
  onAssignmentsChange: (a: Record<string, string[]>) => void;
}

const COLORS = [
  { bg: "var(--primary)", text: "#fff" },
  { bg: "var(--secondary-container)", text: "var(--on-secondary-container)" },
  { bg: "var(--tertiary-container)", text: "var(--on-tertiary-container)" },
  { bg: "var(--primary-container)", text: "var(--on-primary-container)" },
  { bg: "var(--surface-container-highest)", text: "var(--on-surface)" },
];

export default function PersonAssigner({
  items,
  participants,
  onParticipantsChange,
  assignments,
  onAssignmentsChange,
}: PersonAssignerProps) {
  const [newName, setNewName] = useState("");

  const addParticipant = () => {
    if (!newName.trim()) return;
    // Prevent duplicate names
    if (participants.some((p) => p.name.toLowerCase() === newName.trim().toLowerCase())) {
      return;
    }
    onParticipantsChange([
      ...participants,
      { id: Date.now().toString(), name: newName.trim() },
    ]);
    setNewName("");
  };

  const removeParticipant = (id: string) => {
    onParticipantsChange(participants.filter((p) => p.id !== id));
    // Clean up assignments
    const updated = { ...assignments };
    for (const key in updated) {
      updated[key] = updated[key].filter((pid) => pid !== id);
    }
    onAssignmentsChange(updated);
  };

  const toggleAssignment = (itemId: string, personId: string) => {
    const current = assignments[itemId] || [];
    const updated = current.includes(personId)
      ? current.filter((id) => id !== personId)
      : [...current, personId];
    onAssignmentsChange({ ...assignments, [itemId]: updated });
  };

  // Count assigned items per person
  const getAssignedCount = (personId: string): number => {
    return Object.values(assignments).filter((ids) => ids.includes(personId)).length;
  };

  return (
    <section
      style={{
        background: "var(--surface-container-low)",
        borderRadius: "var(--radius-xl)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.5rem",
            color: "var(--on-surface)",
            margin: 0,
          }}
        >
          The Crew
        </h2>
        <span
          className="label-caps"
          style={{ color: "var(--primary)", fontWeight: 700 }}
        >
          {participants.length} PEOPLE
        </span>
      </div>

      {/* Participant tags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        {participants.map((p, idx) => {
          const c = COLORS[idx % COLORS.length];
          const count = getAssignedCount(p.id);
          return (
            <div
              key={p.id}
              style={{
                background: c.bg,
                color: c.text,
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-full)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              {p.name}
              {count > 0 && (
                <span
                  style={{
                    background: "rgba(255,255,255,0.3)",
                    borderRadius: "var(--radius-full)",
                    padding: "0.125rem 0.375rem",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              )}
              <button
                onClick={() => removeParticipant(p.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  opacity: 0.7,
                  padding: 0,
                  fontSize: "0.75rem",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* Add participant input */}
      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <input
          type="text"
          className="input-pill"
          placeholder="Tambah teman..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addParticipant()}
          style={{ paddingRight: "5rem" }}
        />
        <button
          onClick={addParticipant}
          className="btn-primary"
          style={{
            position: "absolute",
            right: "0.35rem",
            top: "0.35rem",
            bottom: "0.35rem",
            padding: "0 1rem",
            fontSize: "0.8125rem",
            borderRadius: "var(--radius-full)",
          }}
        >
          Add
        </button>
      </div>

      {/* Assignment matrix: each item → assign to people */}
      {items.length > 0 && participants.length > 0 && (
        <div>
          <p
            className="label-caps"
            style={{ marginBottom: "0.75rem", color: "var(--primary)" }}
          >
            ASSIGN ITEMS KE ORANG
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--on-surface-variant)",
              marginBottom: "0.75rem",
              lineHeight: 1.5,
            }}
          >
            Klik nama orang di bawah setiap item untuk assign. Satu item bisa di-share ke beberapa orang.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {items.map((item) => {
              const assignedIds = assignments[item.id] || [];
              const isUnassigned = assignedIds.length === 0;

              return (
                <div
                  key={item.id}
                  style={{
                    background: "var(--surface-container-lowest)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1rem",
                    borderLeft: isUnassigned
                      ? "3px solid #d4a017"
                      : "3px solid #2d6a4f",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "var(--on-surface)",
                      }}
                    >
                      {item.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--on-surface)",
                      }}
                    >
                      Rp {item.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {participants.map((p, idx) => {
                      const isAssigned = assignedIds.includes(p.id);
                      const c = COLORS[idx % COLORS.length];
                      return (
                        <button
                          key={p.id}
                          onClick={() => toggleAssignment(item.id, p.id)}
                          style={{
                            padding: "0.35rem 0.75rem",
                            borderRadius: "var(--radius-full)",
                            border: isAssigned
                              ? "none"
                              : "1.5px dashed var(--outline-variant)",
                            background: isAssigned ? c.bg : "transparent",
                            color: isAssigned
                              ? c.text
                              : "var(--on-surface-variant)",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {isAssigned ? "✓ " : ""}
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                  {isUnassigned && (
                    <p
                      style={{
  fontFamily: "var(--font-body)",
  fontSize: "0.6875rem",
  color: "#d4a017",
  margin: 0,
  marginTop: "0.375rem",
}}
                    >
                      ⚠ Belum di-assign
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {items.length > 0 && participants.length === 0 && (
        <div
          style={{
            padding: "1.5rem",
            background: "var(--surface-container-lowest)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--on-surface-variant)",
            }}
          >
            Tambahkan teman dulu untuk mulai assign items.
          </p>
        </div>
      )}
    </section>
  );
}
