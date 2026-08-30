"use client";

import { colors, fonts } from "../theme";
import { Button } from "../ui";
import type { ScrapLedgerViewModel } from "@/lib/scrap-ledger/useScrapLedger";

export function TrendModal({ trend, onCloseTrend }: Pick<ScrapLedgerViewModel, "trend" | "onCloseTrend">) {
  if (!trend) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: colors.overlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 25,
      }}
    >
      <div
        style={{
          background: colors.surfaceModal,
          border: `1px solid ${colors.accentBorder}`,
          borderRadius: 16,
          padding: 20,
          width: "100%",
          maxWidth: 360,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 18 }}>{trend.elementName}</div>
          <div style={{ fontSize: 13, color: colors.textDim }}>{trend.subtypeName}</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: colors.accent, marginBottom: 16 }}>{trend.currentPriceFmt}</div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, marginBottom: 14, padding: "0 4px" }}>
          {trend.historyRows.map((h, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
              <div style={{ width: "100%", maxWidth: 28, background: colors.accent, borderRadius: "4px 4px 0 0", height: h.barHeightPct }} />
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gap: 8, maxHeight: 180, overflowY: "auto", marginBottom: 16 }}>
          {trend.historyRows.map((h, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                borderBottom: `1px solid ${colors.borderHeader}`,
                paddingBottom: 6,
              }}
            >
              <span style={{ color: colors.textDim }}>{h.date}</span>
              <span>{h.priceFmt}</span>
            </div>
          ))}
        </div>

        <Button variant="primary" style={{ width: "100%" }} onClick={onCloseTrend}>
          Close
        </Button>
      </div>
    </div>
  );
}
