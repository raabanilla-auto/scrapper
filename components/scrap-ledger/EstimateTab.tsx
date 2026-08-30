"use client";

import { colors } from "./theme";
import { Button, Field, NumberInput, SectionLabel, Select } from "./ui";
import { RemoveButton } from "./ProductsTab";
import type { ScrapLedgerViewModel } from "@/lib/scrap-ledger/useScrapLedger";

export function EstimateTab(vm: ScrapLedgerViewModel) {
  return (
    <>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <Field label="Sample Weight">
            <NumberInput value={vm.estimate.sampleWeight} onChange={vm.onEstSampleWeightChange} placeholder="1" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Total Weight for Sale">
            <NumberInput value={vm.estimate.saleWeight} onChange={vm.onEstSaleWeightChange} placeholder="10" />
          </Field>
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <Field label="Cost (₱)">
          <NumberInput value={vm.estimate.cost} onChange={vm.onEstCostChange} placeholder="0" />
        </Field>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <SectionLabel>Sample Content</SectionLabel>
        <Button variant="ghost" style={{ padding: "6px 12px", fontSize: 13 }} onClick={vm.onEstAddRow}>
          + Add Row
        </Button>
      </div>
      <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
        {vm.estimateRows.map((row) => (
          <div
            key={row.key}
            style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 12, display: "grid", gap: 8 }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <Select style={{ flex: 1 }} value={row.elementId} onChange={row.onElementChange}>
                {row.elementOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </Select>
              <Select style={{ flex: 1 }} value={row.subtypeId} onChange={row.onSubtypeChange}>
                {row.subtypeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </Select>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <NumberInput style={{ flex: 1 }} value={row.weight} onChange={row.onWeightChange} placeholder="Weight in sample" />
              <RemoveButton onClick={row.onRemove} />
            </div>
          </div>
        ))}
      </div>

      <SectionLabel>Projected at Sale Weight</SectionLabel>
      <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
        {vm.estProjectedRows.map((row, i) => (
          <div
            key={i}
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: 12,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
            }}
          >
            <span>
              {row.elementName} <span style={{ color: colors.textDim }}>· {row.subtypeName} · {row.weightFmt}</span>
            </span>
            <span style={{ fontWeight: 600 }}>{row.valueFmt}</span>
          </div>
        ))}
      </div>

      <div style={{ background: colors.surface, border: `1px solid ${colors.accentBorder}`, borderRadius: 14, padding: "16px 18px", display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
          <span style={{ color: colors.textDim }}>Estimated Total Price</span>
          <span style={{ fontWeight: 700, color: colors.accent }}>{vm.estTotalFmt}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
          <span style={{ color: colors.textDim }}>Cost</span>
          <span>{vm.estCostFmt}</span>
        </div>
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
          <span>Win/Loss</span>
          <span style={{ color: vm.estWinLossColor }}>{vm.estWinLossFmt}</span>
        </div>
      </div>
    </>
  );
}
