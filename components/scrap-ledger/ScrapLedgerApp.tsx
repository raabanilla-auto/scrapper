"use client";

import { useScrapLedger } from "@/lib/scrap-ledger/useScrapLedger";
import { colors } from "./theme";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";
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
        className="flex w-full max-w-[480px] flex-col md:max-w-[760px] lg:max-w-[1180px] lg:flex-row"
        style={{
          height: "100%",
          background: colors.appBg,
          color: colors.text,
          position: "relative",
        }}
      >
        <div
          className="hidden lg:flex lg:w-60 lg:flex-none"
          style={{ borderRight: `1px solid ${colors.borderNav}`, background: colors.navBg }}
        >
          <SideNav {...vm} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div style={{ flex: 1, overflowY: "auto" }}>
            <Header {...vm} />
            <div className="px-5 pt-4 pb-7 md:px-9 md:pt-5 lg:px-12 lg:pt-6">
              {vm.tab === "products" && <ProductsTab {...vm} />}
              {vm.isInventoryTab && <InventoryTab {...vm} />}
              {vm.isElementsTab && <ElementsTab {...vm} />}
              {vm.isEstimateTab && <EstimateTab {...vm} />}
            </div>
          </div>

          {vm.showBottomNav && (
            <div className="lg:hidden">
              <BottomNav {...vm} />
            </div>
          )}
        </div>

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
