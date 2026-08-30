"use client";

import { colors, fonts } from "../theme";
import { Button, Field, NumberInput, Select } from "../ui";
import type { ScrapLedgerViewModel } from "@/lib/scrap-ledger/useScrapLedger";

type Props = Pick<
  ScrapLedgerViewModel,
  | "invForm"
  | "elementOptions"
  | "invSubtypeOptions"
  | "onInvElementChange"
  | "onInvSubtypeChange"
  | "onInvWeightChange"
  | "onInvBuyPriceChange"
  | "onCloseAddInventory"
  | "onSaveInventory"
>;

export function AddInventoryModal(vm: Props) {
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
        zIndex: 20,
      }}
    >
      <div
        style={{
          background: colors.surfaceModal,
          border: `1px solid ${colors.accentBorder}`,
          borderRadius: 16,
          padding: 20,
          width: "100%",
          maxWidth: 380,
        }}
      >
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
          Add Recovered Scrap
        </div>
        <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
          <Field label="Element">
            <Select style={{ width: "100%", padding: 11 }} value={vm.invForm.elementId} onChange={vm.onInvElementChange}>
              {vm.elementOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Subtype">
            <Select style={{ width: "100%", padding: 11 }} value={vm.invForm.subtypeId} onChange={vm.onInvSubtypeChange}>
              {vm.invSubtypeOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Total Weight">
            <NumberInput value={vm.invForm.weight} onChange={vm.onInvWeightChange} placeholder="0" />
          </Field>
          <Field label="Buy Price (batch total, ₱)">
            <NumberInput value={vm.invForm.buyPrice} onChange={vm.onInvBuyPriceChange} placeholder="0" />
          </Field>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="outline" style={{ flex: 1 }} onClick={vm.onCloseAddInventory}>
            Cancel
          </Button>
          <Button variant="primary" style={{ flex: 1 }} onClick={vm.onSaveInventory}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
