"use client";

import { useState } from "react";
import type { ItemEntry } from "@/lib/types/splitbill";

interface ItemEditorProps {
  items: ItemEntry[];
  onItemsChange: (items: ItemEntry[]) => void;
}

export default function ItemEditor({ items, onItemsChange }: ItemEditorProps) {
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const addItem = () => {
    if (!newName.trim() || !newPrice) return;
    const price = parseInt(newPrice);
    if (isNaN(price) || price <= 0) return;

    onItemsChange([
      ...items,
      { id: Date.now().toString(), name: newName.trim(), price },
    ]);
    setNewName("");
    setNewPrice("");
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: "name" | "price", value: string) => {
    onItemsChange(
      items.map((item) => {
        if (item.id !== id) return item;
        if (field === "name") return { ...item, name: value };
        return { ...item, price: parseInt(value) || 0 };
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <section
      style={{
        background: "var(--surface-container-low)",
        borderRadius: "var(--radius-xl)",
        padding: "1.25rem",
        minWidth: 0,
        overflow: "hidden",
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
          Items Ordered
        </h2>
        <span
          className="label-caps"
          style={{ color: "var(--primary)", fontWeight: 700 }}
        >
          {items.length} ITEMS
        </span>
      </div>

      {/* Item List — editable */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: "var(--surface-container-lowest)",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(item.id, "name", e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--on-surface)",
                outline: "none",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            />
            <div style={{ position: "relative", width: "clamp(85px, 28%, 120px)", flexShrink: 0 }}>
              <span
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  color: "var(--outline)",
                }}
              >
                Rp
              </span>
              <input
                type="number"
                value={item.price}
                onChange={(e) => updateItem(item.id, "price", e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--surface-container)",
                  border: "none",
                  borderRadius: "var(--radius-full)",
                  padding: "0.5rem 0.75rem 0.5rem 2rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "var(--on-surface)",
                  outline: "none",
                  textAlign: "right",
                }}
              />
            </div>
            <button
              onClick={() => removeItem(item.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--outline)",
                opacity: 0.5,
                fontSize: "1rem",
                flexShrink: 0,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.color = "#b02500";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.5";
                e.currentTarget.style.color = "var(--outline)";
              }}
            >
              🗑️
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--outline)",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
            }}
          >
            Belum ada item. Scan receipt atau tambah manual di bawah.
          </div>
        )}
      </div>

      {/* Subtotal */}
      {items.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.75rem 1.25rem",
            background: "var(--primary-container)",
            borderRadius: "var(--radius-lg)",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "var(--on-primary-container)",
            }}
          >
            Subtotal
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1rem",
              color: "var(--on-primary-container)",
            }}
          >
            Rp {subtotal.toLocaleString("id-ID")}
          </span>
        </div>
      )}

      {/* Add new item */}
      <div className="item-add-grid" style={{ marginBottom: "0.75rem" }}>
        <input
          type="text"
          className="input-pill"
          placeholder="Nama item"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <input
          type="number"
          className="input-pill"
          placeholder="Harga"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
      </div>
      <button
        onClick={addItem}
        style={{
          width: "100%",
          padding: "1rem",
          background: "var(--surface-container-highest)",
          color: "var(--primary)",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "0.9375rem",
          borderRadius: "var(--radius-full)",
          border: "none",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-container)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--surface-container-highest)";
        }}
      >
        + Tambah Item
      </button>

      <style jsx>{`
        .item-add-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        @media (max-width: 480px) {
          .item-add-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
