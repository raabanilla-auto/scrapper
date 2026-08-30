"use client";

import { colors } from "./theme";
import type { ScrapLedgerViewModel } from "@/lib/scrap-ledger/useScrapLedger";

export function ExpensesTab(vm: ScrapLedgerViewModel) {
  if (vm.noExpenses) {
    return (
      <div style={{ textAlign: "center", padding: "48px 20px", color: colors.textDim, fontSize: 14 }}>
        No expenses logged yet. Tap &ldquo;+ Add&rdquo; to record one.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {vm.expenseRows.map((row) => (
        <div
          key={row.id}
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            padding: 14,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.description}
            </div>
            <div style={{ fontSize: 12, color: colors.textDim, marginTop: 2 }}>{row.date}</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{row.amountFmt}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={row.onEdit} style={iconBtnStyle(colors.accent)}>
              ✎
            </button>
            <button onClick={row.onDelete} style={iconBtnStyle(colors.danger)}>
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function iconBtnStyle(color: string): React.CSSProperties {
  return {
    flex: "none",
    width: 32,
    height: 32,
    background: "transparent",
    border: `1px solid ${color}`,
    color,
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
  };
}
