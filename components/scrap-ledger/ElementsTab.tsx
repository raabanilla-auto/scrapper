"use client";

import { colors } from "./theme";
import { Button, NumberInput, TextInput } from "./ui";
import type { ScrapLedgerViewModel } from "@/lib/scrap-ledger/useScrapLedger";

export function ElementsTab(vm: ScrapLedgerViewModel) {
  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <TextInput
          style={{ flex: 1, padding: "11px 12px", fontSize: 14 }}
          value={vm.newElementName}
          onChange={vm.onNewElementNameChange}
          placeholder="New element name"
        />
        <Button variant="primary" style={{ flex: "none", padding: "0 16px", fontSize: 13 }} onClick={vm.onAddElement}>
          + Add
        </Button>
      </div>

      <div className="grid gap-3.5 md:grid-cols-2">
        {vm.elementsRows.map((el) => (
          <div key={el.id} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 14, padding: 14 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
              <input
                type="text"
                value={el.name}
                onChange={el.onNameChange}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${colors.borderSoft}`,
                  padding: "6px 2px",
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: 700,
                  outline: "none",
                }}
              />
              <Button variant="danger-outline" style={{ flex: "none", padding: "8px 12px", fontSize: 12 }} onClick={el.onDelete}>
                Delete
              </Button>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {el.subtypes.map((st) => (
                <div key={st.id} style={{ display: "flex", gap: 8, alignItems: "center", position: "relative" }}>
                  <TextInput
                    style={{ flex: 1, padding: "9px 10px", fontSize: 13, border: `1px solid ${colors.borderSoft}` }}
                    value={st.name}
                    onChange={st.onNameChange}
                  />
                  <NumberInput
                    style={{
                      width: 100,
                      padding: "9px 10px",
                      fontSize: 13,
                      textAlign: "right",
                      border: `1px solid ${colors.borderSoft}`,
                    }}
                    value={st.price}
                    onChange={st.onPriceChange}
                    onBlur={st.onPriceBlur}
                  />
                  <button
                    onClick={st.onToggleMenu}
                    style={{
                      flex: "none",
                      width: 32,
                      height: 32,
                      background: "transparent",
                      border: `1px solid ${colors.borderStrong}`,
                      color: colors.textDim,
                      borderRadius: 8,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    ···
                  </button>
                  {st.menuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: 38,
                        right: 0,
                        background: "oklch(0.24 0.008 60)",
                        border: `1px solid ${colors.borderStrong}`,
                        borderRadius: 10,
                        overflow: "hidden",
                        zIndex: 8,
                        minWidth: 150,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                      }}
                    >
                      <button
                        onClick={st.onViewTrend}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          background: "transparent",
                          border: "none",
                          color: colors.text,
                          padding: "11px 14px",
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        View Price Trend
                      </button>
                      <button
                        onClick={st.onDelete}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          background: "transparent",
                          border: "none",
                          color: colors.danger,
                          padding: "11px 14px",
                          fontSize: 13,
                          cursor: "pointer",
                          borderTop: `1px solid ${colors.border}`,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={el.onAddSubtype}
              style={{
                marginTop: 10,
                background: "transparent",
                border: `1px dashed ${colors.borderStrong}`,
                color: colors.textDim,
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
              }}
            >
              + Add Subtype
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
