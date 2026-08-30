"use client";

import { colors } from "./theme";
import type { ScrapLedgerViewModel } from "@/lib/scrap-ledger/useScrapLedger";

type Props = Pick<
  ScrapLedgerViewModel,
  "tab" | "onGoProducts" | "onGoInventory" | "onGoElements" | "onGoEstimate" | "onGoExpenses"
>;

const items: { key: Props["tab"]; label: string; glyph: string; onClick: keyof Props }[] = [
  { key: "products", label: "Products", glyph: "▪", onClick: "onGoProducts" },
  { key: "inventory", label: "Inventory", glyph: "◆", onClick: "onGoInventory" },
  { key: "elements", label: "Elements", glyph: "●", onClick: "onGoElements" },
  { key: "estimate", label: "Estimate", glyph: "▲", onClick: "onGoEstimate" },
  { key: "expenses", label: "Expenses", glyph: "$", onClick: "onGoExpenses" },
];

export function BottomNav(props: Props) {
  return (
    <div
      style={{
        flex: "none",
        display: "flex",
        background: colors.navBg,
        borderTop: `1px solid ${colors.borderNav}`,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {items.map((item) => (
        <button
          key={item.key}
          onClick={props[item.onClick] as () => void}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            padding: "12px 0 10px",
            cursor: "pointer",
            color: props.tab === item.key ? colors.accent : colors.textFaint,
            fontSize: 11,
            fontWeight: 700,
            minHeight: 56,
          }}
        >
          <div style={{ fontSize: 13, marginBottom: 3 }}>{item.glyph}</div>
          {item.label}
        </button>
      ))}
    </div>
  );
}
