"use client";

import { useScrapLedger } from "@/lib/scrap-ledger/useScrapLedger";
import { colors } from "./theme";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { ProductsTab } from "./ProductsTab";
import { InventoryTab } from "./InventoryTab";
import { ElementsTab } from "./ElementsTab";
import { EstimateTab } from "./EstimateTab";
import { TrendModal } from "./modals/TrendModal";
import { AddInventoryModal } from "./modals/AddInventoryModal";
import { ConfirmModal } from "./modals/ConfirmModal";

export function ScrapLedgerApp() {
  const vm = useScrapLedger();

  return (
    <div
      style={{
        height: "100dvh",
        background: colors.pageBg,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          height: "100%",
          background: colors.appBg,
          color: colors.text,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Header {...vm} />
          <div style={{ padding: "16px 20px 28px" }}>
            {vm.tab === "products" && <ProductsTab {...vm} />}
            {vm.isInventoryTab && <InventoryTab {...vm} />}
            {vm.isElementsTab && <ElementsTab {...vm} />}
            {vm.isEstimateTab && <EstimateTab {...vm} />}
          </div>
        </div>

        {vm.showBottomNav && <BottomNav {...vm} />}

        {vm.showTrendModal && <TrendModal trend={vm.trend} onCloseTrend={vm.onCloseTrend} />}
        {vm.invAdding && <AddInventoryModal {...vm} />}
        {vm.showDeleteProductModal && (
          <ConfirmModal
            title="Delete Product?"
            message={`"${vm.deleteProductLabel}" will be permanently removed.`}
            onCancel={vm.onCancelDeleteProduct}
            onConfirm={vm.onConfirmDeleteProduct}
          />
        )}
        {vm.showDeleteElementModal && (
          <ConfirmModal
            title="Delete Element?"
            message={`"${vm.deleteElementLabel}" and its subtypes will be removed. Products referencing it will show as unmatched.`}
            onCancel={vm.onCancelDeleteElement}
            onConfirm={vm.onConfirmDeleteElement}
          />
        )}
      </div>
    </div>
  );
}
