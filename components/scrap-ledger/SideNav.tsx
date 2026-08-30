"use client";

import { colors, fonts } from "./theme";
import type { ScrapLedgerViewModel } from "@/lib/scrap-ledger/useScrapLedger";

type Props = Pick<
  ScrapLedgerViewModel,
  "tab" | "onGoProducts" | "onGoInventory" | "onGoElements" | "onGoEstimate"
>;

const items: { key: Props["tab"]; label: string; glyph: string; onClick: keyof Props }[] = [
  { key: "products", label: "Products", glyph: "▪", onClick: "onGoProducts" },
  { key: "inventory", label: "Inventory", glyph: "◆", onClick: "onGoInventory" },
  { key: "elements", label: "Elements", glyph: "●", onClick: "onGoElements" },
  { key: "estimate", label: "Estimate", glyph: "▲", onClick: "onGoEstimate" },
];

export function SideNav(props: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px 12px" }}>
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: "0.1em",
          color: colors.accent,
          padding: "0 10px",
          marginBottom: 24,
        }}
      >
        SCRAP LEDGER
      </div>
      <div style={{ display: "grid", gap: 4 }}>
        {items.map((item) => {
          const active = props.tab === item.key;
          return (
            <button
              key={item.key}
              onClick={props[item.onClick] as () => void}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: active ? colors.surface : "transparent",
                border: `1px solid ${active ? colors.accentBorder : "transparent"}`,
                borderRadius: 10,
                padding: "11px 12px",
                cursor: "pointer",
                color: active ? colors.accent : colors.textDim,
                fontSize: 14,
                fontWeight: 700,
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 13 }}>{item.glyph}</span>
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
