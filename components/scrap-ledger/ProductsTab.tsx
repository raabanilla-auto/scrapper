"use client";

import { colors, fonts } from "./theme";
import { Button, Card, Field, NumberInput, SectionLabel, Select, TextArea, TextInput } from "./ui";
import type { ScrapLedgerViewModel } from "@/lib/scrap-ledger/useScrapLedger";

type Props = ScrapLedgerViewModel;

export function ProductsTab(vm: Props) {
  if (vm.isProductsList) return <ProductsList vm={vm} />;
  if (vm.isProductView) return <ProductView vm={vm} />;
  if (vm.isProductEdit) return <ProductEdit vm={vm} />;
  return null;
}

function ProductsList({ vm }: { vm: Props }) {
  if (vm.noProducts) {
    return (
      <div style={{ textAlign: "center", padding: "48px 20px", color: colors.textDim, fontSize: 14 }}>
        No products yet. Tap &ldquo;+ Add&rdquo; to log your first item.
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {vm.productRows.map((row) => (
        <div
          key={row.id}
          onClick={row.onSelect}
          style={{
            cursor: "pointer",
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{row.description}</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontSize: 13,
              color: colors.textDim,
            }}
          >
            <span>UOM · {row.uom}</span>
            <span>Buying · {row.buyingPriceFmt}</span>
          </div>
          <div style={{ marginTop: 8, textAlign: "right", fontSize: 17, fontWeight: 700, color: colors.accent }}>
            {row.materialTotalFmt}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductView({ vm }: { vm: Props }) {
  const p = vm.viewProduct;
  return (
    <>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <Button variant="ghost" style={{ flex: 1, minHeight: 44 }} onClick={vm.onEditProduct}>
          Edit
        </Button>
        <Button variant="danger-outline" style={{ flex: 1, minHeight: 44 }} onClick={vm.onDeleteProductClick}>
          Delete
        </Button>
      </div>

      <Card style={{ marginBottom: 14, display: "grid", gap: 12 }}>
        <Detail label="Serial ID" value={p.serialId} bold />
        <Detail label="Model" value={p.modelDisplay} />
        <Detail label="Description" value={p.description} />
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Detail label="UOM" value={p.uom} />
          <Detail label="Total Weight" value={p.totalWeightFmt} />
          <Detail label="Buying Price" value={p.buyingPriceFmt} />
          <Detail label="Total Expenses" value={p.totalExpensesFmt} />
        </div>
      </Card>

      <SectionLabel>Attributes</SectionLabel>
      <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
        {vm.viewAttrRows.map((row, i) => (
          <div
            key={i}
            style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 12 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              <span>
                {row.elementName} <span style={{ color: colors.textDim, fontWeight: 400 }}>· {row.subtypeName}</span>
              </span>
              <span>{row.valueFmt}</span>
            </div>
            <div style={{ fontSize: 12, color: colors.textDim }}>
              {row.weightFmt} ({row.pctFmt} of total)
            </div>
          </div>
        ))}
      </div>

      <Card accent style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: colors.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Material Total Price
        </div>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 22, color: colors.accent }}>
          {p.materialTotalFmt}
        </div>
      </Card>
    </>
  );
}

function Detail({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: colors.textDim, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: bold ? 600 : 400 }}>{value}</div>
    </div>
  );
}

function ProductEdit({ vm }: { vm: Props }) {
  const draft = vm.draft;
  if (!draft) return null;
  return (
    <>
      <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
        <Field label="Serial ID *">
          <TextInput value={draft.serialId} onChange={vm.onSerialIdChange} placeholder="e.g. MTR-2026-0091" />
        </Field>
        <Field label="Model">
          <TextInput value={draft.model} onChange={vm.onModelChange} placeholder="Optional" />
        </Field>
        <Field label="Description">
          <TextArea value={draft.description} onChange={vm.onDescriptionChange} rows={3} />
        </Field>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label="UOM">
              <TextInput value={draft.uom} onChange={vm.onUomChange} placeholder="kg" />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Total Weight">
              <NumberInput value={draft.totalWeight} onChange={vm.onTotalWeightChange} placeholder="0" />
            </Field>
          </div>
        </div>
        <Field label="Buying Price (₱)">
          <NumberInput value={draft.buyingPrice} onChange={vm.onBuyingPriceChange} placeholder="0" />
        </Field>
        <Field label="Total Expenses (₱)">
          <NumberInput value={draft.totalExpenses} onChange={vm.onTotalExpensesChange} placeholder="0" />
        </Field>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <SectionLabel>Attributes</SectionLabel>
        <Button variant="ghost" style={{ padding: "6px 12px", fontSize: 13 }} onClick={vm.onAddAttrRow}>
          + Add Row
        </Button>
      </div>

      <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
        {vm.draftAttrRows.map((row) => (
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
              <NumberInput style={{ flex: 1 }} value={row.weight} onChange={row.onWeightChange} placeholder="Weight" />
              <RemoveButton onClick={row.onRemove} />
            </div>
          </div>
        ))}
      </div>

      <Card accent style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: colors.textDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Material Total Price
        </div>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 20, color: colors.accent }}>
          {vm.draftMaterialTotalFmt}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 10 }}>
        <Button variant="outline" style={{ flex: 1, minHeight: 44 }} onClick={vm.onCancelEdit}>
          Cancel
        </Button>
        <Button variant="primary" style={{ flex: 1, minHeight: 44 }} disabled={vm.saveDisabled} onClick={vm.onSaveProduct}>
          Save
        </Button>
      </div>
    </>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: "none",
        width: 38,
        height: 38,
        background: "transparent",
        border: `1px solid ${colors.dangerBorder}`,
        color: colors.danger,
        borderRadius: 8,
        fontSize: 16,
        cursor: "pointer",
      }}
    >
      ×
    </button>
  );
}
