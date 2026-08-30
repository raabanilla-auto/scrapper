import type { Batch, Estimate, LedgerData, Product, ScrapElement } from "./types";

const DEFAULT_ELEMENTS: ScrapElement[] = [
  {
    id: "el-copper",
    name: "Copper",
    subtypes: [
      {
        id: "st-1",
        name: "Bare Bright",
        price: 450,
        history: [
          { date: "Jul 1, 2026", price: 420 },
          { date: "Aug 15, 2026", price: 450 },
        ],
      },
      {
        id: "st-2",
        name: "#1 Copper",
        price: 400,
        history: [
          { date: "Jul 1, 2026", price: 380 },
          { date: "Aug 15, 2026", price: 400 },
        ],
      },
    ],
  },
  {
    id: "el-aluminum",
    name: "Aluminum",
    subtypes: [
      {
        id: "st-3",
        name: "Clean Alum",
        price: 90,
        history: [
          { date: "Jul 1, 2026", price: 80 },
          { date: "Aug 15, 2026", price: 90 },
        ],
      },
      {
        id: "st-4",
        name: "Alum Cans",
        price: 55,
        history: [
          { date: "Jul 1, 2026", price: 50 },
          { date: "Aug 15, 2026", price: 55 },
        ],
      },
    ],
  },
  {
    id: "el-silver",
    name: "Silver",
    subtypes: [
      {
        id: "st-5",
        name: "Sterling",
        price: 35000,
        history: [
          { date: "Jul 1, 2026", price: 32000 },
          { date: "Aug 15, 2026", price: 35000 },
        ],
      },
    ],
  },
  {
    id: "el-gold",
    name: "Gold",
    subtypes: [
      {
        id: "st-6",
        name: "14K",
        price: 2270000,
        history: [
          { date: "Jul 1, 2026", price: 2100000 },
          { date: "Aug 15, 2026", price: 2270000 },
        ],
      },
    ],
  },
  {
    id: "el-metal",
    name: "Metal",
    subtypes: [
      {
        id: "st-7",
        name: "Mixed Metal",
        price: 30,
        history: [
          { date: "Jul 1, 2026", price: 28 },
          { date: "Aug 15, 2026", price: 30 },
        ],
      },
    ],
  },
  {
    id: "el-stainless",
    name: "Stainless",
    subtypes: [
      {
        id: "st-8",
        name: "304 Stainless",
        price: 65,
        history: [
          { date: "Jul 1, 2026", price: 60 },
          { date: "Aug 15, 2026", price: 65 },
        ],
      },
    ],
  },
  {
    id: "el-rubber",
    name: "Rubber",
    subtypes: [
      {
        id: "st-9",
        name: "Scrap Rubber",
        price: 10,
        history: [
          { date: "Jul 1, 2026", price: 9 },
          { date: "Aug 15, 2026", price: 10 },
        ],
      },
    ],
  },
  {
    id: "el-plastic",
    name: "Plastic",
    subtypes: [
      {
        id: "st-10",
        name: "PET",
        price: 15,
        history: [
          { date: "Jul 1, 2026", price: 13 },
          { date: "Aug 15, 2026", price: 15 },
        ],
      },
      {
        id: "st-11",
        name: "HDPE",
        price: 20,
        history: [
          { date: "Jul 1, 2026", price: 18 },
          { date: "Aug 15, 2026", price: 20 },
        ],
      },
    ],
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "p1",
    serialId: "MTR-2026-0091",
    model: "Siemens 3-Phase Motor",
    description: "Industrial 3-phase electric motor, housing removed",
    uom: "kg",
    totalWeight: 42,
    buyingPrice: 3200,
    totalExpenses: 300,
    attributes: [
      { key: "a1", elementId: "el-copper", subtypeId: "st-2", weight: 8 },
      { key: "a2", elementId: "el-aluminum", subtypeId: "st-3", weight: 3 },
      { key: "a3", elementId: "el-stainless", subtypeId: "st-8", weight: 12 },
      { key: "a4", elementId: "el-metal", subtypeId: "st-7", weight: 19 },
    ],
  },
  {
    id: "p2",
    serialId: "CBL-2026-0034",
    model: "",
    description: "Mixed copper cable bundle",
    uom: "kg",
    totalWeight: 15,
    buyingPrice: 4500,
    totalExpenses: 150,
    attributes: [
      { key: "a5", elementId: "el-copper", subtypeId: "st-1", weight: 9 },
      { key: "a6", elementId: "el-plastic", subtypeId: "st-10", weight: 6 },
    ],
  },
  {
    id: "p3",
    serialId: "APP-2026-0112",
    model: "Old laptop assorted",
    description: "Non-working laptop, scrap for metals and plastics",
    uom: "kg",
    totalWeight: 2.2,
    buyingPrice: 350,
    totalExpenses: 50,
    attributes: [
      { key: "a7", elementId: "el-aluminum", subtypeId: "st-3", weight: 0.6 },
      { key: "a8", elementId: "el-gold", subtypeId: "st-6", weight: 0.02 },
      { key: "a9", elementId: "el-plastic", subtypeId: "st-11", weight: 0.9 },
      { key: "a10", elementId: "el-stainless", subtypeId: "st-8", weight: 0.3 },
    ],
  },
];

const DEFAULT_BATCHES: Batch[] = [
  { id: "b1", elementId: "el-copper", subtypeId: "st-2", weight: 40, buyPrice: 15000 },
  { id: "b2", elementId: "el-aluminum", subtypeId: "st-3", weight: 25, buyPrice: 2000 },
  { id: "b3", elementId: "el-stainless", subtypeId: "st-8", weight: 15, buyPrice: 800 },
  { id: "b4", elementId: "el-gold", subtypeId: "st-6", weight: 0.05, buyPrice: 90000 },
  { id: "b5", elementId: "el-plastic", subtypeId: "st-10", weight: 50, buyPrice: 1200 },
];

const DEFAULT_ESTIMATE: Estimate = {
  sampleWeight: 1,
  saleWeight: 10,
  cost: 5000,
  rows: [
    { key: "e1", elementId: "el-copper", subtypeId: "st-1", weight: 0.75 },
    { key: "e2", elementId: "el-rubber", subtypeId: "st-9", weight: 0.25 },
  ],
};

// Every caller gets its own deep copy so mutating the returned data can
// never leak into the module-level defaults.
export function getDefaultLedgerData(): LedgerData {
  return {
    elements: structuredClone(DEFAULT_ELEMENTS),
    products: structuredClone(DEFAULT_PRODUCTS),
    batches: structuredClone(DEFAULT_BATCHES),
  };
}

export function getDefaultEstimate(): Estimate {
  return structuredClone(DEFAULT_ESTIMATE);
}
