import type { Product, ScrapElement } from "./types";

export function fmtCurrency(n: number | string): string {
  const num = Number(n) || 0;
  return (
    "₱" +
    num.toLocaleString("en-PH", {
      maximumFractionDigits: Math.abs(num % 1) > 0.0001 ? 2 : 0,
    })
  );
}

export function fmtWeight(n: number | string): string {
  const num = Number(n) || 0;
  return num.toLocaleString("en-PH", { maximumFractionDigits: 2 });
}

export function fmtSigned(n: number): string {
  return (n >= 0 ? "+" : "") + fmtCurrency(n);
}

export function winLossColor(n: number): string {
  return n >= 0 ? "oklch(0.78 0.13 85)" : "oklch(0.68 0.16 25)";
}

export function uid(prefix: string): string {
  return prefix + "-" + Math.random().toString(36).slice(2, 9);
}

export function todayStr(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function findElement(elements: ScrapElement[], id: string): ScrapElement | undefined {
  return elements.find((e) => e.id === id);
}

export function findSubtype(elements: ScrapElement[], elId: string, stId: string) {
  const el = findElement(elements, elId);
  return el ? el.subtypes.find((s) => s.id === stId) : undefined;
}

export function subtypePrice(elements: ScrapElement[], elId: string, stId: string): number {
  const st = findSubtype(elements, elId, stId);
  return st ? st.price : 0;
}

export function subtypeOptionsFor(elements: ScrapElement[], elId: string) {
  const el = findElement(elements, elId);
  return el ? el.subtypes.map((s) => ({ id: s.id, name: s.name })) : [];
}

export function materialTotal(elements: ScrapElement[], product: Pick<Product, "attributes">): number {
  return (product.attributes || []).reduce(
    (sum, a) => sum + (Number(a.weight) || 0) * subtypePrice(elements, a.elementId, a.subtypeId),
    0,
  );
}

export function syncProductToInventory(
  elements: ScrapElement[],
  productId: string,
  product: Pick<Product, "attributes" | "buyingPrice" | "totalExpenses" | "totalWeight">,
) {
  const totalCost = (Number(product.buyingPrice) || 0) + (Number(product.totalExpenses) || 0);
  const totalWeight = Number(product.totalWeight) || 0;
  const costPerUnit = totalWeight > 0 ? totalCost / totalWeight : 0;
  return (product.attributes || [])
    .filter((a) => a.elementId && a.subtypeId && Number(a.weight) > 0)
    .map((a) => ({
      id: uid("b"),
      elementId: a.elementId,
      subtypeId: a.subtypeId,
      weight: Number(a.weight),
      buyPrice: Number(a.weight) * costPerUnit,
      sourceProductId: productId,
    }));
}
