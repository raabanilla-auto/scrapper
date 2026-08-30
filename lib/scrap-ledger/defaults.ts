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

// Products and inventory start empty — real data is entered by the user.
// Element pricing above stays seeded since that's reference data, not demo
// records.
const DEFAULT_PRODUCTS: Product[] = [];

const DEFAULT_BATCHES: Batch[] = [];

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
