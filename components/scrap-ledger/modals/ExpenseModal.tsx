"use client";

import { colors, fonts } from "../theme";
import { Button, DateInput, Field, NumberInput, TextInput } from "../ui";
import type { ScrapLedgerViewModel } from "@/lib/scrap-ledger/useScrapLedger";

type Props = Pick<
  ScrapLedgerViewModel,
  | "expenseForm"
  | "isEditingExpense"
  | "onExpenseDateChange"
  | "onExpenseDescriptionChange"
  | "onExpenseAmountChange"
  | "onCloseExpenseModal"
  | "onSaveExpense"
>;

export function ExpenseModal(vm: Props) {
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
          {vm.isEditingExpense ? "Edit Expense" : "Add Expense"}
        </div>
        <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
          <Field label="Date">
            <DateInput value={vm.expenseForm.date} onChange={vm.onExpenseDateChange} />
          </Field>
          <Field label="Description">
            <TextInput value={vm.expenseForm.description} onChange={vm.onExpenseDescriptionChange} placeholder="e.g. Fuel" />
          </Field>
          <Field label="Amount (₱)">
            <NumberInput value={vm.expenseForm.amount} onChange={vm.onExpenseAmountChange} placeholder="0" />
          </Field>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="outline" style={{ flex: 1 }} onClick={vm.onCloseExpenseModal}>
            Cancel
          </Button>
          <Button variant="primary" style={{ flex: 1 }} onClick={vm.onSaveExpense}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
