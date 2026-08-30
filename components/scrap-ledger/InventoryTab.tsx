"use client";

import { colors } from "./theme";
import type { ScrapLedgerViewModel } from "@/lib/scrap-ledger/useScrapLedger";

export function InventoryTab(vm: ScrapLedgerViewModel) {
  if (vm.noInventory) {
    return (
      <div style={{ textAlign: "center", padding: "48px 20px", color: colors.textDim, fontSize: 14 }}>
        No recovered scrap logged yet. Tap &ldquo;+ Add Batch&rdquo; to record one.
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.accentBorder}`,
          borderRadius: 14,
          padding: "16px 18px",
          marginBottom: 16,
          display: "grid",
          gap: 10,
        }}
      >
        <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: colors.textDim }}>
          Grand Total
        </div>
        <Row label="Total Cost" value={vm.grandCostFmt} />
        <Row label="Total Value" value={vm.grandTotalFmt} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            fontWeight: 700,
            paddingTop: 6,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <span>Net Win/Loss</span>
          <span style={{ color: vm.grandWinLossColor }}>{vm.grandWinLossFmt}</span>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {vm.inventoryRows.map((row, i) => (
          <div key={i} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>
                {row.elementName} <span style={{ color: colors.textDim, fontWeight: 400 }}>· {row.subtypeName}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: row.winLossColor }}>{row.winLossFmt}</div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px 12px",
                fontSize: 13,
                color: colors.textDim,
              }}
            >
              <Metric label="Weight" value={row.weightFmt} />
              <Metric label="Price" value={row.priceFmt} />
              <Metric label="Cost" value={row.costFmt} />
              <Metric label="Total" value={row.totalFmt} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
      <span style={{ color: colors.textDim }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      {label} <span style={{ color: colors.text, float: "right" }}>{value}</span>
    </div>
  );
}
