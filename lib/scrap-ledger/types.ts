export type PriceHistoryEntry = {
  date: string;
  price: number;
};

export type Subtype = {
  id: string;
  name: string;
  price: number;
  history: PriceHistoryEntry[];
};

// Named ScrapElement to avoid colliding with the DOM `Element` type.
export type ScrapElement = {
  id: string;
  name: string;
  subtypes: Subtype[];
};

export type ProductAttribute = {
  key: string;
  elementId: string;
  subtypeId: string;
  weight: number | string;
};

export type Product = {
  id: string;
  serialId: string;
  model: string;
  description: string;
  uom: string;
  totalWeight: number | string;
  buyingPrice: number | string;
  totalExpenses: number | string;
  attributes: ProductAttribute[];
};

export type ProductDraft = Omit<Product, "id"> & { id: string | null };

export type Batch = {
  id: string;
  elementId: string;
  subtypeId: string;
  weight: number;
  buyPrice: number;
  sourceProductId?: string;
};

export type EstimateRow = {
  key: string;
  elementId: string;
  subtypeId: string;
  weight: number | string;
};

export type Estimate = {
  sampleWeight: number | string;
  saleWeight: number | string;
  cost: number | string;
  rows: EstimateRow[];
};

export type Expense = {
  id: string;
  date: string;
  description: string;
  amount: number | string;
};

export type Tab = "products" | "inventory" | "elements" | "estimate" | "expenses";
export type ProductScreen = "list" | "view" | "edit";

export type LedgerData = {
  elements: ScrapElement[];
  products: Product[];
  batches: Batch[];
  expenses: Expense[];
};
