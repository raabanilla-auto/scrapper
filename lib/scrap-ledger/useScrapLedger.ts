"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDefaultEstimate, getDefaultLedgerData } from "./defaults";
import {
  findElement,
  findSubtype,
  fmtCurrency,
  fmtSigned,
  fmtWeight,
  materialTotal,
  subtypeOptionsFor,
  syncProductToInventory,
  todayStr,
  uid,
  winLossColor,
} from "./logic";
import type {
  Batch,
  Estimate,
  LedgerData,
  Product,
  ProductDraft,
  ProductScreen,
  ScrapElement,
  Tab,
} from "./types";

const STORAGE_KEY = "scrapLedgerData";
const SYNC_DEBOUNCE_MS = 700;

type InvForm = { elementId: string; subtypeId: string; weight: string; buyPrice: string };
type SyncStatus = "local-only" | "syncing" | "synced" | "offline";

const emptyInvForm: InvForm = { elementId: "", subtypeId: "", weight: "", buyPrice: "" };

export function useScrapLedger() {
  const defaults = getDefaultLedgerData();
  const [tab, setTab] = useState<Tab>("products");
  const [elements, setElements] = useState<ScrapElement[]>(defaults.elements);
  const [products, setProducts] = useState<Product[]>(defaults.products);
  const [batches, setBatches] = useState<Batch[]>(defaults.batches);
  const [estimate, setEstimate] = useState<Estimate>(getDefaultEstimate());

  const [productScreen, setProductScreen] = useState<ProductScreen>("list");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<string | null>(null);

  const [invAdding, setInvAdding] = useState(false);
  const [invForm, setInvForm] = useState<InvForm>(emptyInvForm);

  const [confirmDeleteElementId, setConfirmDeleteElementId] = useState<string | null>(null);
  const [newElementName, setNewElementName] = useState("");
  const [openSubtypeMenuKey, setOpenSubtypeMenuKey] = useState<string | null>(null);
  const [trendSubtypeKey, setTrendSubtypeKey] = useState<{ elId: string; stId: string } | null>(null);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local-only");
  const [isOnline, setIsOnline] = useState(true);

  const [hydrated, setHydrated] = useState(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The server's updatedAt this device last confirmed matches what it has.
  // Compared against a fresh GET on load to decide who wins — see below.
  const versionRef = useRef<string | undefined>(undefined);

  // ── Hydration: localStorage first (instant, offline-safe), then try the
  // server as an enhancement. Server data only wins if it's strictly newer
  // than the version this device last synced — otherwise this device's
  // local copy (which may hold edits that never made it to the server, e.g.
  // the tab closed before the debounced PUT fired) is the one still in
  // play, and the persistence effect below pushes it back up.
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => {
      setIsOnline(false);
      setSyncStatus("offline");
    };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    (async () => {
      setIsOnline(navigator.onLine);
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw) as Partial<LedgerData> & { updatedAt?: string };
          if (data.elements) setElements(data.elements);
          if (data.products) setProducts(data.products);
          if (data.batches) setBatches(data.batches);
          versionRef.current = data.updatedAt;
        }
      } catch {
        // corrupt localStorage payload — keep in-memory defaults
      }

      try {
        const res = await fetch("/api/ledger");
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as LedgerData & { updatedAt: string };
        if (!versionRef.current || new Date(data.updatedAt) > new Date(versionRef.current)) {
          setElements(data.elements);
          setProducts(data.products);
          setBatches(data.batches);
          versionRef.current = data.updatedAt;
        }
        setSyncStatus("synced");
      } catch {
        setSyncStatus((s) => (s === "offline" ? s : "local-only"));
      } finally {
        setHydrated(true);
      }
    })();

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // ── Persistence: every data change is written to localStorage immediately
  // and pushed to the server (debounced, best-effort). A successful push
  // records the server's new updatedAt so the next load's version check
  // stays accurate.
  useEffect(() => {
    if (!hydrated) return;
    const data: LedgerData = { elements, products, batches };
    const stamp = (updatedAt: string | undefined) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, updatedAt }));
      } catch {
        // storage full / unavailable — server sync (if any) still applies
      }
    };
    stamp(versionRef.current);

    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      setSyncStatus("syncing");
      fetch("/api/ledger", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(async (res) => {
          // A reachable-but-erroring server (e.g. 503 when DATABASE_URL isn't
          // configured yet) is "local-only", not "offline" — the network is
          // fine, there's just nowhere to sync to yet.
          if (!res.ok) {
            setSyncStatus("local-only");
            return;
          }
          const row = (await res.json()) as { updatedAt: string };
          versionRef.current = row.updatedAt;
          stamp(row.updatedAt);
          setSyncStatus("synced");
        })
        .catch(() => setSyncStatus("offline"));
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [elements, products, batches, hydrated]);

  // ── Navigation ────────────────────────────────────────────────────────
  const goTab = useCallback((next: Tab) => setTab(next), []);
  const openProduct = useCallback((id: string) => {
    setProductScreen("view");
    setSelectedProductId(id);
  }, []);
  const backToList = useCallback(() => {
    setProductScreen("list");
    setSelectedProductId(null);
    setDraft(null);
  }, []);

  // ── Products ─────────────────────────────────────────────────────────
  const startAddProduct = useCallback(() => {
    setProductScreen("edit");
    setSelectedProductId(null);
    setDraft({
      id: null,
      serialId: "",
      model: "",
      description: "",
      uom: "kg",
      totalWeight: "",
      buyingPrice: "",
      totalExpenses: "",
      attributes: [],
    });
  }, []);

  const startEditProduct = useCallback(() => {
    const p = products.find((x) => x.id === selectedProductId);
    if (!p) return;
    setDraft(structuredClone(p));
    setProductScreen("edit");
  }, [products, selectedProductId]);

  const cancelEdit = useCallback(() => {
    setProductScreen(draft?.id ? "view" : "list");
    setDraft(null);
  }, [draft]);

  const updateDraft = useCallback(<K extends keyof ProductDraft>(field: K, value: ProductDraft[K]) => {
    setDraft((d) => (d ? { ...d, [field]: value } : d));
  }, []);

  const addAttrRow = useCallback(() => {
    setDraft((d) => {
      if (!d) return d;
      const firstEl = elements[0];
      const firstSt = firstEl?.subtypes[0];
      return {
        ...d,
        attributes: [
          ...d.attributes,
          { key: uid("a"), elementId: firstEl ? firstEl.id : "", subtypeId: firstSt ? firstSt.id : "", weight: "" },
        ],
      };
    });
  }, [elements]);

  const updateAttr = useCallback(
    (key: string, field: "elementId" | "subtypeId" | "weight", value: string) => {
      setDraft((d) => {
        if (!d) return d;
        const attributes = d.attributes.map((a) => {
          if (a.key !== key) return a;
          const next = { ...a, [field]: value };
          if (field === "elementId") {
            const el = findElement(elements, value);
            next.subtypeId = el?.subtypes[0] ? el.subtypes[0].id : "";
          }
          return next;
        });
        return { ...d, attributes };
      });
    },
    [elements],
  );

  const removeAttrRow = useCallback((key: string) => {
    setDraft((d) => (d ? { ...d, attributes: d.attributes.filter((a) => a.key !== key) } : d));
  }, []);

  const saveProduct = useCallback(() => {
    if (!draft || !draft.serialId) return;
    const id = draft.id ?? uid("p");
    const savedProduct: Product = { ...draft, id };
    setProducts((current) =>
      draft.id ? current.map((p) => (p.id === id ? savedProduct : p)) : [...current, savedProduct],
    );
    setBatches((current) => {
      const kept = current.filter((b) => b.sourceProductId !== id);
      const created = syncProductToInventory(elements, id, savedProduct);
      return [...kept, ...created];
    });
    setProductScreen("view");
    setSelectedProductId(id);
    setDraft(null);
  }, [draft, elements]);

  const requestDeleteProduct = useCallback((id: string | null) => setConfirmDeleteProductId(id), []);
  const cancelDeleteProduct = useCallback(() => setConfirmDeleteProductId(null), []);
  const confirmDeleteProductFn = useCallback(() => {
    setProducts((current) => current.filter((p) => p.id !== confirmDeleteProductId));
    setConfirmDeleteProductId(null);
    setProductScreen("list");
    setSelectedProductId(null);
  }, [confirmDeleteProductId]);

  // ── Inventory ────────────────────────────────────────────────────────
  const openAddInventory = useCallback(() => {
    const el = elements[0];
    const st = el?.subtypes[0];
    setInvForm({ elementId: el ? el.id : "", subtypeId: st ? st.id : "", weight: "", buyPrice: "" });
    setInvAdding(true);
  }, [elements]);
  const closeAddInventory = useCallback(() => setInvAdding(false), []);

  const updateInvForm = useCallback(
    (field: keyof InvForm, value: string) => {
      setInvForm((f) => {
        const next = { ...f, [field]: value };
        if (field === "elementId") {
          const el = findElement(elements, value);
          next.subtypeId = el?.subtypes[0] ? el.subtypes[0].id : "";
        }
        return next;
      });
    },
    [elements],
  );

  const saveInventory = useCallback(() => {
    if (!invForm.elementId || !invForm.subtypeId || !invForm.weight) return;
    const batch: Batch = {
      id: uid("b"),
      elementId: invForm.elementId,
      subtypeId: invForm.subtypeId,
      weight: Number(invForm.weight),
      buyPrice: Number(invForm.buyPrice) || 0,
    };
    setBatches((current) => [...current, batch]);
    setInvAdding(false);
  }, [invForm]);

  // ── Elements ─────────────────────────────────────────────────────────
  const addElement = useCallback(() => {
    const name = newElementName.trim();
    if (!name) return;
    setElements((current) => [...current, { id: uid("el"), name, subtypes: [] }]);
    setNewElementName("");
  }, [newElementName]);

  const requestDeleteElement = useCallback((id: string) => setConfirmDeleteElementId(id), []);
  const cancelDeleteElement = useCallback(() => setConfirmDeleteElementId(null), []);
  const confirmDeleteElementFn = useCallback(() => {
    setElements((current) => current.filter((e) => e.id !== confirmDeleteElementId));
    setConfirmDeleteElementId(null);
  }, [confirmDeleteElementId]);

  const renameElement = useCallback((id: string, name: string) => {
    setElements((current) => current.map((e) => (e.id === id ? { ...e, name } : e)));
  }, []);

  const addSubtype = useCallback((elId: string) => {
    setElements((current) =>
      current.map((e) =>
        e.id === elId
          ? { ...e, subtypes: [...e.subtypes, { id: uid("st"), name: "New Subtype", price: 0, history: [{ date: todayStr(), price: 0 }] }] }
          : e,
      ),
    );
  }, []);

  const updateSubtype = useCallback((elId: string, stId: string, field: "name" | "price", value: string) => {
    setElements((current) =>
      current.map((e) => {
        if (e.id !== elId) return e;
        return {
          ...e,
          subtypes: e.subtypes.map((st) =>
            st.id === stId ? { ...st, [field]: field === "price" ? Number(value) || 0 : value } : st,
          ),
        };
      }),
    );
  }, []);

  const logSubtypePriceChange = useCallback((elId: string, stId: string) => {
    setElements((current) =>
      current.map((e) => {
        if (e.id !== elId) return e;
        return {
          ...e,
          subtypes: e.subtypes.map((st) => {
            if (st.id !== stId) return st;
            const hist = st.history || [];
            const last = hist[hist.length - 1];
            if (last && last.price === st.price) return st;
            return { ...st, history: [...hist, { date: todayStr(), price: st.price }] };
          }),
        };
      }),
    );
  }, []);

  const deleteSubtype = useCallback((elId: string, stId: string) => {
    setElements((current) =>
      current.map((e) => (e.id === elId ? { ...e, subtypes: e.subtypes.filter((st) => st.id !== stId) } : e)),
    );
    setOpenSubtypeMenuKey(null);
  }, []);

  const toggleSubtypeMenu = useCallback((elId: string, stId: string) => {
    const key = elId + "|" + stId;
    setOpenSubtypeMenuKey((current) => (current === key ? null : key));
  }, []);

  const openTrend = useCallback((elId: string, stId: string) => {
    setTrendSubtypeKey({ elId, stId });
    setOpenSubtypeMenuKey(null);
  }, []);
  const closeTrend = useCallback(() => setTrendSubtypeKey(null), []);

  // ── Estimate ─────────────────────────────────────────────────────────
  const updateEstimateField = useCallback((field: "sampleWeight" | "saleWeight" | "cost", value: string) => {
    setEstimate((e) => ({ ...e, [field]: value }));
  }, []);

  const addEstimateRow = useCallback(() => {
    const firstEl = elements[0];
    const firstSt = firstEl?.subtypes[0];
    setEstimate((e) => ({
      ...e,
      rows: [
        ...e.rows,
        { key: uid("e"), elementId: firstEl ? firstEl.id : "", subtypeId: firstSt ? firstSt.id : "", weight: "" },
      ],
    }));
  }, [elements]);

  const updateEstimateRow = useCallback(
    (key: string, field: "elementId" | "subtypeId" | "weight", value: string) => {
      setEstimate((e) => ({
        ...e,
        rows: e.rows.map((r) => {
          if (r.key !== key) return r;
          const next = { ...r, [field]: value };
          if (field === "elementId") {
            const el = findElement(elements, value);
            next.subtypeId = el?.subtypes[0] ? el.subtypes[0].id : "";
          }
          return next;
        }),
      }));
    },
    [elements],
  );

  const removeEstimateRow = useCallback((key: string) => {
    setEstimate((e) => ({ ...e, rows: e.rows.filter((r) => r.key !== key) }));
  }, []);

  // ── Derived view model (ported from the design's renderVals()) ────────
  const elementOptions = elements.map((e) => ({ id: e.id, name: e.name }));

  const isProductsList = tab === "products" && productScreen === "list";
  const selectedProduct = selectedProductId ? products.find((p) => p.id === selectedProductId) : undefined;
  const isProductView = tab === "products" && productScreen === "view" && !!selectedProduct;
  const isProductEdit = tab === "products" && productScreen === "edit" && !!draft;
  const isInventoryTab = tab === "inventory";
  const isElementsTab = tab === "elements";
  const isEstimateTab = tab === "estimate";

  const productRows = products.map((p) => ({
    id: p.id,
    description: p.description,
    uom: p.uom,
    buyingPriceFmt: fmtCurrency(p.buyingPrice),
    materialTotalFmt: fmtCurrency(materialTotal(elements, p)),
    onSelect: () => openProduct(p.id),
  }));

  let viewProduct = {
    serialId: "",
    modelDisplay: "",
    description: "",
    uom: "",
    totalWeightFmt: "",
    buyingPriceFmt: "",
    totalExpensesFmt: "",
    materialTotalFmt: "",
  };
  let viewAttrRows: {
    elementName: string;
    subtypeName: string;
    weightFmt: string;
    pctFmt: string;
    valueFmt: string;
  }[] = [];
  if (selectedProduct) {
    viewProduct = {
      serialId: selectedProduct.serialId,
      modelDisplay: selectedProduct.model ? selectedProduct.model : "—",
      description: selectedProduct.description,
      uom: selectedProduct.uom,
      totalWeightFmt: fmtWeight(selectedProduct.totalWeight) + " " + (selectedProduct.uom || ""),
      buyingPriceFmt: fmtCurrency(selectedProduct.buyingPrice),
      totalExpensesFmt: fmtCurrency(selectedProduct.totalExpenses),
      materialTotalFmt: fmtCurrency(materialTotal(elements, selectedProduct)),
    };
    viewAttrRows = (selectedProduct.attributes || []).map((a) => {
      const el = findElement(elements, a.elementId);
      const st = findSubtype(elements, a.elementId, a.subtypeId);
      const price = st ? st.price : 0;
      const value = (Number(a.weight) || 0) * price;
      const totalWeight = Number(selectedProduct.totalWeight);
      const pct = totalWeight ? ((Number(a.weight) || 0) / totalWeight) * 100 : 0;
      return {
        elementName: el ? el.name : "—",
        subtypeName: st ? st.name : "—",
        weightFmt: fmtWeight(a.weight),
        pctFmt: pct.toFixed(1) + "%",
        valueFmt: fmtCurrency(value),
      };
    });
  }

  const draftAttrRows = draft
    ? draft.attributes.map((a) => ({
        key: a.key,
        elementId: a.elementId,
        subtypeId: a.subtypeId,
        weight: a.weight,
        elementOptions,
        subtypeOptions: subtypeOptionsFor(elements, a.elementId),
        onElementChange: (e: React.ChangeEvent<HTMLSelectElement>) => updateAttr(a.key, "elementId", e.target.value),
        onSubtypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => updateAttr(a.key, "subtypeId", e.target.value),
        onWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => updateAttr(a.key, "weight", e.target.value),
        onRemove: () => removeAttrRow(a.key),
      }))
    : [];
  const draftMaterialTotalFmt = draft ? fmtCurrency(materialTotal(elements, draft)) : fmtCurrency(0);
  const saveDisabled = !draft || !draft.serialId;

  const invMap = new Map<string, { elementId: string; subtypeId: string; weight: number; cost: number }>();
  batches.forEach((b) => {
    const key = b.elementId + "|" + b.subtypeId;
    const entry = invMap.get(key) ?? { elementId: b.elementId, subtypeId: b.subtypeId, weight: 0, cost: 0 };
    entry.weight += Number(b.weight) || 0;
    entry.cost += Number(b.buyPrice) || 0;
    invMap.set(key, entry);
  });
  const inventoryRows = Array.from(invMap.values()).map((row) => {
    const el = findElement(elements, row.elementId);
    const st = findSubtype(elements, row.elementId, row.subtypeId);
    const price = st ? st.price : 0;
    const total = row.weight * price;
    const wl = total - row.cost;
    return {
      elementName: el ? el.name : "—",
      subtypeName: st ? st.name : "—",
      weightFmt: fmtWeight(row.weight),
      priceFmt: fmtCurrency(price),
      costFmt: fmtCurrency(row.cost),
      totalFmt: fmtCurrency(total),
      winLossFmt: fmtSigned(wl),
      winLossColor: winLossColor(wl),
    };
  });

  let grandCostRaw = 0;
  let grandTotalRaw = 0;
  invMap.forEach((row) => {
    const st = findSubtype(elements, row.elementId, row.subtypeId);
    grandCostRaw += row.cost;
    grandTotalRaw += row.weight * (st ? st.price : 0);
  });
  const grandWinLossRaw = grandTotalRaw - grandCostRaw;

  const invSubtypeOptions = subtypeOptionsFor(elements, invForm.elementId);

  const elementsRows = elements.map((e) => ({
    id: e.id,
    name: e.name,
    onNameChange: (ev: React.ChangeEvent<HTMLInputElement>) => renameElement(e.id, ev.target.value),
    onDelete: () => requestDeleteElement(e.id),
    onAddSubtype: () => addSubtype(e.id),
    subtypes: e.subtypes.map((st) => ({
      id: st.id,
      name: st.name,
      price: st.price,
      menuOpen: openSubtypeMenuKey === e.id + "|" + st.id,
      onNameChange: (ev: React.ChangeEvent<HTMLInputElement>) => updateSubtype(e.id, st.id, "name", ev.target.value),
      onPriceChange: (ev: React.ChangeEvent<HTMLInputElement>) => updateSubtype(e.id, st.id, "price", ev.target.value),
      onPriceBlur: () => logSubtypePriceChange(e.id, st.id),
      onToggleMenu: () => toggleSubtypeMenu(e.id, st.id),
      onViewTrend: () => openTrend(e.id, st.id),
      onDelete: () => deleteSubtype(e.id, st.id),
    })),
  }));

  let trendData: {
    elementName: string;
    subtypeName: string;
    currentPriceFmt: string;
    historyRows: { date: string; priceFmt: string; barHeightPct: string }[];
  } | null = null;
  if (trendSubtypeKey) {
    const tel = findElement(elements, trendSubtypeKey.elId);
    const tst = findSubtype(elements, trendSubtypeKey.elId, trendSubtypeKey.stId);
    if (tel && tst) {
      const hist = tst.history?.length ? tst.history : [{ date: todayStr(), price: tst.price }];
      const maxPrice = Math.max(...hist.map((h) => h.price), 1);
      trendData = {
        elementName: tel.name,
        subtypeName: tst.name,
        currentPriceFmt: fmtCurrency(tst.price) + " / kg",
        historyRows: hist.map((h) => ({
          date: h.date,
          priceFmt: fmtCurrency(h.price),
          barHeightPct: Math.max(4, (h.price / maxPrice) * 100) + "%",
        })),
      };
    }
  }

  const estimateRows = estimate.rows.map((r) => ({
    key: r.key,
    elementId: r.elementId,
    subtypeId: r.subtypeId,
    weight: r.weight,
    elementOptions,
    subtypeOptions: subtypeOptionsFor(elements, r.elementId),
    onElementChange: (e: React.ChangeEvent<HTMLSelectElement>) => updateEstimateRow(r.key, "elementId", e.target.value),
    onSubtypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => updateEstimateRow(r.key, "subtypeId", e.target.value),
    onWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => updateEstimateRow(r.key, "weight", e.target.value),
    onRemove: () => removeEstimateRow(r.key),
  }));
  const sampleWeight = Number(estimate.sampleWeight) || 0;
  const saleWeight = Number(estimate.saleWeight) || 0;
  const ratio = sampleWeight > 0 ? saleWeight / sampleWeight : 0;
  const estProjectedRows = estimate.rows.map((r) => {
    const el = findElement(elements, r.elementId);
    const st = findSubtype(elements, r.elementId, r.subtypeId);
    const price = st ? st.price : 0;
    const projectedWeight = (Number(r.weight) || 0) * ratio;
    const value = projectedWeight * price;
    return {
      elementName: el ? el.name : "—",
      subtypeName: st ? st.name : "—",
      weightFmt: fmtWeight(projectedWeight),
      valueFmt: fmtCurrency(value),
      value,
    };
  });
  const estTotalRaw = estProjectedRows.reduce((sum, r) => sum + r.value, 0);
  const estCostRaw = Number(estimate.cost) || 0;
  const estWinLossRaw = estTotalRaw - estCostRaw;

  const deleteProductLabel = confirmDeleteProductId
    ? products.find((p) => p.id === confirmDeleteProductId)?.serialId ?? ""
    : "";
  const deleteElementLabel = confirmDeleteElementId
    ? elements.find((e) => e.id === confirmDeleteElementId)?.name ?? ""
    : "";

  let headerTitle = "Products";
  let headerSubtitle = "";
  if (tab === "products") {
    if (productScreen === "list") headerTitle = "Products";
    else if (productScreen === "view") {
      headerTitle = viewProduct.serialId;
      headerSubtitle = "Product Details";
    } else if (productScreen === "edit") headerTitle = draft?.id ? "Edit Product" : "Add Product";
  } else if (tab === "inventory") {
    headerTitle = "Inventory";
    headerSubtitle = "Recovered scrap ledger";
  } else if (tab === "elements") {
    headerTitle = "Elements";
    headerSubtitle = "Manage element types & pricing";
  } else if (tab === "estimate") {
    headerTitle = "Estimate";
    headerSubtitle = "Project value from a sample";
  }

  const showBottomNav = !(tab === "products" && (productScreen === "view" || productScreen === "edit"));
  const showBack = tab === "products" && productScreen !== "list";
  const showHeaderAction = (tab === "products" && productScreen === "list") || tab === "inventory";
  const headerActionLabel = tab === "products" ? "+ Add" : "+ Add Batch";

  return {
    syncStatus,
    isOnline,

    headerTitle,
    headerSubtitle,
    showBack,
    onBack: () => (productScreen === "edit" ? cancelEdit() : backToList()),
    showHeaderAction,
    headerActionLabel,
    headerActionFn: tab === "products" ? startAddProduct : openAddInventory,

    isProductsList,
    hasProducts: products.length > 0,
    noProducts: products.length === 0,
    productRows,
    isProductView,
    viewProduct,
    viewAttrRows,
    onEditProduct: startEditProduct,
    onDeleteProductClick: () => requestDeleteProduct(selectedProductId),

    isProductEdit,
    draft: draft ?? undefined,
    draftAttrRows,
    draftMaterialTotalFmt,
    saveDisabled,
    onSerialIdChange: (e: React.ChangeEvent<HTMLInputElement>) => updateDraft("serialId", e.target.value),
    onModelChange: (e: React.ChangeEvent<HTMLInputElement>) => updateDraft("model", e.target.value),
    onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => updateDraft("description", e.target.value),
    onUomChange: (e: React.ChangeEvent<HTMLInputElement>) => updateDraft("uom", e.target.value),
    onTotalWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => updateDraft("totalWeight", e.target.value),
    onBuyingPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => updateDraft("buyingPrice", e.target.value),
    onTotalExpensesChange: (e: React.ChangeEvent<HTMLInputElement>) => updateDraft("totalExpenses", e.target.value),
    onAddAttrRow: addAttrRow,
    onCancelEdit: cancelEdit,
    onSaveProduct: saveProduct,

    isInventoryTab,
    hasInventory: inventoryRows.length > 0,
    noInventory: inventoryRows.length === 0,
    inventoryRows,
    grandCostFmt: fmtCurrency(grandCostRaw),
    grandTotalFmt: fmtCurrency(grandTotalRaw),
    grandWinLossFmt: fmtSigned(grandWinLossRaw),
    grandWinLossColor: winLossColor(grandWinLossRaw),

    isElementsTab,
    elementsRows,
    newElementName,
    onNewElementNameChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewElementName(e.target.value),
    onAddElement: addElement,

    showBottomNav,
    tab,
    onGoProducts: () => goTab("products"),
    onGoInventory: () => goTab("inventory"),
    onGoElements: () => goTab("elements"),
    onGoEstimate: () => goTab("estimate"),

    isEstimateTab,
    estimate,
    estimateRows,
    estProjectedRows,
    estTotalFmt: fmtCurrency(estTotalRaw),
    estCostFmt: fmtCurrency(estCostRaw),
    estWinLossFmt: fmtSigned(estWinLossRaw),
    estWinLossColor: winLossColor(estWinLossRaw),
    onEstSampleWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => updateEstimateField("sampleWeight", e.target.value),
    onEstSaleWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => updateEstimateField("saleWeight", e.target.value),
    onEstCostChange: (e: React.ChangeEvent<HTMLInputElement>) => updateEstimateField("cost", e.target.value),
    onEstAddRow: addEstimateRow,

    invAdding,
    invForm,
    elementOptions,
    invSubtypeOptions,
    onInvElementChange: (e: React.ChangeEvent<HTMLSelectElement>) => updateInvForm("elementId", e.target.value),
    onInvSubtypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => updateInvForm("subtypeId", e.target.value),
    onInvWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => updateInvForm("weight", e.target.value),
    onInvBuyPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => updateInvForm("buyPrice", e.target.value),
    onCloseAddInventory: closeAddInventory,
    onSaveInventory: saveInventory,

    showDeleteProductModal: !!confirmDeleteProductId,
    deleteProductLabel,
    onCancelDeleteProduct: cancelDeleteProduct,
    onConfirmDeleteProduct: confirmDeleteProductFn,

    showDeleteElementModal: !!confirmDeleteElementId,
    deleteElementLabel,
    onCancelDeleteElement: cancelDeleteElement,
    onConfirmDeleteElement: confirmDeleteElementFn,

    showTrendModal: !!trendData,
    trend: trendData,
    onCloseTrend: closeTrend,
  };
}

export type ScrapLedgerViewModel = ReturnType<typeof useScrapLedger>;
