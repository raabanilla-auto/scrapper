import { prisma } from "@/lib/prisma";
import { getDefaultLedgerData } from "@/lib/scrap-ledger/defaults";
import type { LedgerData } from "@/lib/scrap-ledger/types";

export const dynamic = "force-dynamic";

const SINGLETON_ID = "singleton";

// The DB is an optional enhancement layer on top of localStorage (see
// useScrapLedger's sync effect) — when DATABASE_URL isn't configured yet,
// or the DB is unreachable, callers are expected to fall back to
// localStorage rather than treat this as fatal. 503 signals "try again /
// keep using local data" instead of a hard error.
function unavailable(error: unknown) {
  console.error("[api/ledger] database unavailable:", error);
  return Response.json(
    { error: "database unavailable — using local data only" },
    { status: 503 },
  );
}

export async function GET() {
  try {
    const row = await prisma.ledgerState.upsert({
      where: { id: SINGLETON_ID },
      update: {},
      create: { id: SINGLETON_ID, ...getDefaultLedgerData() },
    });
    return Response.json({
      elements: row.elements,
      products: row.products,
      batches: row.batches,
      updatedAt: row.updatedAt,
    });
  } catch (error) {
    return unavailable(error);
  }
}

export async function PUT(request: Request) {
  let body: Partial<LedgerData>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.elements) || !Array.isArray(body.products) || !Array.isArray(body.batches)) {
    return Response.json(
      { error: "expected { elements: [], products: [], batches: [] }" },
      { status: 400 },
    );
  }

  try {
    const row = await prisma.ledgerState.upsert({
      where: { id: SINGLETON_ID },
      update: { elements: body.elements, products: body.products, batches: body.batches },
      create: {
        id: SINGLETON_ID,
        elements: body.elements,
        products: body.products,
        batches: body.batches,
      },
    });
    return Response.json({
      elements: row.elements,
      products: row.products,
      batches: row.batches,
      updatedAt: row.updatedAt,
    });
  } catch (error) {
    return unavailable(error);
  }
}
